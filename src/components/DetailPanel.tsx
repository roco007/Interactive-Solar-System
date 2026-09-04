import type { CelestialBody } from "../data/bodies";
import { formatNumber } from "../data/bodies";
import SphereArt from "./SphereArt";

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

interface DetailPanelProps {
  body: CelestialBody;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
  prevName: string;
  nextName: string;
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md border border-line/70 bg-hull/50 px-3 py-2.5 transition-colors duration-200 hover:border-fog/40">
      <div className="font-mono text-[9px] tracking-[0.22em] text-fog/80">{label}</div>
      <div className={`mt-1 font-mono text-[13px] font-medium leading-snug ${accent ? "text-solar" : "text-ice"}`}>
        {value}
      </div>
    </div>
  );
}

export default function DetailPanel({ body, onClose, onStep, prevName, nextName }: DetailPanelProps) {
  const isStar = body.kind === "star";
  const ringPad = body.ring ? body.ring.rx + 0.25 : 1.28;
  const half = body.radius * ringPad + 4;
  const kicker = isStar ? "STAR · SYSTEM CENTER" : `PLANET · ${ORDINALS[body.order - 1].toUpperCase()} FROM THE SUN`;

  return (
    <aside
      key={body.id}
      className="panel-in slim-scroll pointer-events-auto absolute overflow-y-auto rounded-lg border border-line/80 bg-[#0a101f]/[0.97] shadow-[0_24px_70px_rgba(0,0,0,0.6)]
        max-sm:inset-x-2 max-sm:bottom-2 max-sm:max-h-[56dvh]
        sm:bottom-3 sm:right-3 sm:top-3 sm:w-[352px]"
      aria-label={`${body.name} details`}
    >
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${body.color}, transparent 85%)` }} />

      <div className="p-5">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-[9px] tracking-[0.28em] text-fog/80">DOSSIER</div>
            <div className="mt-0.5 font-mono text-[10px] tracking-[0.18em]" style={{ color: body.color }}>
              {kicker}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-line text-fog transition-all duration-150 hover:border-fog/60 hover:text-ice active:scale-90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* glyph + name */}
        <div className="mt-4 flex items-center gap-4">
          <svg
            viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`}
            className="h-[104px] w-[104px] shrink-0"
            aria-hidden
          >
            {isStar && (
              <circle r={body.radius * 1.45} fill={body.color} opacity={0.14} />
            )}
            <SphereArt body={body} idp={`panel-${body.id}`} />
          </svg>
          <div className="min-w-0">
            <h2 className="font-disp text-[26px] font-bold leading-tight text-ice" style={{ textShadow: `0 0 26px ${body.color}55` }}>
              {body.name}
            </h2>
            <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] tracking-[0.14em] text-fog">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: body.color }} />
              {isStar ? "G-TYPE MAIN SEQUENCE" : `ORDER ${body.order} · ${body.au} AU`}
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Stat label="SIZE · DIAMETER" value={`${formatNumber(body.diameterKm)} km`} />
          <Stat label="DISTANCE FROM SUN" value={isStar ? "System center" : body.distLabel} accent={!isStar} />
          <Stat label="ORBITAL PERIOD" value={isStar ? "—" : body.periodLabel} accent={!isStar} />
          <Stat label="DAY LENGTH" value={body.dayLength} />
          <Stat label="MOONS" value={body.moons} />
          <Stat label="TEMPERATURE" value={body.temp} />
        </div>

        {/* field note */}
        <div
          className="mt-4 rounded-r-md border-l-2 bg-hull/40 px-3.5 py-3"
          style={{ borderColor: body.color }}
        >
          <div className="font-mono text-[9px] tracking-[0.24em] text-fog/80">FIELD NOTE</div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ice/85">{body.fact}</p>
        </div>

        {/* prev / next */}
        <div className="mt-5 flex items-center justify-between gap-2 border-t border-line/60 pt-4">
          <button
            onClick={() => onStep(-1)}
            className="group flex min-w-0 items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[11px] text-fog transition-all duration-150 hover:border-solar/60 hover:text-solar active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            <span className="truncate">{prevName}</span>
          </button>
          <span className="font-mono text-[9px] tracking-[0.2em] text-fog/60">
            {body.order + 1} / 9
          </span>
          <button
            onClick={() => onStep(1)}
            className="group flex min-w-0 items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[11px] text-fog transition-all duration-150 hover:border-solar/60 hover:text-solar active:scale-95"
          >
            <span className="truncate">{nextName}</span>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
