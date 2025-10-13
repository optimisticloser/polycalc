'use client';

import { useFormulaStore } from '@/lib/state/store';

const rows = [
  { key: 'alpha', label: 'α (prey growth)', min: 0, max: 3, step: 0.05, fallback: 1 },
  { key: 'beta', label: 'β (predation)', min: 0, max: 3, step: 0.05, fallback: 0.5 },
  { key: 'gamma', label: 'γ (predator decay)', min: 0, max: 3, step: 0.05, fallback: 1 },
  { key: 'delta', label: 'δ (predator growth)', min: 0, max: 3, step: 0.05, fallback: 0.5 },
  { key: 'x0', label: 'Initial prey x₀', min: 0, max: 10, step: 0.1, fallback: 5 },
  { key: 'y0', label: 'Initial predator y₀', min: 0, max: 10, step: 0.1, fallback: 3 },
] as const;

export default function ControlsPredatorPrey() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="mt-4 grid gap-3">
      {rows.map(({ key, label, min, max, step, fallback }) => {
        const value = Number.isFinite(vars[key]) ? vars[key] : fallback;
        return (
          <label
            key={key}
            className="grid grid-cols-[200px_1fr_80px] items-center gap-2 text-sm"
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
              {value.toFixed(2)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
