'use client';

import { useFormulaStore } from '@/lib/state/store';

const rows = [
  { key: 'r', label: 'r (growth rate)', min: 2.5, max: 4.0, step: 0.01, fallback: 3.2 },
  { key: 'x0', label: 'Initial x0', min: 0, max: 1, step: 0.01, fallback: 0.2 },
] as const;

export default function ControlsLogisticMap() {
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
            <span className="text-right tabular-nums">
              {value.toFixed(3)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
