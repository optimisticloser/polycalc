'use client';

import { useMemo } from 'react';
import { useFormulaStore } from '@/lib/state/store';

const WIDTH = 700;
const HEIGHT = 360;
const PAD_X = 50;
const PAD_Y = 40;
const TOTAL_ITERATIONS = 300;
const LAST_POINTS = 100;
const R_MIN = 2.5;
const R_MAX = 4.0;

type BifurcationPoint = { r: number; x: number };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function iterateLogistic(r: number, x0: number, iterations: number) {
  const values: number[] = [];
  let x = x0;
  for (let i = 0; i < iterations; i += 1) {
    x = r * x * (1 - x);
    values.push(x);
  }
  return values;
}

function buildBifurcation(): BifurcationPoint[] {
  const samples: BifurcationPoint[] = [];
  const STEPS = 200;
  for (let i = 0; i <= STEPS; i += 1) {
    const r = R_MIN + (i / STEPS) * (R_MAX - R_MIN);
    let x = 0.5;
    const settle = 200;
    for (let k = 0; k < settle; k += 1) {
      x = r * x * (1 - x);
    }
    for (let k = 0; k < 80; k += 1) {
      x = r * x * (1 - x);
      samples.push({ r, x });
    }
  }
  return samples;
}

export default function CanvasLogisticMap() {
  const { vars } = useFormulaStore();
  const r = clamp(vars.r ?? 3.2, R_MIN, R_MAX);
  const x0 = clamp(vars.x0 ?? 0.2, 0, 1);

  const sequence = useMemo(() => {
    const values: number[] = [x0];
    let x = x0;
    for (let i = 0; i < TOTAL_ITERATIONS; i += 1) {
      x = r * x * (1 - x);
      values.push(x);
    }
    return values;
  }, [r, x0]);

  const startIdx = Math.max(0, sequence.length - LAST_POINTS);
  const plotTop = PAD_Y;
  const plotHeight = 200;
  const plotBottom = plotTop + plotHeight;
  const mapIter = (idx: number) =>
    PAD_X +
    ((idx - startIdx) / (LAST_POINTS - 1)) * (WIDTH - 2 * PAD_X);
  const mapValue = (value: number) =>
    plotBottom - clamp(value, 0, 1) * plotHeight;

  const logisticCurve = useMemo(() => {
    const steps = 200;
    const path: string[] = [];
    for (let i = 0; i <= steps; i += 1) {
      const x = i / steps;
      const y = r * x * (1 - x);
      const px = PAD_X + x * (WIDTH - 2 * PAD_X);
      const py = mapValue(y);
      path.push(`${i === 0 ? 'M' : 'L'} ${px} ${py}`);
    }
    return path.join(' ');
  }, [r]);

  const bifurcation = useMemo(buildBifurcation, []);
  const bifurcationX = PAD_X;
  const bifurcationY = plotBottom + 40;
  const bifurcationWidth = WIDTH - 2 * PAD_X;
  const bifurcationHeight = HEIGHT - bifurcationY - 20;
  const mapBifurcationX = (value: number) =>
    bifurcationX + ((value - R_MIN) / (R_MAX - R_MIN)) * bifurcationWidth;
  const mapBifurcationY = (value: number) =>
    bifurcationY + bifurcationHeight - clamp(value, 0, 1) * bifurcationHeight;

  return (
    <svg width={WIDTH} height={HEIGHT} className="border rounded bg-white">
      <rect
        x={PAD_X}
        y={plotTop}
        width={WIDTH - 2 * PAD_X}
        height={plotHeight}
        fill="transparent"
        stroke="#e2e8f0"
      />
      <line
        x1={PAD_X}
        y1={plotBottom}
        x2={WIDTH - PAD_X}
        y2={plotBottom}
        stroke="#cbd5f5"
      />
      <text
        x={WIDTH - PAD_X}
        y={plotBottom + 16}
        textAnchor="end"
        fontSize={12}
        fill="#475569"
      >
        Iteration (n)
      </text>

      <path d={logisticCurve} fill="none" stroke="#94a3b8" strokeWidth={1.5} />

      {sequence.slice(startIdx).map((value, idx) => (
        <circle
          key={startIdx + idx}
          cx={mapIter(startIdx + idx)}
          cy={mapValue(value)}
          r={3}
          fill="#2563eb"
          fillOpacity={0.8}
        />
      ))}

      <text
        x={PAD_X + 12}
        y={plotTop + 16}
        fontSize={12}
        fill="#0f172a"
      >
        Last {LAST_POINTS} iterates of x_n
      </text>

      {/* bifurcation inset */}
      <rect
        x={bifurcationX}
        y={bifurcationY}
        width={bifurcationWidth}
        height={bifurcationHeight}
        fill="transparent"
        stroke="#e2e8f0"
      />
      {bifurcation.map((point, idx) => (
        <circle
          key={idx}
          cx={mapBifurcationX(point.r)}
          cy={mapBifurcationY(point.x)}
          r={0.8}
          fill="#22d3ee"
          fillOpacity={0.7}
        />
      ))}
      <line
        x1={mapBifurcationX(r)}
        y1={bifurcationY}
        x2={mapBifurcationX(r)}
        y2={bifurcationY + bifurcationHeight}
        stroke="#f97316"
        strokeDasharray="4 4"
      />
      <text
        x={bifurcationX + 8}
        y={bifurcationY + 16}
        fontSize={12}
        fill="#0f172a"
      >
        Mini bifurcation sweep
      </text>
      <text
        x={bifurcationX + 8}
        y={bifurcationY + bifurcationHeight + 16}
        fontSize={11}
        fill="#475569"
      >
        r ≈ {r.toFixed(3)}
      </text>
    </svg>
  );
}
