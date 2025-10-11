import type { Vars } from '@/lib/state/store';

const pathForFormula = (formulaId: string) => `/formulas/${formulaId}`;

export function encodeVars(vars: Vars, defaults: Vars): string | null {
  const diffEntries = Object.entries(vars).filter(([key, value]) => {
    return defaults[key] !== value;
  });

  if (diffEntries.length === 0) {
    return null;
  }

  const diff = Object.fromEntries(diffEntries);

  try {
    return btoa(JSON.stringify(diff));
  } catch (err) {
    console.error('Failed to encode vars for URL', err);
    return null;
  }
}

export function decodeVars(encoded?: string): Vars | null {
  if (!encoded) return null;
  try {
    const raw = atob(encoded);
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Vars;
    }
  } catch (err) {
    console.error('Failed to decode vars from URL', err);
  }
  return null;
}

export function updateUrl(formulaId: string, vars: Vars, step: number, defaults: Vars) {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams();
  const encoded = encodeVars(vars, defaults);
  if (encoded) {
    params.set('vars', encoded);
  }

  if (Number.isFinite(step) && step !== 0) {
    params.set('step', step.toString());
  }

  const search = params.toString();
  const url = `${pathForFormula(formulaId)}${search ? `?${search}` : ''}`;
  window.history.replaceState(null, '', url);
}
