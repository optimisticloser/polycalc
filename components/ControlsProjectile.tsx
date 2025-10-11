'use client';
import { useFormulaStore } from '@/lib/state/store';

export default function ControlsProjectile() {
  const { vars, setVar } = useFormulaStore();
  const rows = [
    { key: 'v0', min: 0, max: 100, step: 1 },
    { key: 'theta', min: 0, max: 1.57, step: 0.01 },
    { key: 'g', min: 1, max: 20, step: 0.1 },
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
          <span className="tabular-nums text-right">
            {r.key==='theta' ? ((vars.theta ?? 0)*180/Math.PI).toFixed(0)+'°' : (vars[r.key] ?? 0).toFixed(2)}
          </span>
        </label>
      ))}
    </div>
  );
}
