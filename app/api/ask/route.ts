import { NextResponse } from 'next/server';

const MOCK_RESPONSE = {
  choices: [
    {
      message: {
        role: 'assistant',
        content:
          'Running in mock mode. Set PRIMARY_BASE_URL, PRIMARY_API_KEY, and PRIMARY_MODEL in your environment to enable the tutor.',
        tool_calls: [
          {
            type: 'function',
            function: {
              name: 'setVariable',
              arguments: JSON.stringify({ name: 'a', value: 2 }),
            },
          },
        ],
      },
    },
  ],
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const baseUrl = process.env.PRIMARY_BASE_URL;
  const apiKey = process.env.PRIMARY_API_KEY;
  const model = process.env.PRIMARY_MODEL;

  if (!baseUrl || !apiKey || !model) {
    return NextResponse.json(MOCK_RESPONSE);
  }

  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const payload = {
    model,
    messages: body?.messages ?? [],
    tools: body?.tools ?? [],
    tool_choice: 'auto' as const,
  };

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();
    if (!text) {
      return NextResponse.json(MOCK_RESPONSE, { status: upstream.status });
    }

    return new Response(text, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to reach primary AI backend', error);
    return NextResponse.json(MOCK_RESPONSE, { status: 200 });
  }
}
