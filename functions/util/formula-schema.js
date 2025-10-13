export const SCHEMA = {
  quadratic: { a: [-5, 5], b: [-10, 10], c: [-20, 20] },
  projectile: { v0: [0, 100], theta: [0, 1.57], g: [1, 20] },
};

function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function clampVar(formulaId, name, value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const formula = SCHEMA[formulaId];
  if (!formula) return null;
  const range = formula[name];
  if (!range) return null;
  const [min, max] = range;
  return clampValue(value, min, max);
}
