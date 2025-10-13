'use client';

import NumberChip from '@/components/NumberChip';
import CanvasPredatorPrey from '@/components/CanvasPredatorPrey';
import ControlsPredatorPrey from '@/components/ControlsPredatorPrey';
import FormulaLine from '@/components/FormulaLine';
import { useFormulaStore } from '@/lib/state/store';

const params = [
  { key: 'alpha', label: 'α', min: 0, max: 3, step: 0.05, fallback: 1 },
  { key: 'beta', label: 'β', min: 0, max: 3, step: 0.05, fallback: 0.5 },
  { key: 'gamma', label: 'γ', min: 0, max: 3, step: 0.05, fallback: 1 },
  { key: 'delta', label: 'δ', min: 0, max: 3, step: 0.05, fallback: 0.5 },
] as const;

export default function PredatorPreyView() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-lg">
        {params.map(({ key, label, min, max, step, fallback }) => (
          <span key={key} className="flex items-center gap-1">
            {label} =
            <NumberChip
              value={vars[key] ?? fallback}
              onChange={(v) => setVar(key, v)}
              label={label}
              min={min}
              max={max}
              step={step}
            />
          </span>
        ))}
        x0 =
        <NumberChip
          value={vars.x0 ?? 5}
          onChange={(v) => setVar('x0', Math.max(0, v))}
          label="x0"
          min={0}
          max={10}
          step={0.1}
        />
        y0 =
        <NumberChip
          value={vars.y0 ?? 3}
          onChange={(v) => setVar('y0', Math.max(0, v))}
          label="y0"
          min={0}
          max={10}
          step={0.1}
        />
      </div>
      <FormulaLine className="text-base text-zinc-700" />
      <CanvasPredatorPrey />
      <p className="text-sm text-zinc-600">
        Watch how prey (blue) and predators (orange) oscillate and trace loops in phase space as the parameters change.
      </p>
      <ControlsPredatorPrey />
    </div>
  );
}
