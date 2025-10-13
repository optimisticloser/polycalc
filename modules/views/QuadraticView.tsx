'use client';
import NumberChip from '@/components/NumberChip';
import CanvasQuadratic from '@/components/CanvasQuadratic';
import ControlsQuadratic from '@/components/ControlsQuadratic';
import { useFormulaStore } from '@/lib/state/store';
import FormulaLine from '@/components/FormulaLine';

export default function QuadraticView() {
  const { vars, setVar } = useFormulaStore();
  return (
    <div className="space-y-4">
      <div className="text-lg flex flex-wrap items-center gap-2">
        y = 
        <NumberChip value={vars.a ?? 1} onChange={v => setVar('a', v)} label="a" />
        x² +
        <NumberChip value={vars.b ?? 0} onChange={v => setVar('b', v)} label="b" />
        x +
        <NumberChip value={vars.c ?? 0} onChange={v => setVar('c', v)} label="c" />
      </div>
      <FormulaLine className="text-base text-zinc-700" />
      <CanvasQuadratic />
      <ControlsQuadratic />
    </div>
  );
}
