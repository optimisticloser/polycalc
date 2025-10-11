'use client';
import { toolSchema } from './tools';
import { useFormulaStore } from '@/lib/state/store';

export type ChatMessage = { role: 'user'|'assistant'|'system'; content: string };

function applyToolCalls(calls: any[]) {
  const store = useFormulaStore.getState();
  for (const call of calls) {
    const name = call?.function?.name || call?.name;
    const argsRaw = call?.function?.arguments ?? call?.arguments ?? '{}';
    let args: any = {};
    try { args = JSON.parse(argsRaw); } catch {}
    if (name === 'setVariable') {
      if (typeof args.name === 'string' && typeof args.value === 'number') {
        store.setVar(args.name, args.value);
        store.pushAction(`set ${args.name} → ${args.value}`);
      }
    } else if (name === 'showStep') {
      if (typeof args.index === 'number') {
        store.setStep(args.index);
        store.pushAction(`showStep ${args.index}`);
      }
    } else if (name === 'switchFormula') {
      if (typeof args.id === 'string') {
        store.pushAction(`switchFormula ${args.id}`);
      }
    } else if (name === 'reset') {
      store.pushAction('reset (noop in demo)');
    }
  }
}

function parseOpenAIResponse(data: any) {
  let content = '';
  let toolCalls: any[] = [];
  if (data?.choices?.length) {
    const msg = data.choices[0].message;
    content = msg?.content ?? '';
    if (msg?.tool_calls?.length) toolCalls = msg.tool_calls;
  } else {
    content = data?.content ?? '';
    if (data?.tool_calls?.length) toolCalls = data.tool_calls;
  }
  return { content, toolCalls };
}

export async function askTutor(messages: ChatMessage[]) {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'content-type':'application/json' },
    body: JSON.stringify({ messages, tools: toolSchema })
  });
  const data = await res.json();
  const { content, toolCalls } = parseOpenAIResponse(data);
  if (toolCalls?.length) applyToolCalls(toolCalls);
  return { content };
}
