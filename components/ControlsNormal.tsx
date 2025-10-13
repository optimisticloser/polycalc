'use client';

import { useFormulaStore } from '@/lib/state/store';

const CONTROLS = [
  { key: 'mu', label: 'μ', min: -5, max: 5, step: 0.1, fallback: 0 },
  { key: 'sigma', label: 'σ', min: 0.5, max: 3, step: 0.05, fallback: 1 },
] as const;

export default function ControlsNormal() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="mt-4 grid gap-3">
      {CONTROLS.map(({ key, label, min, max, step, fallback }) => {
        const value = Number.isFinite(vars[key]) ? vars[key] : fallback;
        return (
          <label
            key={key}
            className="grid grid-cols-[80px_1fr_80px] items-center gap-2 text-sm"
          >
            <span className="font-mono">{label}</span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(event) =>
                setVar(key, parseFloat(event.target.value))
              }
            />
            <span className="text-right tabular-nums">
              {value?.toFixed(2)}
            </span>
          </label>
        );
      })}
    </div>
  );
}
