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
    } else if (name === 'setMany') {
      if (typeof args.patch === 'object' && args.patch !== null) {
        store.setMany(args.patch);
        const changes = Object.entries(args.patch).map(([k, v]) => `${k}=${v}`).join(', ');
        store.pushAction(`scenario: ${changes}`);
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
  const fallbackContent =
    'Tutor is unavailable right now. Verify your /api/ask setup and try again.';

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages, tools: toolSchema }),
    });

    const text = await res.text();
    if (!text) {
      return { content: fallbackContent };
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (error) {
      console.error('Tutor response was not valid JSON', error, text);
      return { content: fallbackContent };
    }

    const { content, toolCalls } = parseOpenAIResponse(data);
    if (toolCalls?.length) applyToolCalls(toolCalls);
    return { content: content || fallbackContent };
  } catch (error) {
    console.error('Failed to reach tutor endpoint', error);
    return { content: fallbackContent };
  }
}

export async function askTutorWithContext(
  variableId: string,
  meta: { label: string; desc: string; unit?: string },
  userQuestion?: string
) {
  const { formulaId, vars, formulaMeta } = useFormulaStore.getState();
  const system = {
    role: 'system' as const,
    content: 'You are a patient math tutor. Use short paragraphs. When useful, propose tool calls (setVariable or setMany) to illustrate effects.'
  };
  
  const context = {
    role: 'assistant' as const,
    content: `Current formula: ${formulaMeta?.title || formulaId}
Variable: ${meta.label} (${variableId})
Description: ${meta.desc}
Unit: ${meta.unit || 'none'}
Current value: ${vars[variableId]}
All current values: ${JSON.stringify(vars)}`
  };
  
  const user = {
    role: 'user' as const,
    content: userQuestion || `Explain ${meta.label} and how changing it affects the visualization.`
  };
  
  return askTutor([system, context, user]);
}
