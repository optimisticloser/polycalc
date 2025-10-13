'use client';
import { useFormulaStore } from '@/lib/state/store';

const rows = [
  { key: 'A', label: 'Amplitude A', min: 0, max: 10, step: 0.1, defaultValue: 1, decimals: 2 },
  { key: 'omega', label: 'Angular freq ω', min: 0.1, max: 10, step: 0.1, defaultValue: 1, decimals: 2 },
  { key: 'phi', label: 'Phase φ', min: -Math.PI, max: Math.PI, step: 0.01, defaultValue: 0, decimals: 2 },
] as const;

export default function ControlsSine() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="mt-4 grid gap-3">
      {rows.map(row => (
        <label key={row.key} className="grid grid-cols-[120px_1fr_80px] items-center gap-2 text-sm">
          <span className="font-mono">{row.label}</span>
          <input
            type="range"
            min={row.min}
            max={row.max}
            step={row.step}
            value={vars[row.key] ?? row.defaultValue}
            onChange={e => setVar(row.key, parseFloat(e.target.value))}
          />
          <span className="tabular-nums text-right">
            {(vars[row.key] ?? row.defaultValue).toFixed(row.decimals)}
          </span>
        </label>
      ))}
    </div>
  );
}
