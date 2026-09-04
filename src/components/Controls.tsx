const SPEED_MIN = 0.25;
const SPEED_MAX = 200;
const PRESETS = [0.5, 1, 5, 25, 100];

const toSlider = (speed: number) =>
  (100 * Math.log(speed / SPEED_MIN)) / Math.log(SPEED_MAX / SPEED_MIN);
const fromSlider = (v: number) =>
  SPEED_MIN * Math.pow(SPEED_MAX / SPEED_MIN, v / 100);

export const formatSpeed = (s: number) =>
  s >= 10 ? `×${Math.round(s)}` : `×${s.toFixed(s < 1 ? 2 : 1)}`;

interface ControlsProps {
  playing: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  onReset: () => void;
  showOrbits: boolean;
  showLabels: boolean;
  onToggleOrbits: () => void;
  onToggleLabels: () => void;
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.52.86l10.2-6.5a1 1 0 0 0 0-1.7L9.52 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <rect x="6.5" y="5" width="3.6" height="14" rx="1" />
      <rect x="13.9" y="5" width="3.6" height="14" rx="1" />
    </svg>
  );
}
function IconReset() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 10a8 8 0 1 1 1.7 6.3" />
      <path d="M4 10V4.5M4 10h5.5" />
    </svg>
  );
}
function IconOrbit() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <ellipse cx="12" cy="12" rx="9" ry="4.5" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="20" cy="9" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <path d="M4 7h10l6 5-6 5H4z" strokeLinejoin="round" />
      <circle cx="8" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Controls({
  playing,
  onTogglePlay,
  speed,
  onSpeedChange,
  onReset,
  showOrbits,
  showLabels,
  onToggleOrbits,
  onToggleLabels,
}: ControlsProps) {
  const sliderVal = toSlider(speed);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {/* transport */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlay}
          aria-label={playing ? "Pause simulation" : "Play simulation"}
          title={playing ? "Pause (Space)" : "Play (Space)"}
          className="group grid h-11 w-11 place-items-center rounded-full bg-solar text-[#1d1200] shadow-[0_0_22px_rgba(246,183,60,0.4)] transition-all duration-200 hover:bg-[#ffd066] hover:shadow-[0_0_32px_rgba(246,183,60,0.65)] active:scale-90"
        >
          {playing ? <IconPause /> : <IconPlay />}
        </button>
        <button
          onClick={onReset}
          aria-label="Reset simulation clock"
          title="Reset clock (R)"
          className="grid h-9 w-9 place-items-center rounded-full border border-line text-fog transition-all duration-200 hover:border-solar/60 hover:text-solar active:scale-90"
        >
          <IconReset />
        </button>
      </div>

      {/* speed */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.22em] text-fog">TEMPO</span>
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={sliderVal}
              aria-label="Simulation speed"
              onChange={(e) => onSpeedChange(fromSlider(Number(e.target.value)))}
              className="speed-range w-32 sm:w-40"
              style={{ ["--fill" as string]: `${sliderVal}%` }}
            />
            <span className="w-14 font-mono text-sm font-semibold text-solar">
              {formatSpeed(speed)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {PRESETS.map((p) => {
              const active = Math.abs(speed - p) < 0.06;
              return (
                <button
                  key={p}
                  onClick={() => onSpeedChange(p)}
                  className={`rounded border px-1.5 py-0.5 font-mono text-[10px] transition-all duration-150 active:scale-95 ${
                    active
                      ? "border-solar/80 bg-solar/15 text-solar"
                      : "border-line text-fog hover:border-fog/60 hover:text-ice"
                  }`}
                >
                  {p}×
                </button>
              );
            })}
            <span className="ml-2 hidden font-mono text-[10px] text-fog/70 md:inline">
              ≈ {Math.round(10 * speed).toLocaleString()} sim-days / s
            </span>
          </div>
        </div>
      </div>

      {/* layer toggles */}
      <div className="flex items-center gap-1.5 border-l border-line/70 pl-4">
        <button
          onClick={onToggleOrbits}
          aria-pressed={showOrbits}
          title="Toggle orbit paths (O)"
          className={`grid h-9 w-9 place-items-center rounded-md border transition-all duration-200 active:scale-90 ${
            showOrbits
              ? "border-solar/70 bg-solar/10 text-solar"
              : "border-line text-fog hover:border-fog/60 hover:text-ice"
          }`}
        >
          <IconOrbit />
        </button>
        <button
          onClick={onToggleLabels}
          aria-pressed={showLabels}
          title="Toggle name labels (L)"
          className={`grid h-9 w-9 place-items-center rounded-md border transition-all duration-200 active:scale-90 ${
            showLabels
              ? "border-solar/70 bg-solar/10 text-solar"
              : "border-line text-fog hover:border-fog/60 hover:text-ice"
          }`}
        >
          <IconTag />
        </button>
      </div>
    </div>
  );
}
