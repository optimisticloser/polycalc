import type { Vars } from '@/lib/state/store';
import type { FormulaMeta as DetailedFormulaMeta } from '@/lib/types/variable';
import { quadraticMeta, predatorPreyMeta } from '@/lib/meta/formula-meta';

export type Preset = { id: string; title: string; vars: Vars };

export type FormulaMeta = {
  id: string;
  title: string;
  defaults: Vars;
  presets: Preset[];
  // Referência opcional aos metadados detalhados
  detailedMeta?: DetailedFormulaMeta;
};

export const registryMeta: FormulaMeta[] = [
  {
    id: 'quadratic',
    title: 'Quadratic (Parabola)',
    defaults: { a: 1, b: 0, c: 0 },
    presets: [
      { id: 'two-roots', title: 'Two roots', vars: { a: 1, b: 0, c: -4 } },
      { id: 'touches', title: 'Touches axis', vars: { a: 1, b: -4, c: 4 } },
      { id: 'no-real', title: 'No real roots', vars: { a: 1, b: 0, c: 4 } },
    ],
    detailedMeta: quadraticMeta,
  },
  {
    id: 'projectile',
    title: 'Projectile Motion',
    defaults: { v0: 50, theta: 0.785, g: 9.81 },
    presets: [
      { id: '30deg', title: '30°', vars: { theta: Math.PI / 6 } },
      { id: '45deg', title: '45°', vars: { theta: Math.PI / 4 } },
      { id: '60deg', title: '60°', vars: { theta: Math.PI / 3 } },
    ],
  },
  {
    id: 'sine',
    title: 'Sine / SHM',
    defaults: { A: 1, omega: 1, phi: 0 },
    presets: [
      { id: 'baseline', title: 'Baseline', vars: { A: 1, omega: 1, phi: 0 } },
      { id: 'big-amplitude', title: 'A = 3', vars: { A: 3 } },
      { id: 'phase-shift', title: 'Phase shift', vars: { phi: Math.PI / 4 } },
    ],
  },
  {
    id: 'normal',
    title: 'Normal Distribution',
    defaults: { mu: 0, sigma: 1 },
    presets: [
      { id: 'standard', title: 'Standard (0,1)', vars: { mu: 0, sigma: 1 } },
      { id: 'narrow', title: 'Narrow', vars: { sigma: 0.7 } },
      { id: 'shifted', title: 'Shifted mean', vars: { mu: 1.5, sigma: 1.2 } },
    ],
  },
  {
    id: 'ideal-gas',
    title: 'Ideal Gas Law',
    defaults: { V: 5, T: 300, n: 1 },
    presets: [
      { id: 'high-pressure', title: 'High pressure', vars: { V: 2, T: 500, n: 2 } },
      { id: 'low-temperature', title: 'Cool gas', vars: { T: 180 } },
      { id: 'spacious', title: 'Large volume', vars: { V: 9 } },
    ],
  },
  {
    id: 'fourier-square',
    title: 'Fourier Series (Square Wave)',
    defaults: { N: 1, f0: 1 },
    presets: [
      { id: 'fundamental', title: 'Fundamental', vars: { N: 1, f0: 1 } },
      { id: 'five-terms', title: '5 terms', vars: { N: 5 } },
      { id: 'fast-wave', title: 'f₀ = 3', vars: { f0: 3, N: 9 } },
    ],
  },
  {
    id: 'euler-complex',
    title: "Euler's Formula",
    defaults: { theta: 0, r: 1 },
    presets: [
      { id: 'unit', title: 'Unit circle', vars: { r: 1 } },
      { id: 'quarter-turn', title: 'θ = π/2', vars: { theta: Math.PI / 2 } },
      { id: 'double-radius', title: 'r = 1.5', vars: { r: 1.5, theta: Math.PI / 4 } },
    ],
  },
  {
    id: 'gravity',
    title: 'Newtonian Gravity',
    defaults: { m1: 10, m2: 10, r: 20 },
    presets: [
      { id: 'close', title: 'Close masses', vars: { r: 5 } },
      { id: 'heavy', title: 'Heavy pair', vars: { m1: 80, m2: 90 } },
      { id: 'far', title: 'Far apart', vars: { r: 60 } },
    ],
  },
  {
    id: 'predator-prey',
    title: 'Predator-Prey (Lotka-Volterra)',
    defaults: { alpha: 1, beta: 0.5, gamma: 1, delta: 0.5, x0: 5, y0: 3 },
    presets: [
      { id: 'stable-cycle', title: 'Stable cycle', vars: { alpha: 1.1, beta: 0.6, gamma: 1.1, delta: 0.6 } },
      { id: 'fast-predators', title: 'Predators thrive', vars: { delta: 0.9, gamma: 0.8 } },
      { id: 'prey-boom', title: 'Prey boom', vars: { x0: 8, y0: 2, alpha: 1.5 } },
    ],
    detailedMeta: predatorPreyMeta,
  },
  {
    id: 'logistic-map',
    title: 'Logistic Map (Chaos)',
    defaults: { r: 3.2, x0: 0.2 },
    presets: [
      { id: 'fixed-point', title: 'Fixed point', vars: { r: 2.8, x0: 0.3 } },
      { id: 'period-2', title: 'Period-2', vars: { r: 3.2, x0: 0.2 } },
      { id: 'chaotic', title: 'Chaotic', vars: { r: 3.9, x0: 0.2 } },
    ],
  },
];

export const ids = registryMeta.map((entry) => entry.id);

export function resolveFormulaId(id: string | undefined) {
  if (!id) return ids[0];
  return ids.includes(id) ? id : ids[0];
}

export function getFormulaMeta(id: string) {
  return registryMeta.find((entry) => entry.id === id) ?? registryMeta[0];
}
