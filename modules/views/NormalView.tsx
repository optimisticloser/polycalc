'use client';

import NumberChip from '@/components/NumberChip';
import CanvasNormal from '@/components/CanvasNormal';
import ControlsNormal from '@/components/ControlsNormal';
import FormulaLine from '@/components/FormulaLine';
import { useFormulaStore } from '@/lib/state/store';

export default function NormalView() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-lg">
        μ =
        <NumberChip
          value={vars.mu ?? 0}
          onChange={(v) => setVar('mu', v)}
          label="μ"
          min={-5}
          max={5}
          step={0.1}
        />
        σ =
        <NumberChip
          value={vars.sigma ?? 1}
          onChange={(v) => setVar('sigma', v)}
          label="σ"
          min={0.5}
          max={3}
          step={0.05}
        />
      </div>
      <FormulaLine className="text-base text-zinc-700" />
      <CanvasNormal />
      <p className="text-sm text-zinc-600">
        Drag the orange markers to shade an interval and see the probability mass.
      </p>
      <ControlsNormal />
    </div>
  );
}
