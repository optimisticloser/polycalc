'use client';

import NumberChip from '@/components/NumberChip';
import CanvasLogisticMap from '@/components/CanvasLogisticMap';
import ControlsLogisticMap from '@/components/ControlsLogisticMap';
import FormulaLine from '@/components/FormulaLine';
import { useFormulaStore } from '@/lib/state/store';

export default function LogisticMapView() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-lg">
        r =
        <NumberChip
          value={vars.r ?? 3.2}
          onChange={(v) => setVar('r', Math.max(2.5, Math.min(4, v)))}
          label="r"
          min={2.5}
          max={4}
          step={0.01}
          decimals={3}
        />
        x0 =
        <NumberChip
          value={vars.x0 ?? 0.2}
          onChange={(v) => setVar('x0', Math.max(0, Math.min(1, v)))}
          label="x0"
          min={0}
          max={1}
          step={0.01}
          decimals={3}
        />
      </div>
      <FormulaLine className="text-base text-zinc-700" />
      <CanvasLogisticMap />
      <p className="text-sm text-zinc-600">
        The logistic map jumps between values quickly—watch the orbit settle and compare with the bifurcation chart below.
      </p>
      <ControlsLogisticMap />
    </div>
  );
}
