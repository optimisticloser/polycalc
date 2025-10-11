'use client';
import { useEffect, useState } from 'react';
import { useFormulaStore } from '@/lib/state/store';
import { askTutor } from '@/lib/ai/client';
import { deletePreset, listPresets, savePreset } from '@/lib/presets/local';

type LocalPreset = ReturnType<typeof listPresets>[number];

export default function ChatPanel() {
  const { messages, setMessages, actions, formulaId, vars, setMany } = useFormulaStore();
  const [input, setInput] = useState('What happens if I double a?');
  const [showPresets, setShowPresets] = useState(false);
  const [presets, setPresets] = useState<LocalPreset[]>([]);

  useEffect(() => {
    if (showPresets) {
      setPresets(listPresets(formulaId));
    }
  }, [showPresets, formulaId]);

  async function onSend() {
    const next = [...messages, { role:'user', content: input }];
    setMessages(next);
    const { content } = await askTutor(next);
    setMessages([...next, { role:'assistant', content }]);
    setInput('');
  }

  function onSavePreset() {
    savePreset(formulaId, vars);
    setShowPresets(true);
    setPresets(listPresets(formulaId));
  }

  function togglePresets() {
    setShowPresets((prev) => !prev);
    if (!showPresets) {
      setPresets(listPresets(formulaId));
    }
  }

  function onApplyPreset(preset: LocalPreset) {
    setMany(preset.vars);
    setShowPresets(false);
  }

  function onDeletePreset(id: string) {
    deletePreset(formulaId, id);
    setPresets(listPresets(formulaId));
  }

  return (
    <div className="border-l border-zinc-200 flex flex-col h-full">
      <div className="p-3 flex items-center justify-between gap-3">
        <div className="font-semibold">AI Tutor</div>
        <div className="flex items-center gap-2 text-xs">
          <button className="px-2 py-1 border rounded" onClick={onSavePreset}>
            Save preset
          </button>
          <button className="px-2 py-1 border rounded" onClick={togglePresets}>
            {showPresets ? 'Hide' : 'View'}
          </button>
        </div>
      </div>
      {showPresets && (
        <div className="px-3 pb-3 text-xs space-y-2">
          {presets.length === 0 ? (
            <div className="text-zinc-500">No presets saved yet.</div>
          ) : (
            <ul className="space-y-2">
              {presets.map((preset) => (
                <li key={preset.id} className="border rounded p-2">
                  <div className="font-medium mb-1">{preset.title}</div>
                  <div className="flex gap-2">
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => onApplyPreset(preset)}
                    >
                      Apply
                    </button>
                    <button
                      className="px-2 py-1 border rounded text-red-600"
                      onClick={() => onDeletePreset(preset.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="px-3 pb-2 text-xs text-zinc-500">Recent actions</div>
      <ul className="px-3 text-xs space-y-1 max-h-28 overflow-auto">
        {actions.map((a,i)=>(<li key={i}>• {a}</li>))}
      </ul>
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.map((m,i)=>(
          <div key={i} className={m.role==='user'?'text-right':''}>
            <div className={"inline-block px-3 py-2 rounded " + (m.role==='user'?'bg-zinc-800 text-white':'bg-zinc-100')}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 flex gap-2 border-t border-zinc-200">
        <input className="flex-1 border rounded px-2 py-1" value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about this formula..." />
        <button className="px-3 py-1 rounded bg-black text-white" onClick={onSend}>Send</button>
      </div>
    </div>
  );
}
