'use client';
import InlineVar from '@/components/InlineVar';
import CanvasQuadratic from '@/components/CanvasQuadratic';
import ResponsiveCanvas from '@/components/ResponsiveCanvas';
import ControlsQuadratic from '@/components/ControlsQuadratic';
import ExplodedFormula from '@/components/ExplodedFormula';
import ExplodedModeToggle from '@/components/ExplodedModeToggle';
import ScenarioManager from '@/components/ScenarioManager';
import { useFormulaStore } from '@/lib/state/store';
import FormulaLine from '@/components/FormulaLine';
import { useFormulaMeta } from '@/lib/hooks/useFormulaMeta';

export default function QuadraticView() {
  const { vars, setVar, formulaId, explodedMode } = useFormulaStore();
  const formulaMeta = useFormulaMeta('quadratic');
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Quadratic Function</h2>
        <ExplodedModeToggle />
      </div>
      
      {explodedMode && formulaMeta ? (
        <ExplodedFormula
          meta={formulaMeta}
          vars={vars}
          onVarChange={setVar}
        />
      ) : formulaMeta ? (
        <div className="text-lg flex flex-wrap items-center gap-2">
          y =
          <InlineVar
            meta={formulaMeta.variables.a}
            value={vars.a ?? formulaMeta.variables.a.defaultValue}
            onChange={v => setVar('a', v)}
          />
          x² +
          <InlineVar
            meta={formulaMeta.variables.b}
            value={vars.b ?? formulaMeta.variables.b.defaultValue}
            onChange={v => setVar('b', v)}
          />
          x +
          <InlineVar
            meta={formulaMeta.variables.c}
            value={vars.c ?? formulaMeta.variables.c.defaultValue}
            onChange={v => setVar('c', v)}
          />
        </div>
      ) : null}
      
      <FormulaLine className="text-base text-zinc-700" />
      <ResponsiveCanvas>
        {(width, height) => <CanvasQuadratic width={width} height={height} />}
      </ResponsiveCanvas>
      <ControlsQuadratic />
      <ScenarioManager />
    </div>
  );
}
