'use client';
import InlineVar from '@/components/InlineVar';
import VariableInfoPanel from '@/components/VariableInfoPanel';
import CanvasPredatorPrey from '@/components/CanvasPredatorPrey';
import ControlsPredatorPrey from '@/components/ControlsPredatorPrey';
import ExplodedFormula from '@/components/ExplodedFormula';
import ExplodedModeToggle from '@/components/ExplodedModeToggle';
import FormulaLine from '@/components/FormulaLine';
import { useFormulaStore } from '@/lib/state/store';
import { useFormulaMeta } from '@/lib/hooks/useFormulaMeta';

export default function PredatorPreyView() {
  const { vars, setVar, formulaId, explodedMode } = useFormulaStore();
  // Importar diretamente os metadados para evitar problemas com o hook
  const { predatorPreyMeta } = require('@/lib/meta/formula-meta');
  const formulaMeta = predatorPreyMeta;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Predator-Prey Model</h2>
        <ExplodedModeToggle />
      </div>
      
      {explodedMode ? (
        <ExplodedFormula
          meta={formulaMeta}
          vars={vars}
          onVarChange={setVar}
        />
      ) : (
        <div className="flex flex-wrap items-center gap-2 text-lg mb-4">
          <div className="w-full mb-2">
            <div className="text-sm text-gray-600 mb-2">System of equations:</div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <div className="font-mono text-sm">
                dx/dt = <InlineVar
                  meta={formulaMeta.variables.alpha}
                  value={vars.alpha ?? formulaMeta.variables.alpha.defaultValue}
                  onChange={v => setVar('alpha', v)}
                /> x - <InlineVar
                  meta={formulaMeta.variables.beta}
                  value={vars.beta ?? formulaMeta.variables.beta.defaultValue}
                  onChange={v => setVar('beta', v)}
                /> xy
              </div>
              <div className="font-mono text-sm mt-1">
                dy/dt = <InlineVar
                  meta={formulaMeta.variables.delta}
                  value={vars.delta ?? formulaMeta.variables.delta.defaultValue}
                  onChange={v => setVar('delta', v)}
                /> xy - <InlineVar
                  meta={formulaMeta.variables.gamma}
                  value={vars.gamma ?? formulaMeta.variables.gamma.defaultValue}
                  onChange={v => setVar('gamma', v)}
                /> y
              </div>
            </div>
          </div>
          
          <div className="w-full">
            <div className="text-sm text-gray-600 mb-2">Initial populations:</div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1">
                x₀ =
                <InlineVar
                  meta={formulaMeta.variables.x0}
                  value={vars.x0 ?? formulaMeta.variables.x0.defaultValue}
                  onChange={v => setVar('x0', v)}
                />
              </span>
              <span className="flex items-center gap-1">
                y₀ =
                <InlineVar
                  meta={formulaMeta.variables.y0}
                  value={vars.y0 ?? formulaMeta.variables.y0.defaultValue}
                  onChange={v => setVar('y0', v)}
                />
              </span>
            </div>
          </div>
        </div>
      )}
      
      <FormulaLine className="text-base text-zinc-700" />
      <CanvasPredatorPrey />
      <p className="text-sm text-zinc-600">
        Observe how prey (blue) and predators (orange) oscillate and trace loops in phase space as parameters change.
      </p>
      <ControlsPredatorPrey />
      <VariableInfoPanel />
    </div>
  );
}
