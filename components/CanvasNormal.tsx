'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormulaStore } from '@/lib/state/store';

const WIDTH = 700;
const HEIGHT = 360;
const PAD_X = 50;
const PAD_Y = 40;
const X_MIN = -5;
const X_MAX = 5;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function pdf(x: number, mu: number, sigma: number) {
  const normalized = (x - mu) / sigma;
  const exponent = -0.5 * normalized * normalized;
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

function erf(x: number) {
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * absX);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-absX * absX);
  return sign * y;
}

function normalCdf(x: number, mu: number, sigma: number) {
  const z = (x - mu) / (sigma * Math.SQRT2);
  return 0.5 * (1 + erf(z));
}

function mapX(x: number) {
  return (
    PAD_X +
    ((x - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - 2 * PAD_X)
  );
}

function mapY(y: number, ymax: number) {
  const clamped = Math.max(0, y);
  const range = ymax || 1;
  const norm = clamped / range;
  return HEIGHT - PAD_Y - norm * (HEIGHT - 2 * PAD_Y);
}

export default function CanvasNormal() {
  const { vars } = useFormulaStore();
  const mu = vars.mu ?? 0;
  const sigmaRaw = vars.sigma ?? 1;
  const sigma = Math.max(0.1, sigmaRaw);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [interval, setInterval] = useState<{ a: number; b: number }>({
    a: -1,
    b: 1,
  });
  const [dragging, setDragging] = useState<'a' | 'b' | null>(null);

  const curve = useMemo(() => {
    const step = (X_MAX - X_MIN) / 400;
    const points: [number, number][] = [];
    let maxY = 0;
    for (let x = X_MIN; x <= X_MAX + 1e-6; x += step) {
      const y = pdf(x, mu, sigma);
      if (Number.isFinite(y)) {
        points.push([x, y]);
        maxY = Math.max(maxY, y);
      }
    }
    const safeMaxY = maxY > 0 ? maxY * 1.2 : 1;
    const path = points
      .map((point, idx) => {
        const [x, y] = point;
        return `${idx === 0 ? 'M' : 'L'} ${mapX(x)} ${mapY(y, safeMaxY)}`;
      })
      .join(' ');
    return { points, maxY: safeMaxY, path };
  }, [mu, sigma]);

  const [left, right] = useMemo(() => {
    const sorted = [interval.a, interval.b].sort((a, b) => a - b);
    return [
      clamp(sorted[0], X_MIN, X_MAX),
      clamp(sorted[1], X_MIN, X_MAX),
    ] as const;
  }, [interval]);

  const shadingPath = useMemo(() => {
    const span = right - left;
    if (span <= 0) return '';
    const step = Math.max(0.02, span / 80);
    const lines: string[] = [];
    const baseY = mapY(0, curve.maxY);
    lines.push(`M ${mapX(left)} ${baseY}`);
    for (let x = left; x <= right + 1e-6; x += step) {
      const y = pdf(x, mu, sigma);
      lines.push(`L ${mapX(x)} ${mapY(y, curve.maxY)}`);
    }
    lines.push(`L ${mapX(right)} ${baseY}`);
    lines.push('Z');
    return lines.join(' ');
  }, [left, right, mu, sigma, curve.maxY]);

  const probability = useMemo(() => {
    const prob = normalCdf(right, mu, sigma) - normalCdf(left, mu, sigma);
    return clamp(prob, 0, 1);
  }, [left, right, mu, sigma]);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (event: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const width = rect.width - 2 * PAD_X;
      if (width <= 0) return;
      const ratio =
        (event.clientX - rect.left - PAD_X) /
        width;
      const clampedRatio = clamp(ratio, 0, 1);
      const value = X_MIN + clampedRatio * (X_MAX - X_MIN);
      setInterval((prev) => {
        const current = { ...prev };
        if (dragging === 'a') {
          if (value > prev.b) {
            return { a: prev.b, b: value };
          }
          current.a = value;
        } else {
          if (value < prev.a) {
            return { a: value, b: prev.a };
          }
          current.b = value;
        }
        return current;
      });
    };
    const handleUp = () => setDragging(null);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [dragging]);

  const curveAtLeft = pdf(left, mu, sigma);
  const curveAtRight = pdf(right, mu, sigma);
  const baselineY = mapY(0, curve.maxY);

  return (
    <svg
      ref={svgRef}
      width={WIDTH}
      height={HEIGHT}
      className="border rounded bg-white"
    >
      <rect
        x={PAD_X}
        y={PAD_Y}
        width={WIDTH - 2 * PAD_X}
        height={HEIGHT - 2 * PAD_Y}
        fill="transparent"
        stroke="#e2e8f0"
      />
      {/* axis */}
      <line
        x1={mapX(X_MIN)}
        y1={baselineY}
        x2={mapX(X_MAX)}
        y2={baselineY}
        stroke="#cbd5f5"
      />

      {/* mean marker */}
      <line
        x1={mapX(mu)}
        y1={PAD_Y}
        x2={mapX(mu)}
        y2={HEIGHT - PAD_Y}
        stroke="#38bdf8"
        strokeDasharray="4 4"
      />
      <text
        x={mapX(mu)}
        y={PAD_Y - 8}
        textAnchor="middle"
        fontSize={12}
        fill="#0ea5e9"
      >
        μ = {mu.toFixed(2)}
      </text>

      {/* shaded probability */}
      <path
        d={shadingPath}
        fill="#fb923c"
        fillOpacity={0.25}
        stroke="none"
      />

      {/* curve */}
      <path
        d={curve.path}
        fill="none"
        stroke="#111827"
        strokeWidth={2}
      />

      {/* left marker */}
      <line
        x1={mapX(left)}
        y1={mapY(curveAtLeft, curve.maxY)}
        x2={mapX(left)}
        y2={baselineY}
        stroke="#f97316"
        strokeDasharray="4 4"
      />
      <circle
        cx={mapX(left)}
        cy={baselineY}
        r={9}
        fill="#fb923c"
        fillOpacity={0.9}
        stroke="#ea580c"
        onPointerDown={(event) => {
          event.preventDefault();
          setDragging('a');
        }}
        style={{ cursor: 'ew-resize' }}
      />
      <text
        x={mapX(left)}
        y={baselineY + 24}
        textAnchor="middle"
        fontSize={12}
        fill="#c2410c"
      >
        a = {left.toFixed(2)}
      </text>

      {/* right marker */}
      <line
        x1={mapX(right)}
        y1={mapY(curveAtRight, curve.maxY)}
        x2={mapX(right)}
        y2={baselineY}
        stroke="#f97316"
        strokeDasharray="4 4"
      />
      <circle
        cx={mapX(right)}
        cy={baselineY}
        r={9}
        fill="#fb923c"
        fillOpacity={0.9}
        stroke="#ea580c"
        onPointerDown={(event) => {
          event.preventDefault();
          setDragging('b');
        }}
        style={{ cursor: 'ew-resize' }}
      />
      <text
        x={mapX(right)}
        y={baselineY + 24}
        textAnchor="middle"
        fontSize={12}
        fill="#c2410c"
      >
        b = {right.toFixed(2)}
      </text>

      <text
        x={WIDTH - PAD_X}
        y={PAD_Y - 12}
        textAnchor="end"
        fontSize={13}
        fill="#1e293b"
      >
        {`P(${left.toFixed(2)} ≤ X ≤ ${right.toFixed(2)}) ≈ ${probability.toFixed(3)}`}
      </text>
    </svg>
  );
}
