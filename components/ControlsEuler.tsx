'use client';

import { useFormulaStore } from '@/lib/state/store';

const rows = [
  {
    key: 'theta' as const,
    label: 'Angle θ (rad)',
    min: -Math.PI,
    max: Math.PI,
    step: 0.01,
    fallback: 0,
  },
  {
    key: 'r' as const,
    label: 'Magnitude r',
    min: 0,
    max: 2,
    step: 0.05,
    fallback: 1,
  },
] as const;

export default function ControlsEuler() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="mt-4 grid gap-3">
      {rows.map(({ key, label, min, max, step, fallback }) => {
        const value = Number.isFinite(vars[key]) ? vars[key] : fallback;
        return (
          <label
            key={key}
            className="grid grid-cols-[160px_1fr_80px] items-center gap-2 text-sm"
          >
            <span className="font-medium">{label}</span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(event) => setVar(key, parseFloat(event.target.value))}
            />
            <span className="tabular-nums text-right">
              {value.toFixed(2)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
