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

    const base = env.PRIMARY_BASE_URL;
    const key = env.PRIMARY_API_KEY;
    const model = env.PRIMARY_MODEL || 'gpt-4o-mini';

    if (!base || !key) {
      return new Response(JSON.stringify({
        role: 'assistant',
        content: 'Mock: Try increasing "a" to make the parabola steeper. Wire PRIMARY_* envs to call a real model.',
        tool_calls: [{ type: 'function', function: { name: 'setVariable', arguments: JSON.stringify({ name: 'a', value: 2 }) } }]
      }), { headers: cors });
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
    return new Response(JSON.stringify(data), { headers: cors });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Bad request', detail: String(err) }), { status: 400, headers: cors });
  }
};
