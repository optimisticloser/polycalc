export const formulaSchema = {
  quadratic: {
    a: { min: -5, max: 5 },
    b: { min: -10, max: 10 },
    c: { min: -20, max: 20 },
  },
  projectile: {
    v0: { min: 0, max: 100 },
    theta: { min: 0, max: 1.57 },
    g: { min: 1, max: 20 },
  },
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function parseArguments(raw) {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (raw && typeof raw === 'object') {
    return { ...raw };
  }
  return null;
}

function serializeArguments(args, original) {
  const serialized = JSON.stringify(args);
  if (!original) return serialized;
  if (typeof original === 'string') return serialized;
  return args;
}

function sanitizeToolCall(call, ranges) {
  if (!call || typeof call !== 'object') return call;
  const name = call?.function?.name ?? call?.name;
  if (name !== 'setVariable') return call;

  const argsRaw = call?.function?.arguments ?? call?.arguments;
  const args = parseArguments(argsRaw);
  if (!args || typeof args.name !== 'string' || typeof args.value !== 'number' || !Number.isFinite(args.value)) {
    return null;
  }
  const range = ranges?.[args.name];
  if (!range) return null;

  const clampedValue = clamp(args.value, range.min, range.max);
  const nextArgs = { ...args, value: clampedValue };

  const nextCall = { ...call };
  if (nextCall.function) {
    nextCall.function = { ...nextCall.function, arguments: serializeArguments(nextArgs, nextCall.function.arguments) };
  }
  if (Object.prototype.hasOwnProperty.call(nextCall, 'arguments')) {
    nextCall.arguments = serializeArguments(nextArgs, nextCall.arguments);
  }
  return nextCall;
}

export function sanitizeToolCalls(toolCalls, formulaId) {
  if (!Array.isArray(toolCalls)) return toolCalls;
  const ranges = formulaSchema[formulaId];
  if (!ranges) return toolCalls.filter((call) => {
    const name = call?.function?.name ?? call?.name;
    return name !== 'setVariable';
  });

  const sanitized = [];
  for (const call of toolCalls) {
    const next = sanitizeToolCall(call, ranges);
    if (next) sanitized.push(next);
  }
  return sanitized;
}

export function clampResponseToolCalls(data, formulaId) {
  if (!data || typeof data !== 'object') return data;
  const result = Array.isArray(data) ? [...data] : { ...data };

  if (Array.isArray(result.tool_calls)) {
    result.tool_calls = sanitizeToolCalls(result.tool_calls, formulaId);
  }

  if (Array.isArray(result.choices)) {
    result.choices = result.choices.map((choice) => {
      if (!choice || typeof choice !== 'object') return choice;
      const nextChoice = { ...choice };
      if (nextChoice.message && typeof nextChoice.message === 'object') {
        const nextMessage = { ...nextChoice.message };
        if (Array.isArray(nextMessage.tool_calls)) {
          nextMessage.tool_calls = sanitizeToolCalls(nextMessage.tool_calls, formulaId);
        }
        nextChoice.message = nextMessage;
      }
      return nextChoice;
    });
  }

  return result;
}
