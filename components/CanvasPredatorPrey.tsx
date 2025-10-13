'use client';

import { useMemo } from 'react';
import { useFormulaStore } from '@/lib/state/store';

const WIDTH = 700;
const HEIGHT = 360;
const PAD_X = 50;
const PAD_Y = 40;
const TOTAL_TIME = 30;
const DT = 0.02;

type Simulation = {
  times: number[];
  prey: number[];
  predator: number[];
  maxPrey: number;
  maxPredator: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function simulate(
  alpha: number,
  beta: number,
  gamma: number,
  delta: number,
  x0: number,
  y0: number
): Simulation {
  const steps = Math.floor(TOTAL_TIME / DT);
  let x = Math.max(0, x0);
  let y = Math.max(0, y0);
  const times: number[] = [];
  const prey: number[] = [];
  const predator: number[] = [];
  let maxPrey = x;
  let maxPredator = y;
  for (let i = 0; i <= steps; i += 1) {
    const t = i * DT;
    times.push(t);
    prey.push(x);
    predator.push(y);
    maxPrey = Math.max(maxPrey, x);
    maxPredator = Math.max(maxPredator, y);
    const dx = alpha * x - beta * x * y;
    const dy = delta * x * y - gamma * y;
    x = Math.max(0, x + dx * DT);
    y = Math.max(0, y + dy * DT);
  }
  return { times, prey, predator, maxPrey, maxPredator };
}

export default function CanvasPredatorPrey() {
  const { vars } = useFormulaStore();
  const alpha = clamp(vars.alpha ?? 1, 0, 3);
  const beta = clamp(vars.beta ?? 0.5, 0, 3);
  const gamma = clamp(vars.gamma ?? 1, 0, 3);
  const delta = clamp(vars.delta ?? 0.5, 0, 3);
  const x0 = clamp(vars.x0 ?? 5, 0, 10);
  const y0 = clamp(vars.y0 ?? 3, 0, 10);

  const data = useMemo(
    () => simulate(alpha, beta, gamma, delta, x0, y0),
    [alpha, beta, gamma, delta, x0, y0]
  );

  const plotHeight = 200;
  const plotTop = PAD_Y;
  const plotBottom = plotTop + plotHeight;

  const maxPopulation = Math.max(
    1,
    Math.ceil(Math.max(data.maxPrey, data.maxPredator))
  );

  const mapTime = (t: number) =>
    PAD_X + (t / TOTAL_TIME) * (WIDTH - 2 * PAD_X);
  const mapPopulation = (value: number) =>
    plotBottom - (value / maxPopulation) * plotHeight;

  const preyPath = useMemo(() => {
    return data.times
      .map((t, idx) => {
        const prefix = idx === 0 ? 'M' : 'L';
        return `${prefix} ${mapTime(t)} ${mapPopulation(data.prey[idx])}`;
      })
      .join(' ');
  }, [data, maxPopulation]);

  const predatorPath = useMemo(() => {
    return data.times
      .map((t, idx) => {
        const prefix = idx === 0 ? 'M' : 'L';
        return `${prefix} ${mapTime(t)} ${mapPopulation(data.predator[idx])}`;
      })
      .join(' ');
  }, [data, maxPopulation]);

  const planeSize = 140;
  const planeX = PAD_X;
  const planeY = plotBottom + 40;
  const maxPhaseX = Math.max(1, data.maxPrey);
  const maxPhaseY = Math.max(1, data.maxPredator);
  const mapPhaseX = (value: number) =>
    planeX + (value / maxPhaseX) * planeSize;
  const mapPhaseY = (value: number) =>
    planeY + planeSize - (value / maxPhaseY) * planeSize;

  const phasePath = useMemo(() => {
    return data.prey
      .map((px, idx) => {
        const py = data.predator[idx];
        const prefix = idx === 0 ? 'M' : 'L';
        return `${prefix} ${mapPhaseX(px)} ${mapPhaseY(py)}`;
      })
      .join(' ');
  }, [data, maxPhaseX, maxPhaseY]);

  // Generate time axis labels
  const timeLabels = [];
  for (let t = 0; t <= TOTAL_TIME; t += TOTAL_TIME / 5) {
    timeLabels.push(
      <text
        key={`time-${t}`}
        x={mapTime(t)}
        y={plotBottom + 15}
        textAnchor="middle"
        fontSize="10"
        fill="#666"
      >
        t={t.toFixed(0)}
      </text>
    );
  }

  // Generate population axis labels
  const populationLabels = [];
  for (let p = 0; p <= maxPopulation; p += maxPopulation / 4) {
    populationLabels.push(
      <text
        key={`pop-${p}`}
        x={PAD_X - 5}
        y={mapPopulation(p) + 3}
        textAnchor="end"
        fontSize="10"
        fill="#666"
      >
        {p.toFixed(1)}
      </text>
    );
  }

  // Generate phase plane axis labels
  const phaseXLabels = [];
  const phaseYLabels = [];
  
  for (let x = 0; x <= maxPhaseX; x += maxPhaseX / 4) {
    phaseXLabels.push(
      <text
        key={`phase-x-${x}`}
        x={mapPhaseX(x)}
        y={planeY + planeSize + 12}
        textAnchor="middle"
        fontSize="9"
        fill="#666"
      >
        {x.toFixed(1)}
      </text>
    );
  }
  
  for (let y = 0; y <= maxPhaseY; y += maxPhaseY / 4) {
    phaseYLabels.push(
      <text
        key={`phase-y-${y}`}
        x={planeX - 5}
        y={mapPhaseY(y) + 3}
        textAnchor="end"
        fontSize="9"
        fill="#666"
      >
        {y.toFixed(1)}
      </text>
    );
  }

  return (
    <svg width={WIDTH} height={HEIGHT} className="border rounded bg-white">
      {/* time-series axes */}
      <rect
        x={PAD_X}
        y={plotTop}
        width={WIDTH - 2 * PAD_X}
        height={plotHeight}
        fill="transparent"
        stroke="#e2e8f0"
      />

      <line
        x1={PAD_X}
        y1={plotBottom}
        x2={WIDTH - PAD_X}
        y2={plotBottom}
        stroke="#cbd5f5"
      />

      {/* grid lines for time series */}
      {[0, maxPopulation / 4, maxPopulation / 2, maxPopulation * 3/4, maxPopulation].map((v) => (
        <line
          key={v}
          x1={PAD_X}
          y1={mapPopulation(v)}
          x2={WIDTH - PAD_X}
          y2={mapPopulation(v)}
          stroke="#f1f5f9"
        />
      ))}
      
      {Array.from({length: 6}, (_, i) => i * TOTAL_TIME / 5).map((t) => (
        <line
          key={t}
          x1={mapTime(t)}
          y1={plotTop}
          x2={mapTime(t)}
          y2={plotBottom}
          stroke="#f1f5f9"
        />
      ))}

      {/* Axis labels for time series */}
      {timeLabels}
      {populationLabels}

      <path d={preyPath} fill="none" stroke="#1d4ed8" strokeWidth={2} />
      <path d={predatorPath} fill="none" stroke="#f97316" strokeWidth={2} />

      <text
        x={PAD_X + 12}
        y={plotTop + 16}
        fontSize={12}
        fill="#1d4ed8"
      >
        Prey (x)
      </text>
      <text
        x={PAD_X + 12}
        y={plotTop + 32}
        fontSize={12}
        fill="#f97316"
      >
        Predator (y)
      </text>

      <text
        x={WIDTH - PAD_X}
        y={plotBottom + 20}
        textAnchor="end"
        fontSize={12}
        fill="#475569"
      >
        Time (t)
      </text>

      {/* phase plane */}
      <rect
        x={planeX}
        y={planeY}
        width={planeSize}
        height={planeSize}
        fill="transparent"
        stroke="#e2e8f0"
      />
      <line
        x1={planeX}
        y1={planeY + planeSize}
        x2={planeX + planeSize}
        y2={planeY + planeSize}
        stroke="#cbd5f5"
      />
      <line
        x1={planeX}
        y1={planeY}
        x2={planeX}
        y2={planeY + planeSize}
        stroke="#cbd5f5"
      />

      {/* Grid lines for phase plane */}
      {Array.from({length: 5}, (_, i) => i * maxPhaseX / 4).map((x) => (
        <line
          key={`phase-grid-x-${x}`}
          x1={mapPhaseX(x)}
          y1={planeY}
          x2={mapPhaseX(x)}
          y2={planeY + planeSize}
          stroke="#f1f5f9"
        />
      ))}
      
      {Array.from({length: 5}, (_, i) => i * maxPhaseY / 4).map((y) => (
        <line
          key={`phase-grid-y-${y}`}
          x1={planeX}
          y1={mapPhaseY(y)}
          x2={planeX + planeSize}
          y2={mapPhaseY(y)}
          stroke="#f1f5f9"
        />
      ))}

      {/* Axis labels for phase plane */}
      {phaseXLabels}
      {phaseYLabels}

      <path d={phasePath} fill="none" stroke="#10b981" strokeWidth={2} />

      <text
        x={planeX + planeSize / 2}
        y={planeY - 8}
        textAnchor="middle"
        fontSize={12}
        fill="#0f172a"
      >
        Phase plane (x vs y)
      </text>
      <text
        x={planeX + planeSize / 2}
        y={planeY + planeSize + 18}
        textAnchor="middle"
        fontSize={11}
        fill="#475569"
      >
        Prey population
      </text>
      <text
        x={planeX - 12}
        y={planeY + planeSize / 2}
        textAnchor="end"
        fontSize={11}
        fill="#475569"
        transform={`rotate(-90 ${planeX - 12} ${planeY + planeSize / 2})`}
      >
        Predator
      </text>
    </svg>
  );
}
