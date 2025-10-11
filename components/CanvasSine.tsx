'use client';
import { useMemo } from 'react';
import { useFormulaStore } from '@/lib/state/store';

const WIDTH = 700;
const HEIGHT = 360;
const PAD_X = 50;
const PAD_Y = 30;
const T_MIN = 0;
const T_MAX = 2 * Math.PI;

function mapX(t: number) {
  return PAD_X + (t - T_MIN) / (T_MAX - T_MIN) * (WIDTH - 2 * PAD_X);
}

function mapY(x: number, ymin: number, ymax: number) {
  const clampedRange = ymax - ymin || 1;
  const norm = (x - ymin) / clampedRange;
  return HEIGHT - PAD_Y - norm * (HEIGHT - 2 * PAD_Y);
}

export default function CanvasSine() {
  const { vars } = useFormulaStore();
  const A = vars.A ?? 1;
  const omega = vars.omega ?? 1;
  const phi = vars.phi ?? 0;

  const { path, ymin, ymax } = useMemo(() => {
    const step = (T_MAX - T_MIN) / 400;
    const pts: [number, number][] = [];
    let localMin = Infinity;
    let localMax = -Infinity;
    for (let t = T_MIN; t <= T_MAX + 1e-6; t += step) {
      const x = A * Math.cos(omega * t + phi);
      pts.push([t, x]);
      localMin = Math.min(localMin, x);
      localMax = Math.max(localMax, x);
    }
    if (!Number.isFinite(localMin) || !Number.isFinite(localMax)) {
      localMin = -1;
      localMax = 1;
    }
    if (localMax === localMin) {
      localMax = localMin + 1;
    }
    const d = pts
      .map(([t, val], idx) => `${idx === 0 ? 'M' : 'L'} ${mapX(t)} ${mapY(val, localMin, localMax)}`)
      .join(' ');

    return { path: d, ymin: localMin, ymax: localMax };
  }, [A, omega, phi]);

  const mapYWithRange = (value: number) => mapY(value, ymin, ymax);
  const zeroY = mapYWithRange(0);
  const amplitudeLines = A !== 0 ? [A, -A] : [0];
  const period = omega !== 0 ? (2 * Math.PI) / Math.abs(omega) : Infinity;
  const periodEnd = period <= T_MAX ? period : null;

  return (
    <svg width={WIDTH} height={HEIGHT} className="border rounded bg-white">
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#2563eb" />
        </marker>
      </defs>
      <rect x={PAD_X} y={PAD_Y} width={WIDTH - 2 * PAD_X} height={HEIGHT - 2 * PAD_Y} fill="transparent" stroke="#f1f5f9" />
      {/* axis */}
      <line x1={mapX(T_MIN)} y1={zeroY} x2={mapX(T_MAX)} y2={zeroY} stroke="#e4e4e7" strokeWidth={1} />
      <line x1={mapX(0)} y1={PAD_Y} x2={mapX(0)} y2={HEIGHT - PAD_Y} stroke="#e4e4e7" strokeWidth={1} />

      {/* amplitude markers */}
      {amplitudeLines.map((val, idx) => (
        <g key={idx}>
          <line
            x1={mapX(T_MIN)}
            y1={mapYWithRange(val)}
            x2={mapX(T_MAX)}
            y2={mapYWithRange(val)}
            stroke="#f97316"
            strokeWidth={1}
            strokeDasharray="6 6"
          />
          <text
            x={WIDTH - PAD_X + 6}
            y={mapYWithRange(val) + 4}
            fontSize={12}
            fill="#f97316"
          >
            {val >= 0
              ? `+A = ${val.toFixed(2)}`
              : `-A = ${val.toFixed(2)}`}
          </text>
        </g>
      ))}

      {/* period marker */}
      {periodEnd && (
        <g>
          <line
            x1={mapX(0)}
            y1={HEIGHT - PAD_Y + 10}
            x2={mapX(periodEnd)}
            y2={HEIGHT - PAD_Y + 10}
            stroke="#2563eb"
            strokeWidth={2}
            markerEnd="url(#arrow)"
          />
          <text
            x={(mapX(0) + mapX(periodEnd)) / 2}
            y={HEIGHT - PAD_Y + 28}
            textAnchor="middle"
            fontSize={12}
            fill="#2563eb"
          >
            {`Period T = ${(period).toFixed(2)}`}
          </text>
          <line
            x1={mapX(periodEnd)}
            y1={PAD_Y}
            x2={mapX(periodEnd)}
            y2={HEIGHT - PAD_Y}
            stroke="#2563eb"
            strokeDasharray="4 4"
          />
        </g>
      )}

      <path d={path} fill="none" stroke="#111827" strokeWidth={2} />

      <text x={mapX(T_MIN)} y={PAD_Y - 10} fontSize={12} fill="#475569">
        {`x(t) = ${A.toFixed(2)} cos(${omega.toFixed(2)} t + ${phi.toFixed(2)})`}
      </text>
    </svg>
  );
}
