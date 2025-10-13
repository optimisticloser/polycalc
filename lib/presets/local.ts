import { Vars } from '@/lib/state/store';

const STORAGE_KEY = 'polycalc.presets';
let storageUnavailableLogged = false;

type StoredPreset = { id: string; title: string; vars: Vars };
type StoredData = Record<string, { counter: number; presets: StoredPreset[] }>;

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage;
  } catch (err) {
    if (!storageUnavailableLogged) {
      console.warn('Local storage unavailable', err);
      storageUnavailableLogged = true;
    }
    return null;
  }
}

function sanitizeVars(value: unknown): Vars {
  if (!value || typeof value !== 'object') {
    return {};
  }
  const entries = Object.entries(value as Record<string, unknown>).map(([k, v]) => {
    const num = Number(v);
    return [k, Number.isFinite(num) ? num : 0];
  });
  return Object.fromEntries(entries);
}

function sanitizePreset(value: unknown): StoredPreset | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const maybePreset = value as Record<string, unknown>;
  const { id, title, vars } = maybePreset;
  if (typeof id !== 'string' || typeof title !== 'string') {
    return null;
  }
  return { id, title, vars: sanitizeVars(vars) };
}

function sanitizeData(value: unknown): StoredData {
  if (!value || typeof value !== 'object') {
    return {};
  }
  const result: StoredData = {};
  for (const [formulaId, entry] of Object.entries(value as Record<string, unknown>)) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const { counter, presets } = entry as Record<string, unknown>;
    const safeCounter = Number.isFinite(counter) ? Number(counter) : 0;
    if (!Array.isArray(presets)) {
      result[formulaId] = { counter: safeCounter, presets: [] };
      continue;
    }
    const safePresets = presets
      .map((p) => sanitizePreset(p))
      .filter((p): p is StoredPreset => Boolean(p));
    result[formulaId] = { counter: safeCounter, presets: safePresets };
  }
  return result;
}

function readAll(): StoredData {
  const storage = getLocalStorage();
  if (!storage) {
    return {};
  }
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to read presets storage', err);
  }
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw);
    return sanitizeData(parsed);
  } catch (err) {
    console.warn('Failed to parse presets storage', err);
    return {};
  }
}

function writeAll(data: StoredData) {
  const storage = getLocalStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to write presets storage', err);
  }
}

function cloneVars(vars: Vars): Vars {
  return Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, Number(v)]));
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function savePreset(formulaId: string, vars: Vars) {
  const all = readAll();
  const entry = all[formulaId] ?? { counter: 0, presets: [] };
  const nextCounter = entry.counter + 1;
  const preset: StoredPreset = {
    id: createId(),
    title: `Preset ${nextCounter}`,
    vars: cloneVars(vars),
  };
  all[formulaId] = {
    counter: nextCounter,
    presets: [...entry.presets, preset],
  };
  writeAll(all);
}

export function listPresets(formulaId: string): StoredPreset[] {
  const all = readAll();
  const entry = all[formulaId];
  return entry
    ? entry.presets.map((preset) => ({ ...preset, vars: { ...preset.vars } }))
    : [];
}

export function deletePreset(formulaId: string, id: string) {
  const all = readAll();
  const entry = all[formulaId];
  if (!entry) {
    return;
  }
  const nextPresets = entry.presets.filter((p) => p.id !== id);
  all[formulaId] = { ...entry, presets: nextPresets };
  writeAll(all);
}
