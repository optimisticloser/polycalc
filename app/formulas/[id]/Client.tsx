'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatPanel from '@/components/ChatPanel';
import { getFormula } from '@/modules/registry';
import { useFormulaStore } from '@/lib/state/store';
import { decodeVars, updateUrl } from '@/lib/state/url';

type FormulaClientProps = {
  id: string;
};

function extractParam(value: string | string[] | undefined) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

export default function FormulaClient({ id }: FormulaClientProps) {
  const formula = getFormula(id);
  const setFormula = useFormulaStore(s => s.setFormula);
  const setMany = useFormulaStore(s => s.setMany);
  const setStep = useFormulaStore(s => s.setStep);
  const vars = useFormulaStore(s => s.vars);
  const step = useFormulaStore(s => s.step);
  const formulaId = useFormulaStore(s => s.formulaId);

  const searchParams = useSearchParams();
  const queryVars = searchParams.get('vars') ?? undefined;
  const queryStep = searchParams.get('step') ?? undefined;

  useEffect(() => {
    setFormula(formula.id, formula.defaults);
    const decoded = decodeVars(queryVars);
    if (decoded) {
      setMany(decoded);
    }
    if (queryStep !== undefined) {
      const parsed = parseInt(queryStep, 10);
      setStep(Number.isNaN(parsed) ? 0 : parsed);
    } else {
      setStep(0);
    }
  }, [formula.id, formula.defaults, queryVars, queryStep, setFormula, setMany, setStep]);

  useEffect(() => {
    if (formulaId !== formula.id) return;
    
    // Debounce URL updates to prevent excessive history.replaceState calls
    const timeoutId = setTimeout(() => {
      updateUrl(formula.id, vars, step, formula.defaults);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [formula.id, formula.defaults, formulaId, vars, step]);

  const View = formula.view;

  return (
    <div className="grid grid-cols-[1fr_340px] h-full">
      <div className="p-6 space-y-6">
        <header>
          <h2 className="text-2xl font-semibold">{formula.title}</h2>
          <p className="text-zinc-600">Presets:</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {formula.presets.map(p => (
              <button
                key={p.id}
                onClick={() => setMany(p.vars)}
                className="px-2 py-1 text-sm rounded border hover:bg-zinc-50"
              >
                {p.title}
              </button>
            ))}
          </div>
        </header>
        <section>
          <View />
        </section>
        <section>
          <h3 className="font-semibold">Step-by-step</h3>
          <ol className="list-decimal pl-6 text-sm text-zinc-700 space-y-1">
            <li>Experiment with presets to spot patterns</li>
            <li>Scrub variables inline and with sliders</li>
            <li>Ask the tutor &quot;what changes if I double X?&quot;</li>
          </ol>
        </section>
      </div>
      <ChatPanel />
    </div>
  );
}
