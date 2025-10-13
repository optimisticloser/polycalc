'use client';

import { useFormulaStore } from '@/lib/state/store';

const rows = [
  { key: 'N', label: 'Terms N', min: 1, max: 25, step: 1, fallback: 1, integer: true },
  { key: 'f0', label: 'Base frequency f₀', min: 1, max: 5, step: 0.1, fallback: 1, integer: false },
] as const;

export default function ControlsFourier() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="mt-4 grid gap-3">
      {rows.map(({ key, label, min, max, step, fallback, integer }) => {
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
              onChange={(event) => {
                const raw = parseFloat(event.target.value);
                setVar(key, integer ? Math.round(raw) : raw);
              }}
            />
            <span className="text-right tabular-nums">
              {(integer ? Math.round(value) : value).toFixed(integer ? 0 : 2)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
