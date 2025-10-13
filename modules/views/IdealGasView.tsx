'use client';

import NumberChip from '@/components/NumberChip';
import CanvasIdealGas from '@/components/CanvasIdealGas';
import ControlsIdealGas from '@/components/ControlsIdealGas';
import FormulaLine from '@/components/FormulaLine';
import { useFormulaStore } from '@/lib/state/store';

export default function IdealGasView() {
  const { vars, setVar } = useFormulaStore();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-lg">
        V =
        <NumberChip
          value={vars.V ?? 5}
          onChange={(v) => setVar('V', v)}
          label="V"
          min={1}
          max={10}
          step={0.1}
        />
        T =
        <NumberChip
          value={vars.T ?? 300}
          onChange={(v) => setVar('T', v)}
          label="T"
          min={100}
          max={600}
          step={5}
        />
        n =
        <NumberChip
          value={vars.n ?? 1}
          onChange={(v) => setVar('n', v)}
          label="n"
          min={1}
          max={5}
          step={0.1}
        />
      </div>
      <FormulaLine className="text-base text-zinc-700" />
      <CanvasIdealGas />
      <p className="text-sm text-zinc-600">
        Volume lifts the piston while higher temperature or moles increase pressure on the gauge.
      </p>
      <ControlsIdealGas />
    </div>
  );
}
