'use client';

import { useMemo } from 'react';
import { useFormulaStore } from '@/lib/state/store';

const WIDTH = 700;
const HEIGHT = 360;
const CYLINDER_TOP = 60;
const CYLINDER_HEIGHT = 220;
const CYLINDER_WIDTH = 160;
const CYLINDER_X = 140;
const PISTON_THICKNESS = 18;
const MIN_VOLUME = 1;
const MAX_VOLUME = 10;
const MAX_PRESSURE = (5 * 8.314 * 600) / 1;
const GAS_CONSTANT = 8.314;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function CanvasIdealGas() {
  const { vars } = useFormulaStore();
  const volume = clamp(vars.V ?? 5, MIN_VOLUME, MAX_VOLUME);
  const temperature = clamp(vars.T ?? 300, 100, 600);
  const moles = clamp(vars.n ?? 1, 1, 5);

  const pressure = useMemo(() => {
    return (moles * GAS_CONSTANT * temperature) / volume;
  }, [moles, temperature, volume]);

  const piston = useMemo(() => {
    const normalized = (volume - MIN_VOLUME) / (MAX_VOLUME - MIN_VOLUME);
    const travelSpace =
      CYLINDER_HEIGHT - PISTON_THICKNESS - 20;
    const top =
      CYLINDER_TOP + 10 + (1 - normalized) * travelSpace;
    const bottom = CYLINDER_TOP + CYLINDER_HEIGHT - 10;
    return { top, bottom };
  }, [volume]);

  const gauge = useMemo(() => {
    const gaugeHeight = 200;
    const ratio = clamp(pressure / MAX_PRESSURE, 0, 1);
    const level = (1 - ratio) * gaugeHeight;
    return { height: gaugeHeight, level };
  }, [pressure]);

  const gasColor = useMemo(() => {
    const ratio = clamp((temperature - 100) / (600 - 100), 0, 1);
    const hue = lerp(205, 10, ratio);
    return `hsl(${hue}, 80%, 70%)`;
  }, [temperature]);

  return (
    <svg width={WIDTH} height={HEIGHT} className="border rounded bg-white">
      {/* cylinder outline */}
      <rect
        x={CYLINDER_X}
        y={CYLINDER_TOP}
        width={CYLINDER_WIDTH}
        height={CYLINDER_HEIGHT}
        fill="#f8fafc"
        stroke="#cbd5f5"
        strokeWidth={3}
        rx={12}
      />

      {/* gas volume */}
      <rect
        x={CYLINDER_X + 6}
        y={piston.top + PISTON_THICKNESS}
        width={CYLINDER_WIDTH - 12}
        height={piston.bottom - piston.top - PISTON_THICKNESS}
        fill={gasColor}
        fillOpacity={0.65}
      />

      {/* piston head */}
      <rect
        x={CYLINDER_X + 3}
        y={piston.top}
        width={CYLINDER_WIDTH - 6}
        height={PISTON_THICKNESS}
        fill="#1f2937"
        rx={6}
      />
      <rect
        x={CYLINDER_X + CYLINDER_WIDTH / 2 - 6}
        y={piston.top - 30}
        width={12}
        height={30}
        fill="#1f2937"
      />

      {/* temperature indicator */}
      <text
        x={CYLINDER_X + CYLINDER_WIDTH + 20}
        y={piston.bottom - 10}
        fontSize={12}
        fill="#475569"
      >
        Volume V = {volume.toFixed(2)} L
      </text>
      <text
        x={CYLINDER_X + CYLINDER_WIDTH + 20}
        y={piston.bottom + 8}
        fontSize={12}
        fill="#ef4444"
      >
        Temperature T = {temperature.toFixed(0)} K
      </text>
      <text
        x={CYLINDER_X + CYLINDER_WIDTH + 20}
        y={piston.bottom + 26}
        fontSize={12}
        fill="#0ea5e9"
      >
        Moles n = {moles.toFixed(2)}
      </text>

      {/* pressure gauge */}
      <g transform="translate(420, 80)">
        <rect
          x={0}
          y={0}
          width={80}
          height={gauge.height}
          rx={12}
          fill="#f1f5f9"
          stroke="#cbd5f5"
        />
        {(() => {
          const fillHeight = Math.max(0, gauge.height - gauge.level - 8);
          return (
            <rect
              x={8}
              y={gauge.level + 4}
              width={64}
              height={fillHeight}
              rx={8}
              fill="#ef4444"
              fillOpacity={0.75}
            />
          );
        })()}
        <line
          x1={8}
          y1={gauge.level}
          x2={72}
          y2={gauge.level}
          stroke="#1f2937"
          strokeDasharray="4 4"
        />
        <text
          x={40}
          y={gauge.height + 24}
          textAnchor="middle"
          fontSize={12}
          fill="#1f2937"
        >
          Pressure gauge
        </text>
      </g>

      <text
        x={WIDTH - 40}
        y={120}
        textAnchor="end"
        fontSize={16}
        fontWeight={600}
        fill="#111827"
      >
        P ≈ {pressure.toFixed(1)} kPa
      </text>
      <text
        x={WIDTH - 40}
        y={140}
        textAnchor="end"
        fontSize={12}
        fill="#475569"
      >
        ({(pressure / 101.325).toFixed(2)} atm)
      </text>

      <text
        x={WIDTH - 40}
        y={HEIGHT - 40}
        textAnchor="end"
        fontSize={12}
        fill="#94a3b8"
      >
        R = 8.314 J·mol⁻¹·K⁻¹
      </text>
    </svg>
  );
}
