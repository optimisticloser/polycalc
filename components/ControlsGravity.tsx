'use client';

import { useFormulaStore } from '@/lib/state/store';

const rows = [
  { key: 'm1', label: 'Mass m1', min: 1, max: 100, step: 1, fallback: 10 },
  { key: 'm2', label: 'Mass m2', min: 1, max: 100, step: 1, fallback: 10 },
  { key: 'r', label: 'Distance r', min: 1, max: 100, step: 1, fallback: 20 },
] as const;

export default function ControlsGravity() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="mt-4 grid gap-3">
      {rows.map(({ key, label, min, max, step, fallback }) => {
        const value = Number.isFinite(vars[key]) ? vars[key] : fallback;
        return (
          <label
            key={key}
            className="grid grid-cols-[140px_1fr_80px] items-center gap-2 text-sm"
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
              {value.toFixed(1)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
