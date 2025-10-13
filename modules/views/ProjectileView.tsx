'use client';
import NumberChip from '@/components/NumberChip';
import CanvasProjectile from '@/components/CanvasProjectile';
import ControlsProjectile from '@/components/ControlsProjectile';
import { useFormulaStore } from '@/lib/state/store';
import FormulaLine from '@/components/FormulaLine';

export default function ProjectileView() {
  const { vars, setVar } = useFormulaStore();
  return (
    <div className="space-y-4">
      <div className="text-lg flex flex-wrap items-center gap-2">
        v₀ = <NumberChip value={vars.v0 ?? 50} onChange={v => setVar('v0', v)} label="v0" />
        θ = <NumberChip value={vars.theta ?? Math.PI/4} onChange={v => setVar('theta', v)} label="theta" />
        g = <NumberChip value={vars.g ?? 9.81} onChange={v => setVar('g', v)} label="g" />
      </div>
      <FormulaLine className="text-base text-zinc-700" />
      <CanvasProjectile />
      <ControlsProjectile />
    </div>
  );
}
