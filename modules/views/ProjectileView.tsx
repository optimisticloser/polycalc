'use client';
import NumberChip from '@/components/NumberChip';
import CanvasProjectilePixi from '@/components/CanvasProjectilePixi';
import ControlsProjectile from '@/components/ControlsProjectile';
import { useFormulaStore } from '@/lib/state/store';
import FormulaLine from '@/components/FormulaLine';
import ExplodedFormula from '@/components/ExplodedFormula';
import ExplodedModeToggle from '@/components/ExplodedModeToggle';
import ScenarioManager from '@/components/ScenarioManager';
import { useFormulaMeta } from '@/lib/hooks/useFormulaMeta';

export default function ProjectileView() {
  const { vars, setVar, explodedMode } = useFormulaStore();
  const formulaMeta = useFormulaMeta('projectile');
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Projectile Motion</h2>
        <ExplodedModeToggle />
      </div>
      
      {explodedMode && formulaMeta ? (
        <ExplodedFormula
          meta={formulaMeta}
          vars={vars}
          onVarChange={setVar}
        />
      ) : (
        <div className="text-lg flex flex-wrap items-center gap-2">
          v₀ = <NumberChip value={vars.v0 ?? 50} onChange={v => setVar('v0', v)} label="v0" />
          θ = <NumberChip value={vars.theta ?? Math.PI/4} onChange={v => setVar('theta', v)} label="theta" />
          g = <NumberChip value={vars.g ?? 9.81} onChange={v => setVar('g', v)} label="g" />
        </div>
      )}
      
      <FormulaLine className="text-base text-zinc-700" />
        <CanvasProjectilePixi />
      <ControlsProjectile />
      <ScenarioManager />
    </div>
  );
}
