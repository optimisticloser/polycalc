'use client';
import InlineVar from '@/components/InlineVar';
import VariableInfoPanel from '@/components/VariableInfoPanel';
import CanvasQuadratic from '@/components/CanvasQuadratic';
import ControlsQuadratic from '@/components/ControlsQuadratic';
import ExplodedFormula from '@/components/ExplodedFormula';
import ExplodedModeToggle from '@/components/ExplodedModeToggle';
import ScenarioManager from '@/components/ScenarioManager';
import { useFormulaStore } from '@/lib/state/store';
import FormulaLine from '@/components/FormulaLine';
import { useFormulaMeta } from '@/lib/hooks/useFormulaMeta';

export default function QuadraticView() {
  const { vars, setVar, formulaId, explodedMode } = useFormulaStore();
  // Importar diretamente os metadados para evitar problemas com o hook
  const { quadraticMeta } = require('@/lib/meta/formula-meta');
  const formulaMeta = quadraticMeta;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Quadratic Function</h2>
        <ExplodedModeToggle />
      </div>
      
      {explodedMode ? (
        <ExplodedFormula
          meta={formulaMeta}
          vars={vars}
          onVarChange={setVar}
        />
      ) : (
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
      )}
      
      <FormulaLine className="text-base text-zinc-700" />
      <CanvasQuadratic />
      <ControlsQuadratic />
      <VariableInfoPanel />
      <ScenarioManager />
    </div>
  );
}
