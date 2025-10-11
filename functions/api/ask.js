import { clampResponseToolCalls, formulaSchema } from '../util/formula-schema.js';

function inferFormulaId(body) {
  if (body && typeof body.formulaId === 'string') {
    return body.formulaId;
  }
  const messages = body?.messages;
  if (Array.isArray(messages)) {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const content = messages[i]?.content;
      if (typeof content !== 'string') continue;
      const match = content.match(/formula(?:\s*id)?\s*[:=]\s*([a-z0-9_-]+)/i);
      if (match) return match[1];
    }
  }
  return undefined;
}

export const onRequest = async (context) => {
  const { request, env } = context;
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': '*',
        'access-control-allow-methods': 'POST,OPTIONS',
      }
    });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers: { 'content-type': 'application/json' } });
  }
  const cors = {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'content-type': 'application/json'
  };
  try {
    const body = await request.json();
    const messages = body.messages ?? [];
    const tools = body.tools ?? [];

    let formulaId = inferFormulaId(body);
    if (!formulaSchema[formulaId]) {
      formulaId = 'quadratic';
    }

    const base = env.PRIMARY_BASE_URL;
    const key = env.PRIMARY_API_KEY;
    const model = env.PRIMARY_MODEL || 'gpt-4o-mini';

    if (!base || !key) {
      const mock = {
        role: 'assistant',
        content: 'Mock: Try increasing "a" to make the parabola steeper. Wire PRIMARY_* envs to call a real model.',
        tool_calls: [{ type: 'function', function: { name: 'setVariable', arguments: JSON.stringify({ name: 'a', value: 2 }) } }]
      };
      const guardedMock = clampResponseToolCalls(mock, formulaId);
      return new Response(JSON.stringify(guardedMock), { headers: cors });
    }

    const payload = { model, messages, tools, tool_choice: 'auto' };
    const res = await fetch(`${base.replace(/\/$/,'')}/chat/completions`, {
      method: 'POST',
      headers: { 'authorization': `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      return new Response(JSON.stringify({ error: 'Upstream error', detail: text }), { status: 502, headers: cors });
    }
    const data = await res.json();
    const guarded = clampResponseToolCalls(data, formulaId);
    return new Response(JSON.stringify(guarded), { headers: cors });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Bad request', detail: String(err) }), { status: 400, headers: cors });
  }
};
