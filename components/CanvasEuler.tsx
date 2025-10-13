'use client';

import { useMemo } from 'react';
import { useFormulaStore } from '@/lib/state/store';

const WIDTH = 700;
const HEIGHT = 360;
const PAD = 40;
const RANGE = 2.2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function mapToPixels(value: number, scale: number, center: number) {
  return center + value * scale;
}

export default function CanvasEuler() {
  const { vars } = useFormulaStore();
  const theta = clamp(vars.theta ?? 0, -Math.PI, Math.PI);
  const r = clamp(vars.r ?? 1, 0, 2);

  const { scale, originX, originY } = useMemo(() => {
    const scaleX = (WIDTH - 2 * PAD) / (2 * RANGE);
    const scaleY = (HEIGHT - 2 * PAD) / (2 * RANGE);
    const scale = Math.min(scaleX, scaleY);
    return { scale, originX: WIDTH / 2, originY: HEIGHT / 2 };
  }, []);

  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);

  const unitPoint = {
    x: mapToPixels(cosTheta, scale, originX),
    y: mapToPixels(-sinTheta, scale, originY),
  };

  const vectorPoint = {
    x: mapToPixels(r * cosTheta, scale, originX),
    y: mapToPixels(-r * sinTheta, scale, originY),
  };

  const projectionX = {
    x: vectorPoint.x,
    y: originY,
  };
  const projectionY = {
    x: originX,
    y: vectorPoint.y,
  };

  const arcPath = useMemo(() => {
    const radius = scale * 0.8;
    const startX = originX + radius;
    const startY = originY;
    const endX = originX + radius * Math.cos(theta);
    const endY = originY - radius * Math.sin(theta);
    const largeArc = Math.abs(theta) > Math.PI ? 1 : 0;
    const sweep = theta >= 0 ? 1 : 0;
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${endX} ${endY}`;
  }, [theta, originX, originY, scale]);

  return (
    <svg width={WIDTH} height={HEIGHT} className="border rounded bg-white">
      <defs>
        <marker id="arrow-head" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
        </marker>
      </defs>

      {/* axes */}
      <line
        x1={PAD}
        y1={originY}
        x2={WIDTH - PAD}
        y2={originY}
        stroke="#e2e8f0"
        strokeWidth={2}
      />
      <line
        x1={originX}
        y1={PAD}
        x2={originX}
        y2={HEIGHT - PAD}
        stroke="#e2e8f0"
        strokeWidth={2}
      />

      {/* unit circle */}
      <circle
        cx={originX}
        cy={originY}
        r={scale}
        stroke="#cbd5f5"
        strokeWidth={2}
        fill="none"
      />

      {/* radius circle */}
      {Math.abs(r - 1) > 1e-3 && (
        <circle
          cx={originX}
          cy={originY}
          r={scale * r}
          stroke="#fde68a"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          fill="none"
        />
      )}

      {/* angle arc */}
      <path d={arcPath} fill="none" stroke="#22d3ee" strokeWidth={2} />
      <text
        x={originX + scale * 0.9}
        y={originY - 12}
        fontSize={12}
        fill="#0e7490"
      >
        θ
      </text>

      {/* projections */}
      <line
        x1={vectorPoint.x}
        y1={vectorPoint.y}
        x2={projectionX.x}
        y2={projectionX.y}
        stroke="#94a3b8"
        strokeDasharray="4 4"
      />
      <line
        x1={vectorPoint.x}
        y1={vectorPoint.y}
        x2={projectionY.x}
        y2={projectionY.y}
        stroke="#94a3b8"
        strokeDasharray="4 4"
      />

      {/* vector */}
      <line
        x1={originX}
        y1={originY}
        x2={vectorPoint.x}
        y2={vectorPoint.y}
        stroke="#ef4444"
        strokeWidth={3}
        markerEnd="url(#arrow-head)"
      />

      {/* unit point */}
      <circle cx={unitPoint.x} cy={unitPoint.y} r={5} fill="#1d4ed8" />

      {/* vector point */}
      <circle cx={vectorPoint.x} cy={vectorPoint.y} r={6} fill="#ef4444" />

      {/* labels */}
      <text
        x={projectionX.x}
        y={projectionX.y + 16}
        textAnchor="middle"
        fontSize={12}
        fill="#ef4444"
      >
        r cos θ = {(r * cosTheta).toFixed(2)}
      </text>
      <text
        x={projectionY.x - 12}
        y={projectionY.y}
        textAnchor="end"
        fontSize={12}
        fill="#ef4444"
      >
        r sin θ = {(r * sinTheta).toFixed(2)}
      </text>

    </svg>
  );
}
