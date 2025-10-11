'use client';
import { useState } from 'react';
import { useFormulaStore } from '@/lib/state/store';
import { askTutor } from '@/lib/ai/client';

export default function ChatPanel() {
  const { messages, setMessages, actions } = useFormulaStore();
  const [input, setInput] = useState('What happens if I double a?');

  async function onSend() {
    const next = [...messages, { role:'user', content: input }];
    setMessages(next);
    const { content } = await askTutor(next);
    setMessages([...next, { role:'assistant', content }]);
    setInput('');
  }

  return (
    <div className="border-l border-zinc-200 flex flex-col h-full">
      <div className="p-3 font-semibold">AI Tutor</div>
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
