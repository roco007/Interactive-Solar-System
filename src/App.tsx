import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Orrery from "./components/Orrery";
import Controls from "./components/Controls";
import DetailPanel from "./components/DetailPanel";
import { ALL_BODIES, bodyById, type CelestialBody } from "./data/bodies";

/* ------------------------------------------------------------------ */
/*  Dock — quick-select chips for every body                           */
/* ------------------------------------------------------------------ */
const shortPeriod = (b: CelestialBody) =>
  b.kind === "star" ? "star" : b.periodDays < 1000 ? `${Math.round(b.periodDays)}d` : `${Math.round(b.periodDays / 365.25)}y`;

const Dock = memo(function Dock({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <footer className="relative z-20 border-t border-line/70 bg-[#070b16]/90">
      <div className="slim-scroll flex items-center gap-1.5 overflow-x-auto px-3 py-2.5 sm:px-5">
        <span className="mr-1 hidden shrink-0 font-mono text-[9px] tracking-[0.26em] text-fog/70 md:inline">
          WORLDS
        </span>
        {ALL_BODIES.map((b) => {
          const active = selectedId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onSelect(b.id)}
              className={`group flex shrink-0 items-center gap-2 rounded-md border px-2.5 py-1.5 text-left transition-all duration-200 active:scale-95 ${
                active
                  ? "border-solar/70 bg-solar/10"
                  : "border-line/80 bg-hull/40 hover:-translate-y-0.5 hover:border-fog/50 hover:bg-hull/80"
              }`}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full transition-shadow duration-200"
                style={{
                  background: `radial-gradient(circle at 35% 30%, ${b.colorPale}, ${b.color} 55%, ${b.colorDeep})`,
                  boxShadow: active ? `0 0 10px ${b.color}` : `0 0 5px ${b.color}66`,
                }}
              />
              <span className="flex flex-col leading-none">
                <span className={`text-[12px] font-semibold ${active ? "text-ice" : "text-fog group-hover:text-ice"}`}>
                  {b.name}
                </span>
                <span className="mt-0.5 font-mono text-[9px] tracking-wider text-fog/60">
                  {shortPeriod(b)}
                </span>
              </span>
            </button>
          );
        })}
        <span className="ml-auto hidden shrink-0 pl-4 font-mono text-[9px] leading-relaxed tracking-[0.18em] text-fog/50 lg:block">
          DISTANCES COMPRESSED · SIZES ENLARGED
          <br />
          ORBITAL PERIODS TRUE TO RATIO
        </span>
      </div>
    </footer>
  );
});

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
export default function App() {
  const [playing, setPlaying] = useState<boolean>(() =>
    typeof window === "undefined"
      ? true
      : !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [speed, setSpeed] = useState(1);
  const [simDays, setSimDays] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  /* simulation clock */
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      setSimDays((d) => d + dt * 10 * speed);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  const selected = bodyById(selectedId);
  const selectedIdx = selected ? ALL_BODIES.findIndex((b) => b.id === selected.id) : -1;
  const prevName = selected ? ALL_BODIES[(selectedIdx + ALL_BODIES.length - 1) % ALL_BODIES.length].name : "";
  const nextName = selected ? ALL_BODIES[(selectedIdx + 1) % ALL_BODIES.length].name : "";

  const handleSelect = useCallback((id: string) => {
    setSelectedId((cur) => (id === "" ? null : id === cur ? null : id));
  }, []);

  const stepBody = useCallback(
    (dir: 1 | -1) => {
      setSelectedId((cur) => {
        const idx = cur ? ALL_BODIES.findIndex((b) => b.id === cur) : -1;
        const next = idx === -1 ? (dir === 1 ? 0 : ALL_BODIES.length - 1) : (idx + dir + ALL_BODIES.length) % ALL_BODIES.length;
        return ALL_BODIES[next].id;
      });
    },
    []
  );

  const clampSpeed = useCallback((s: number) => Math.min(200, Math.max(0.25, s)), []);

  /* keyboard transport */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          setPlaying((p) => !p);
          break;
        case "r":
        case "R":
          setSimDays(0);
          break;
        case "o":
        case "O":
          setShowOrbits((v) => !v);
          break;
        case "l":
        case "L":
          setShowLabels((v) => !v);
          break;
        case "Escape":
          setSelectedId(null);
          break;
        case "ArrowRight":
          e.preventDefault();
          stepBody(1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          stepBody(-1);
          break;
        case "+":
        case "=":
          setSpeed((s) => clampSpeed(s * 2));
          break;
        case "-":
        case "_":
          setSpeed((s) => clampSpeed(s / 2));
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepBody, clampSpeed]);

  /* mission clock readout */
  const clock = useMemo(() => {
    const years = Math.floor(simDays / 365.25);
    const days = Math.floor(simDays - years * 365.25);
    return `T+ ${String(years).padStart(2, "0")}y ${String(days).padStart(3, "0")}d`;
  }, [simDays]);

  return (
    <div className="space-bg flex h-dvh flex-col overflow-hidden text-ice">
      {/* ---------------- header ---------------- */}
      <header className="relative z-30 border-b border-line/70 bg-[#070b16]/85">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden>
              <circle cx="20" cy="20" r="5" fill="#f6b73c" />
              <ellipse cx="20" cy="20" rx="15" ry="7" fill="none" stroke="#33456f" strokeWidth="1.2" transform="rotate(-16 20 20)" />
              <circle cx="32.5" cy="13.5" r="2.4" fill="#6fd3e0" />
              <ellipse cx="20" cy="20" rx="9" ry="4.2" fill="none" stroke="#33456f" strokeWidth="1" transform="rotate(-16 20 20)" />
              <circle cx="12.5" cy="24" r="1.7" fill="#e06a3c" />
            </svg>
            <div className="min-w-0 leading-tight">
              <div className="font-mono text-[9px] tracking-[0.32em] text-comet/90">
                LIVE ORRERY <span className="text-fog/50">·</span> <span className="text-fog">SOL-3 SYSTEM</span>
              </div>
              <h1 className="font-disp truncate text-lg font-bold tracking-tight text-ice sm:text-xl">
                The Solar System<span className="text-solar">.</span>
              </h1>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-x-6 gap-y-2.5">
            {/* mission clock */}
            <div className="flex items-center gap-2.5 rounded-md border border-line/80 bg-hull/50 px-3 py-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${playing ? "live-dot bg-comet" : "bg-ember"}`}
                title={playing ? "Simulation running" : "Simulation paused"}
              />
              <div className="leading-none">
                <div className="font-mono text-[8px] tracking-[0.26em] text-fog/70">MISSION CLOCK</div>
                <div className="mt-1 font-mono text-[15px] font-semibold tracking-wide text-solar">{clock}</div>
              </div>
            </div>

            <Controls
              playing={playing}
              onTogglePlay={() => setPlaying((p) => !p)}
              speed={speed}
              onSpeedChange={setSpeed}
              onReset={() => setSimDays(0)}
              showOrbits={showOrbits}
              showLabels={showLabels}
              onToggleOrbits={() => setShowOrbits((v) => !v)}
              onToggleLabels={() => setShowLabels((v) => !v)}
            />
          </div>
        </div>
      </header>

      {/* ---------------- simulation stage ---------------- */}
      <main className="relative min-h-0 flex-1">
        <Orrery
          simDays={simDays}
          speed={speed}
          paused={!playing}
          selectedId={selectedId}
          onSelect={handleSelect}
          showOrbits={showOrbits}
          showLabels={showLabels}
        />
        <div className="vignette pointer-events-none absolute inset-0" />

        {/* onboarding hint */}
        <div
          className={`pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 transition-all duration-700 ${
            selectedId ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="flex items-center gap-2.5 rounded-full border border-solar/40 bg-[#0a101f]/90 px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-solar" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3.2" />
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
            </svg>
            <span className="whitespace-nowrap font-mono text-[10.5px] tracking-[0.14em] text-ice/85">
              CLICK ANY WORLD FOR ITS DOSSIER <span className="text-fog/60">· SPACE PAUSES · ←→ HOPS PLANETS</span>
            </span>
          </div>
        </div>

        {selected && (
          <DetailPanel
            body={selected}
            onClose={() => setSelectedId(null)}
            onStep={stepBody}
            prevName={prevName}
            nextName={nextName}
          />
        )}
      </main>

      {/* ---------------- dock ---------------- */}
      <Dock selectedId={selectedId} onSelect={handleSelect} />
    </div>
  );
}
