'use client';
import { useFormulaStore } from '@/lib/state/store';

export default function ControlsQuadratic() {
  const { vars, setVar } = useFormulaStore();
  const rows = [
    { key: 'a', min: -5, max: 5, step: 0.1 },
    { key: 'b', min: -10, max: 10, step: 0.1 },
    { key: 'c', min: -20, max: 20, step: 0.1 },
  ] as const;

  return (
    <div className="mt-4 grid gap-3">
      {rows.map(r => (
        <label key={r.key} className="grid grid-cols-[80px_1fr_80px] items-center gap-2 text-sm">
          <span className="font-mono">{r.key}</span>
          <input
            type="range" min={r.min} max={r.max} step={r.step}
            value={vars[r.key] ?? 0}
            onChange={e => setVar(r.key, parseFloat(e.target.value))}
          />
          <span className="tabular-nums text-right">{(vars[r.key] ?? 0).toFixed(2)}</span>
        </label>
      ))}
    </div>
  );
}
