'use client';

import { useFormulaStore } from '@/lib/state/store';

const rows = [
  { key: 'V', label: 'Volume V (L)', min: 1, max: 10, step: 0.1, fallback: 5 },
  { key: 'T', label: 'Temperature T (K)', min: 100, max: 600, step: 5, fallback: 300 },
  { key: 'n', label: 'Moles n', min: 1, max: 5, step: 0.1, fallback: 1 },
] as const;

export default function ControlsIdealGas() {
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
              {value.toFixed(2)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
