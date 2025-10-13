'use client';

import NumberChip from '@/components/NumberChip';
import CanvasGravity from '@/components/CanvasGravity';
import ControlsGravity from '@/components/ControlsGravity';
import FormulaLine from '@/components/FormulaLine';
import { useFormulaStore } from '@/lib/state/store';
import ExplodedFormula from '@/components/ExplodedFormula';
import ExplodedModeToggle from '@/components/ExplodedModeToggle';
import ScenarioManager from '@/components/ScenarioManager';
import VariableInfoPanel from '@/components/VariableInfoPanel';
import { useFormulaMeta } from '@/lib/hooks/useFormulaMeta';

export default function GravityView() {
  const { vars, setVar, explodedMode } = useFormulaStore();
  const formulaMeta = useFormulaMeta('gravity');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Newton\'s Law of Universal Gravitation</h2>
        <ExplodedModeToggle />
      </div>
      
      {explodedMode && formulaMeta ? (
        <ExplodedFormula
          meta={formulaMeta}
          vars={vars}
          onVarChange={setVar}
        />
      ) : (
        <div className="flex flex-wrap items-center gap-2 text-lg">
          m1 =
          <NumberChip
            value={vars.m1 ?? 10}
            onChange={(v) => setVar('m1', Math.max(1, v))}
            label="m1"
            min={1}
            max={100}
            step={1}
          />
          m2 =
          <NumberChip
            value={vars.m2 ?? 10}
            onChange={(v) => setVar('m2', Math.max(1, v))}
            label="m2"
            min={1}
            max={100}
            step={1}
          />
          r =
          <NumberChip
            value={vars.r ?? 20}
            onChange={(v) => setVar('r', Math.max(1, v))}
            label="r"
            min={1}
            max={100}
            step={1}
          />
        </div>
      )}
      
      <FormulaLine className="text-base text-zinc-700" />
      <CanvasGravity />
      <p className="text-sm text-zinc-600">
        Drag either mass or use the controls to see how distance weakens the gravitational pull.
      </p>
      <ControlsGravity />
      <VariableInfoPanel />
      <ScenarioManager />
    </div>
  );
}
