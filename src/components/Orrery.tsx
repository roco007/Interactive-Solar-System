import { useMemo, useState } from "react";
import { PLANETS, SUN, orbitRadius, type CelestialBody } from "../data/bodies";
import SphereArt from "./SphereArt";

export const VB_W = 1200;
export const VB_H = 640;
export const CX = 600;
export const CY = 316;
const TILT = 0.55; // vertical squash — suggests the ecliptic plane seen at an angle
const BASE_DAYS_PER_SEC = 10; // at 1× speed

interface OrreryProps {
  simDays: number;
  speed: number;
  paused: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showOrbits: boolean;
  showLabels: boolean;
}

/* deterministic starfield */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  cls: string;
  delay: string;
  tint: string;
}

function useStars(count: number, seed: number): Star[] {
  return useMemo(() => {
    const rnd = mulberry32(seed);
    const tints = ["#cdd9f5", "#cdd9f5", "#cdd9f5", "#ffd9a0", "#a8c8ff", "#f5b8c4"];
    const classes = ["", "tw-a", "tw-b", "tw-c"];
    return Array.from({ length: count }, () => ({
      x: rnd() * (VB_W + 160) - 80,
      y: rnd() * (VB_H + 80) - 40,
      r: 0.4 + rnd() * 1.15,
      o: 0.2 + rnd() * 0.65,
      cls: classes[Math.floor(rnd() * classes.length)],
      delay: `${(rnd() * 6).toFixed(2)}s`,
      tint: tints[Math.floor(rnd() * tints.length)],
    }));
  }, [count, seed]);
}

function Starfield() {
  const near = useStars(110, 42);
  const far = useStars(70, 1337);
  return (
    <g>
      <ellipse cx={935} cy={110} rx={360} ry={190} fill="url(#neb-teal)" />
      <ellipse cx={205} cy={540} rx={400} ry={210} fill="url(#neb-warm)" />
      <ellipse cx={620} cy={600} rx={520} ry={160} fill="url(#neb-teal)" opacity={0.5} />
      <g className="star-drift">
        {far.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r * 0.7} fill={s.tint} opacity={s.o * 0.55} className={s.cls} style={{ animationDelay: s.delay }} />
        ))}
      </g>
      <g className="star-drift" style={{ animationDuration: "340s" }}>
        {near.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.tint} opacity={s.o} className={s.cls} style={{ animationDelay: s.delay }} />
        ))}
      </g>
    </g>
  );
}

function TrailArc({ body, theta, speed }: { body: CelestialBody; theta: number; speed: number }) {
  const r = orbitRadius(body.au);
  const ry = r * TILT;
  // trail covers ~0.6 s of motion at the current speed
  const span = Math.min(Math.max(((Math.PI * 2) / body.periodDays) * 10 * speed * 0.6, 0.16), 1.2);
  const a0 = theta - span;
  const x1 = CX + r * Math.cos(a0);
  const y1 = CY + ry * Math.sin(a0);
  const x2 = CX + r * Math.cos(theta);
  const y2 = CY + ry * Math.sin(theta);
  return (
    <path
      d={`M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${ry.toFixed(2)} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`}
      fill="none"
      stroke={body.color}
      strokeWidth={Math.max(1.6, body.radius * 0.4)}
      strokeLinecap="round"
      opacity={0.4}
    />
  );
}

function PlanetNode({
  body,
  theta,
  selected,
  dimmed,
  labelVisible,
  onSelect,
}: {
  body: CelestialBody;
  theta: number;
  selected: boolean;
  dimmed: boolean;
  labelVisible: boolean;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const r = orbitRadius(body.au);
  const x = CX + r * Math.cos(theta);
  const y = CY + r * TILT * Math.sin(theta);
  const labelLeft = x > VB_W - 150;
  const hot = hovered || selected;

  return (
    <g
      className={`planet-node ${hot ? "is-hot" : ""}`}
      transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}
      opacity={dimmed ? 0.45 : 1}
      style={{ transition: "opacity .3s ease" }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(body.id);
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <circle className="halo" r={body.radius + 7} fill="none" stroke={body.color} strokeWidth={1.4} strokeDasharray="3 5" />
      <SphereArt body={body} idp={`or-${body.id}`} />
      {body.moonlet && <Moonlet simTheta={theta} />}
      {selected && (
        <circle className="reticle" r={body.radius + 12} fill="none" stroke="#f6b73c" strokeWidth={1.2} strokeDasharray="10 7" opacity={0.9} />
      )}
      {labelVisible && (
        <text
          className={`body-label ${selected ? "body-label-hot" : ""}`}
          x={labelLeft ? -(body.radius + 10) : body.radius + 10}
          y={4}
          textAnchor={labelLeft ? "end" : "start"}
        >
          {body.name.toUpperCase()}
        </text>
      )}
      {/* generous invisible hit area */}
      <circle r={Math.max(17, body.radius + 11)} fill="transparent" />
    </g>
  );
}

function Moonlet({ simTheta }: { simTheta: number }) {
  // purely decorative companion; angle derived from simTheta so it freezes on pause
  const a = simTheta * 13.4;
  const mx = Math.cos(a) * 12;
  const my = Math.sin(a) * 4.4;
  return <circle cx={mx} cy={my} r={1.7} fill="#cfd8ea" opacity={0.9} />;
}

function SunNode({ selected, onSelect }: { selected: boolean; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <g
      className={`planet-node ${hovered || selected ? "is-hot" : ""}`}
      transform={`translate(${CX} ${CY})`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("sun");
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <circle className="sun-corona" r={82} fill="url(#corona)" />
      <circle className="sun-corona" r={50} fill="url(#corona)" style={{ animationDelay: "-2.7s" }} />
      <g className="sun-core">
        <circle r={SUN.radius} fill="url(#sun-grad)" />
        <circle r={SUN.radius} fill="url(#sun-grain)" opacity={0.5} />
      </g>
      {(hovered || selected) && (
        <circle r={SUN.radius + 8} fill="none" stroke="#f6b73c" strokeWidth={1.2} strokeDasharray="3 5" opacity={0.8} />
      )}
      {selected && <circle className="reticle" r={SUN.radius + 14} fill="none" stroke="#f6b73c" strokeWidth={1.2} strokeDasharray="10 7" />}
      <text className={`body-label ${selected ? "body-label-hot" : ""}`} x={0} y={SUN.radius + 26} textAnchor="middle">
        SOL
      </text>
      <circle r={44} fill="transparent" />
    </g>
  );
}

export default function Orrery({ simDays, speed, selectedId, onSelect, showOrbits, showLabels, paused }: OrreryProps) {
  const positioned = PLANETS.map((b) => {
    const theta = b.startAngle + (Math.PI * 2 * simDays) / b.periodDays;
    return { body: b, theta, sin: Math.sin(theta) };
  });
  const far = positioned.filter((p) => p.sin < 0).sort((a, b) => a.sin - b.sin);
  const near = positioned.filter((p) => p.sin >= 0).sort((a, b) => a.sin - b.sin);
  const renderPlanet = (p: (typeof positioned)[number]) => (
    <PlanetNode
      key={p.body.id}
      body={p.body}
      theta={p.theta}
      selected={selectedId === p.body.id}
      dimmed={selectedId !== null && selectedId !== p.body.id && selectedId !== "sun"}
      labelVisible={showLabels || selectedId === p.body.id}
      onSelect={onSelect}
    />
  );

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Interactive map of the Solar System"
      onClick={() => onSelect("")}
    >
      <defs>
        <radialGradient id="sun-grad" cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#fff8d9" />
          <stop offset="28%" stopColor="#ffd76e" />
          <stop offset="62%" stopColor="#f6a832" />
          <stop offset="100%" stopColor="#dd741d" />
        </radialGradient>
        <radialGradient id="sun-grain" cx="60%" cy="62%" r="70%">
          <stop offset="0%" stopColor="rgba(190,80,10,0.35)" />
          <stop offset="55%" stopColor="rgba(190,80,10,0.08)" />
          <stop offset="100%" stopColor="rgba(190,80,10,0)" />
        </radialGradient>
        <radialGradient id="corona">
          <stop offset="0%" stopColor="rgba(255,196,92,0.34)" />
          <stop offset="45%" stopColor="rgba(255,160,60,0.12)" />
          <stop offset="100%" stopColor="rgba(255,160,60,0)" />
        </radialGradient>
        <radialGradient id="neb-teal">
          <stop offset="0%" stopColor="rgba(96,196,205,0.09)" />
          <stop offset="100%" stopColor="rgba(96,196,205,0)" />
        </radialGradient>
        <radialGradient id="neb-warm">
          <stop offset="0%" stopColor="rgba(235,140,70,0.07)" />
          <stop offset="100%" stopColor="rgba(235,140,70,0)" />
        </radialGradient>
      </defs>

      <Starfield />

      {/* ecliptic reference line */}
      <line x1={70} x2={VB_W - 70} y1={CY} y2={CY} stroke="#22304f" strokeWidth={1} strokeDasharray="1 9" opacity={0.6} />

      {/* orbit paths */}
      {showOrbits &&
        PLANETS.map((b) => {
          const r = orbitRadius(b.au);
          const active = selectedId === b.id;
          const dimmed = selectedId !== null && selectedId !== b.id;
          return (
            <ellipse
              key={b.id}
              className="orbit-path"
              cx={CX}
              cy={CY}
              rx={r}
              ry={r * TILT}
              fill="none"
              stroke={active ? b.color : "#33456f"}
              strokeWidth={active ? 1.5 : 1}
              strokeOpacity={active ? 0.85 : dimmed ? 0.16 : 0.42}
            />
          );
        })}

      {/* motion trails */}
      {!paused &&
        positioned.map((p) => <TrailArc key={`t-${p.body.id}`} body={p.body} theta={p.theta} speed={speed} />)}

      {far.map(renderPlanet)}
      <SunNode selected={selectedId === "sun"} onSelect={onSelect} />
      {near.map(renderPlanet)}
    </svg>
  );
}
