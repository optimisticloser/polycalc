'use client';

import { useMemo } from 'react';
import { useFormulaStore } from '@/lib/state/store';

const WIDTH = 700;
const HEIGHT = 360;
const PAD_X = 50;
const PAD_Y = 40;
const T_MIN = 0;
const T_MAX = 1;
const N_MIN = 1;
const N_MAX = 25;
const F0_MIN = 1;
const F0_MAX = 5;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function partialSum(t: number, N: number, f0: number) {
  let sum = 0;
  for (let k = 0; k < N; k += 1) {
    const coefficient = 4 / ((2 * k + 1) * Math.PI);
    const omega = 2 * Math.PI * (2 * k + 1) * f0;
    sum += coefficient * Math.sin(omega * t);
  }
  return sum;
}

function squareWave(t: number, f0: number) {
  const s = Math.sin(2 * Math.PI * f0 * t);
  return s >= 0 ? 1 : -1;
}

function mapX(t: number) {
  return PAD_X + ((t - T_MIN) / (T_MAX - T_MIN)) * (WIDTH - 2 * PAD_X);
}

function mapY(value: number, min: number, max: number) {
  const range = max - min || 1;
  const norm = (value - min) / range;
  return HEIGHT - PAD_Y - norm * (HEIGHT - 2 * PAD_Y);
}

export default function CanvasFourier() {
  const { vars } = useFormulaStore();
  const N = clamp(Math.round(vars.N ?? 1), N_MIN, N_MAX);
  const f0 = clamp(vars.f0 ?? 1, F0_MIN, F0_MAX);

  const data = useMemo(() => {
    const step = (T_MAX - T_MIN) / 800;
    const partialPoints: [number, number][] = [];
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (let t = T_MIN; t <= T_MAX + 1e-6; t += step) {
      const value = partialSum(t, N, f0);
      minVal = Math.min(minVal, value, -1);
      maxVal = Math.max(maxVal, value, 1);
      partialPoints.push([t, value]);
    }
    const overshoot = Math.max(0, maxVal - 1);
    const undershoot = Math.max(0, -(minVal + 1));
    const padding = 0.2;
    const yMin = Math.min(-1 - undershoot - padding, -1.5);
    const yMax = Math.max(1 + overshoot + padding, 1.5);
    return { partialPoints, yMin, yMax, overshoot, undershoot };
  }, [N, f0]);

  const partialPath = useMemo(() => {
    return data.partialPoints
      .map(([t, value], idx) => {
        const prefix = idx === 0 ? 'M' : 'L';
        return `${prefix} ${mapX(t)} ${mapY(value, data.yMin, data.yMax)}`;
      })
      .join(' ');
  }, [data]);

  const squarePath = useMemo(() => {
    const halfPeriod = 1 / (2 * f0);
    let value = 1;
    let t = 0;
    const commands: string[] = [
      `M ${mapX(0)} ${mapY(value, data.yMin, data.yMax)}`
    ];
    while (t < T_MAX - 1e-6) {
      const nextT = clamp(t + halfPeriod, T_MIN, T_MAX);
      commands.push(`L ${mapX(nextT)} ${mapY(value, data.yMin, data.yMax)}`);
      if (nextT >= T_MAX) break;
      value *= -1;
      commands.push(`L ${mapX(nextT)} ${mapY(value, data.yMin, data.yMax)}`);
      t = nextT;
    }
    return commands.join(' ');
  }, [data.yMin, data.yMax, f0]);

  const overshootPercent = data.overshoot > 0 ? data.overshoot * 100 : 0;

  return (
    <svg width={WIDTH} height={HEIGHT} className="border rounded bg-white">
      <rect
        x={PAD_X}
        y={PAD_Y}
        width={WIDTH - 2 * PAD_X}
        height={HEIGHT - 2 * PAD_Y}
        fill="transparent"
        stroke="#e2e8f0"
      />

      {/* target amplitude lines */}
      {[1, -1].map((target) => (
        <line
          key={target}
          x1={mapX(T_MIN)}
          y1={mapY(target, data.yMin, data.yMax)}
          x2={mapX(T_MAX)}
          y2={mapY(target, data.yMin, data.yMax)}
          stroke="#cbd5f5"
          strokeDasharray="4 4"
        />
      ))}

      {/* square wave target */}
      <path
        d={squarePath}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={2}
      />

      {/* partial sum */}
      <path
        d={partialPath}
        fill="none"
        stroke="#ef4444"
        strokeWidth={2.5}
      />

      {/* overshoot indicator */}
      {overshootPercent > 0 && (
        <text
          x={mapX(0.08)}
          y={mapY(1 + data.overshoot + 0.05, data.yMin, data.yMax)}
          fontSize={12}
          fill="#ef4444"
        >
          Gibbs overshoot ≈ {overshootPercent.toFixed(1)}%
        </text>
      )}

      <text
        x={WIDTH - PAD_X}
        y={PAD_Y - 12}
        textAnchor="end"
        fontSize={12}
        fill="#475569"
      >
        Square wave target (gray) vs partial sum (red)
      </text>
    </svg>
  );
}
