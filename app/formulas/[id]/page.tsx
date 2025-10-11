'use client';
import { registry, getFormula, ids } from '@/modules/registry';
import { useFormulaStore } from '@/lib/state/store';
import { useEffect } from 'react';
import ChatPanel from '@/components/ChatPanel';

export function generateStaticParams() {
  return ids.map(id => ({ id }));
}

export default function FormulaPage({ params }: { params: { id: string } }) {
  const f = getFormula(params.id);
  const { setFormula, setMany } = useFormulaStore();

  useEffect(()=>{
    setFormula(f.id, f.defaults);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.id]);

  const View = f.view;

  return (
    <div className="grid grid-cols-[1fr_340px] h-full">
      <div className="p-6 space-y-6">
        <header>
          <h2 className="text-2xl font-semibold">{f.title}</h2>
          <p className="text-zinc-600">Presets:</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {f.presets.map(p => (
              <button key={p.id} onClick={()=>setMany(p.vars)} className="px-2 py-1 text-sm rounded border hover:bg-zinc-50">
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
            <li>Ask the tutor "what changes if I double X?"</li>
          </ol>
        </section>
      </div>
      <ChatPanel />
    </div>
  );
}
