'use client';

import { useMemo } from 'react';
import TeX from '@/components/TeX';
import { useFormulaStore } from '@/lib/state/store';

type FormulaLineProps = {
  className?: string;
};

function normalizeValue(value: number) {
  return Math.abs(value) < 0.005 ? 0 : value;
}

function getNumber(vars: Record<string, number>, key: string, fallback: number) {
  const value = vars[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }
  return value;
}

function formatNumber(value: number) {
  const normalized = normalizeValue(value);
  return normalized.toFixed(2);
}

function formatSignedTerm(value: number, suffix = '') {
  const normalized = normalizeValue(value);
  const magnitude = formatNumber(Math.abs(normalized));
  const sign = normalized < 0 ? '-' : '+';
  return `${sign} ${magnitude}${suffix}`;
}

function buildQuadratic(vars: Record<string, number>) {
  const a = getNumber(vars, 'a', 1);
  const b = getNumber(vars, 'b', 0);
  const c = getNumber(vars, 'c', 0);
  const aTerm = `${formatNumber(a)}\\,x^2`;
  const bTerm = `${formatSignedTerm(b, '\\,x')}`;
  const cTerm = `${formatSignedTerm(c)}`;
  return `y = ${aTerm} ${bTerm} ${cTerm}`;
}

function buildProjectile(vars: Record<string, number>) {
  const v0 = getNumber(vars, 'v0', 50);
  const theta = getNumber(vars, 'theta', Math.PI / 4);
  const g = getNumber(vars, 'g', 9.81);
  const v0Text = formatNumber(v0);
  const thetaText = formatNumber(theta);
  const gText = formatNumber(g);
  return `x(t)=${v0Text}\\cos(${thetaText})\\,t,\\quad y(t)=${v0Text}\\sin(${thetaText})\\,t - \\frac{1}{2}\\cdot ${gText}\\,t^2`;
}

function buildNormal(vars: Record<string, number>) {
  const mu = getNumber(vars, 'mu', 0);
  const sigma = Math.max(0.001, getNumber(vars, 'sigma', 1));
  const sigmaText = formatNumber(sigma);
  const muAbs = formatNumber(Math.abs(mu));
  const muTerm = mu >= 0 ? `x - ${muAbs}` : `x + ${muAbs}`;
  return `f(x)=\\frac{1}{${sigmaText}\\sqrt{2\\pi}}\\,e^{-\\frac{(${muTerm})^2}{2\\,{${sigmaText}}^{2}}}`;
}

function buildIdealGas(vars: Record<string, number>) {
  const V = Math.max(0.001, getNumber(vars, 'V', 5));
  const T = getNumber(vars, 'T', 300);
  const n = getNumber(vars, 'n', 1);
  const vText = formatNumber(V);
  const tText = formatNumber(T);
  const nText = formatNumber(n);
  const pressure = (n * 8.314 * T) / V;
  const pressureText = pressure.toFixed(1);
  return `PV = ${nText}\\cdot 8.314\\cdot ${tText},\\quad P = \\frac{${nText}\\cdot 8.314\\cdot ${tText}}{${vText}} \\approx ${pressureText}`;
}

function buildFourierSquare(vars: Record<string, number>) {
  const N = Math.max(1, Math.round(getNumber(vars, 'N', 1)));
  const f0 = getNumber(vars, 'f0', 1);
  const f0Text = formatNumber(f0);
  const upper = Math.max(0, N - 1);
  return `s_{${N}}(t)=\\sum_{k=0}^{${upper}} \\frac{4}{(2k+1)\\pi} \\sin\\left(2\\pi (2k+1)\\cdot ${f0Text}\\,t\\right)`;
}

function buildEulerComplex(vars: Record<string, number>) {
  const theta = getNumber(vars, 'theta', 0);
  const r = getNumber(vars, 'r', 1);
  const thetaText = formatNumber(theta);
  const rText = formatNumber(r);
  const x = formatNumber(r * Math.cos(theta));
  const y = formatNumber(r * Math.sin(theta));
  return `${rText}\\,e^{i\\,${thetaText}} = ${x} + i\\,${y}`;
}

function buildGravity(vars: Record<string, number>) {
  const m1 = getNumber(vars, 'm1', 10);
  const m2 = getNumber(vars, 'm2', 10);
  const r = Math.max(0.001, getNumber(vars, 'r', 20));
  const m1Text = formatNumber(m1);
  const m2Text = formatNumber(m2);
  const rText = formatNumber(r);
  const force = (6.674 * m1 * m2) / (r * r);
  const forceText = force.toFixed(2);
  return `F = 6.674\\cdot \\frac{${m1Text}\\cdot ${m2Text}}{${rText}^{2}} \\approx ${forceText}`;
}

function buildPredatorPrey(vars: Record<string, number>) {
  const alpha = getNumber(vars, 'alpha', 1);
  const beta = getNumber(vars, 'beta', 0.5);
  const gamma = getNumber(vars, 'gamma', 1);
  const delta = getNumber(vars, 'delta', 0.5);
  const alphaText = formatNumber(alpha);
  const betaText = formatNumber(beta);
  const gammaText = formatNumber(gamma);
  const deltaText = formatNumber(delta);
  return `\\frac{dx}{dt} = ${alphaText}\\,x - ${betaText}\\,x y,\\quad \\frac{dy}{dt} = ${deltaText}\\,x y - ${gammaText}\\,y`;
}

function buildLogisticMap(vars: Record<string, number>) {
  const r = getNumber(vars, 'r', 3.2);
  const rText = formatNumber(r);
  return `x_{n+1} = ${rText}\,x_n (1 - x_n)`;
}

type Builder = (vars: Record<string, number>) => string | null;

const builders: Record<string, Builder> = {
  quadratic: buildQuadratic,
  projectile: buildProjectile,
  normal: buildNormal,
  'ideal-gas': buildIdealGas,
  'fourier-square': buildFourierSquare,
  'euler-complex': buildEulerComplex,
  gravity: buildGravity,
  'predator-prey': buildPredatorPrey,
  'logistic-map': buildLogisticMap,
};

export default function FormulaLine({ className }: FormulaLineProps) {
  const formulaId = useFormulaStore(s => s.formulaId);
  const vars = useFormulaStore(s => s.vars);

  const expr = useMemo(() => {
    if (!vars) return null;
    const builder = builders[formulaId];
    return builder ? builder(vars) : null;
  }, [formulaId, vars]);

  if (!expr) return null;

  return <TeX expr={expr} block className={className} />;
}
