import { describe, expect, it } from 'vitest';

describe('quadratic formula', () => {
  it('computes the roots for x^2 - 4 = 0 as ±2', () => {
    const a = 1;
    const b = 0;
    const c = -4;

    const discriminant = b * b - 4 * a * c;
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const denominator = 2 * a;

    const root1 = (-b + sqrtDiscriminant) / denominator;
    const root2 = (-b - sqrtDiscriminant) / denominator;

    expect([root1, root2].sort((left, right) => left - right)).toEqual([-2, 2]);
  });
});
