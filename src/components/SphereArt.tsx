import type { CelestialBody } from "../data/bodies";

interface SphereArtProps {
  body: CelestialBody;
  idp: string; // unique id prefix so gradient ids never collide
}

/**
 * Renders a shaded planetary sphere (plus rings / bands / terrain where
 * relevant), centered on (0,0) at the body's display radius.
 * The caller wraps it in a positioned <g> or a scaled <svg>.
 */
export default function SphereArt({ body, idp }: SphereArtProps) {
  const R = body.radius;
  const ring = body.ring;
  const gid = `${idp}-grad`;
  const clipId = `${idp}-clip`;

  return (
    <>
      <defs>
        <radialGradient id={gid} cx="36%" cy="30%" r="80%">
          <stop offset="0%" stopColor={body.colorPale} />
          <stop offset="42%" stopColor={body.color} />
          <stop offset="100%" stopColor={body.colorDeep} />
        </radialGradient>
        {(body.bands || body.terra) && (
          <clipPath id={clipId}>
            <circle r={R} cx={0} cy={0} />
          </clipPath>
        )}
      </defs>

      {/* rings — back pass (planet body will cover the middle) */}
      {ring && (
        <g transform={`rotate(${ring.rot})`} opacity={ring.faint ? 0.55 : 0.9}>
          <ellipse
            rx={R * ring.rx}
            ry={R * ring.ry}
            fill="none"
            stroke={ring.color}
            strokeWidth={ring.width}
            opacity={0.85}
          />
          {!ring.faint && (
            <ellipse
              rx={R * (ring.rx - 0.32)}
              ry={R * (ring.ry - 0.1)}
              fill="none"
              stroke="#f4e5bd"
              strokeWidth={1.1}
              opacity={0.6}
            />
          )}
        </g>
      )}

      {/* sphere */}
      <g className="sphere">
        <circle r={R} fill={`url(#${gid})`} />
        {body.bands && (
          <g clipPath={`url(#${clipId})`}>
            <rect x={-R} y={-R * 0.62} width={2 * R} height={R * 0.26} fill={body.colorDeep} opacity={0.32} />
            <rect x={-R} y={-R * 0.18} width={2 * R} height={R * 0.3} fill={body.colorPale} opacity={0.3} />
            <rect x={-R} y={R * 0.3} width={2 * R} height={R * 0.24} fill={body.colorDeep} opacity={0.3} />
            <rect x={-R} y={R * 0.66} width={2 * R} height={R * 0.2} fill={body.colorPale} opacity={0.18} />
            {body.spot && (
              <ellipse cx={R * 0.34} cy={R * 0.34} rx={R * 0.24} ry={R * 0.14} fill="#d95f3b" opacity={0.9} />
            )}
          </g>
        )}
        {body.terra && (
          <g clipPath={`url(#${clipId})`}>
            <ellipse cx={-R * 0.28} cy={-R * 0.12} rx={R * 0.42} ry={R * 0.3} fill="#4c9b57" opacity={0.95} />
            <ellipse cx={R * 0.34} cy={R * 0.3} rx={R * 0.3} ry={R * 0.22} fill="#3f8a4c" opacity={0.9} />
            <ellipse cx={R * 0.05} cy={-R * 0.85} rx={R * 0.55} ry={R * 0.2} fill="#eef7ff" opacity={0.85} />
            <ellipse cx={-R * 0.1} cy={R * 0.88} rx={R * 0.5} ry={R * 0.18} fill="#eef7ff" opacity={0.7} />
            <ellipse
              cx={R * 0.1}
              cy={-R * 0.38}
              rx={R * 0.55}
              ry={R * 0.13}
              fill="#ffffff"
              opacity={0.28}
              transform={`rotate(-14 ${R * 0.1} ${-R * 0.38})`}
            />
          </g>
        )}
        {/* terminator shading */}
        <circle
          r={R}
          fill="none"
          stroke="rgba(2,4,10,0.5)"
          strokeWidth={Math.max(0.8, R * 0.12)}
          opacity={0.55}
        />
      </g>

      {/* rings — front pass */}
      {ring && (
        <g transform={`rotate(${ring.rot})`} opacity={ring.faint ? 0.6 : 0.95}>
          <path
            d={`M ${-R * ring.rx} 0 A ${R * ring.rx} ${R * ring.ry} 0 0 0 ${R * ring.rx} 0`}
            fill="none"
            stroke={ring.color}
            strokeWidth={ring.width}
          />
          {!ring.faint && (
            <path
              d={`M ${-R * (ring.rx - 0.32)} 0 A ${R * (ring.rx - 0.32)} ${R * (ring.ry - 0.1)} 0 0 0 ${R * (ring.rx - 0.32)} 0`}
              fill="none"
              stroke="#f4e5bd"
              strokeWidth={1.1}
              opacity={0.65}
            />
          )}
        </g>
      )}
    </>
  );
}
