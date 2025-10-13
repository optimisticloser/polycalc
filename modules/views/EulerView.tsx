'use client';

import NumberChip from '@/components/NumberChip';
import CanvasEuler from '@/components/CanvasEuler';
import ControlsEuler from '@/components/ControlsEuler';
import FormulaLine from '@/components/FormulaLine';
import { useFormulaStore } from '@/lib/state/store';

export default function EulerView() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-lg">
        θ =
        <NumberChip
          value={vars.theta ?? 0}
          onChange={(v) => setVar('theta', v)}
          label="theta"
          min={-Math.PI}
          max={Math.PI}
          step={0.1}
        />
        r =
        <NumberChip
          value={vars.r ?? 1}
          onChange={(v) => setVar('r', Math.max(0, v))}
          label="r"
          min={0}
          max={2}
          step={0.05}
        />
      </div>
      <FormulaLine className="text-base text-zinc-700" />
      <CanvasEuler />
      <p className="text-sm text-zinc-600">
        The red vector shows r·e<sup>iθ</sup>, with dashed projections revealing the cosine and sine components.
      </p>
      <ControlsEuler />
    </div>
  );
}
