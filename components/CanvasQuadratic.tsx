'use client';
import { useEffect, useRef, useState } from 'react';
import { useFormulaStore } from '@/lib/state/store';

const DEFAULT_WIDTH = 700;
const DEFAULT_HEIGHT = 360;
const PAD = 30;

function mapX(x: number, xmin: number, xmax: number, width: number) {
  return PAD + (x - xmin) / (xmax - xmin) * (width - 2*PAD);
}
function mapY(y: number, ymin: number, ymax: number, height: number) {
  const t = (y - ymin) / (ymax - ymin);
  return height - PAD - t * (height - 2*PAD);
}

type QuadraticData = {
  path: string;
  points: [number, number][];
  roots: number[];
  discr: number;
  vertex: [number, number];
};

function computeQuadraticData(a: number, b: number, c: number, width: number, height: number): QuadraticData {
  const xmin = -10, xmax = 10;
  const step = 0.05;
  const pts: [number, number][] = [];
  let ymin = Infinity, ymax = -Infinity;
  for (let x = xmin; x <= xmax; x += step) {
    const y = a*x*x + b*x + c;
    ymin = Math.min(ymin, y);
    ymax = Math.max(ymax, y);
    pts.push([x, y]);
  }
  if (ymax === ymin) { ymax = ymin + 1; }
  const d = pts.map((p,i) => `${i===0?'M':'L'} ${mapX(p[0],-10,10,width)} ${mapY(p[1],ymin,ymax,height)}`).join(' ');
  const D = b*b - 4*a*c;
  const rootVals: number[] = [];
  if (a !== 0 && D >= 0) {
    const sqrtD = Math.sqrt(D);
    rootVals.push((-b + sqrtD)/(2*a));
    rootVals.push((-b - sqrtD)/(2*a));
  }
  const vx = (a !== 0) ? -b/(2*a) : 0;
  const vy = a*vx*vx + b*vx + c;
  const vertex: [number, number] = [vx, vy];
  return { path: d, points: pts, roots: rootVals, discr: D, vertex };
}

interface CanvasQuadraticProps {
  width?: number;
  height?: number;
}

export default function CanvasQuadratic({ width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT }: CanvasQuadraticProps) {
  const { vars } = useFormulaStore();
  const a = vars.a ?? 1;
  const b = vars.b ?? 0;
  const c = vars.c ?? 0;
  const [trails, setTrails] = useState<string[]>([]);
  const lastPath = useRef<string>('');
  const frameRef = useRef<number | null>(null);
  const latestVars = useRef({ a, b, c, width, height });
  const [{ path, points, roots, discr, vertex }, setData] = useState<QuadraticData>(() => computeQuadraticData(a, b, c, width, height));

  useEffect(() => {
    latestVars.current = { a, b, c, width, height };
    if (frameRef.current !== null) {
      return;
    }
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const next = computeQuadraticData(latestVars.current.a, latestVars.current.b, latestVars.current.c, latestVars.current.width, latestVars.current.height);
      setData(prev => (prev.path === next.path ? prev : next));
    });
  }, [a, b, c, width, height]);

  useEffect(() => () => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
  }, []);

  useEffect(()=>{
    if (lastPath.current && lastPath.current !== path) {
      setTrails(t => [lastPath.current, ...t].slice(0, 2));
    }
    lastPath.current = path;
  }, [path]);

  let ymin = Infinity, ymax = -Infinity;
  for (const [,y] of points) { ymin = Math.min(ymin,y); ymax = Math.max(ymax,y); }
  if (ymax === ymin) { ymax = ymin + 1; }

  const mapx = (x:number)=>mapX(x,-10,10,width);
  const mapy = (y:number)=>mapY(y,ymin,ymax,height);

  // Generate axis labels
  const xLabels = [];
  const yLabels = [];
  
  // X-axis labels (from -10 to 10)
  for (let x = -10; x <= 10; x += 5) {
    xLabels.push(
      <text
        key={`x-${x}`}
        x={mapx(x)}
        y={mapy(0) + 15}
        textAnchor="middle"
        fontSize="10"
        fill="#666"
      >
        {x}
      </text>
    );
  }
  
  // Y-axis labels
  const yStep = Math.pow(10, Math.floor(Math.log10(Math.max(Math.abs(ymin), Math.abs(ymax))))) / 2;
  const yMin = Math.floor(ymin / yStep) * yStep;
  const yMax = Math.ceil(ymax / yStep) * yStep;
  
  for (let y = yMin; y <= yMax; y += yStep) {
    if (Math.abs(y) < 0.001) continue; // Skip zero to avoid overlap with axis
    yLabels.push(
      <text
        key={`y-${y}`}
        x={mapx(0) - 10}
        y={mapy(y) + 3}
        textAnchor="end"
        fontSize="10"
        fill="#666"
      >
        {y.toFixed(1)}
      </text>
    );
  }

  return (
    <svg width={width} height={height} className="border rounded bg-white">
      {/* Grid lines */}
      {[...Array(5)].map((_, i) => {
        const x = -10 + i * 5;
        return (
          <line
            key={`grid-x-${x}`}
            x1={mapx(x)}
            y1={mapy(ymin)}
            x2={mapx(x)}
            y2={mapy(ymax)}
            stroke="#f5f5f5"
            strokeWidth="1"
          />
        );
      })}
      
      {[...Array(5)].map((_, i) => {
        const y = yMin + i * ((yMax - yMin) / 4);
        return (
          <line
            key={`grid-y-${y}`}
            x1={mapx(-10)}
            y1={mapy(y)}
            x2={mapx(10)}
            y2={mapy(y)}
            stroke="#f5f5f5"
            strokeWidth="1"
          />
        );
      })}
      
      {/* Axes */}
      <line x1={mapx(-10)} y1={mapy(0)} x2={mapx(10)} y2={mapy(0)} stroke="#ccc" strokeWidth="1" />
      <line x1={mapx(0)} y1={mapy(ymin)} x2={mapx(0)} y2={mapy(ymax)} stroke="#ccc" strokeWidth="1" />
      
      {/* Axis labels */}
      {xLabels}
      {yLabels}
      
      {trails.map((t,i)=>(<path key={i} d={t} fill="none" stroke="#999" strokeWidth="1" />))}
      <path d={path} fill="none" stroke="#111" strokeWidth="2" />
      <circle cx={mapx(vertex[0])} cy={mapy(vertex[1])} r={4} fill="#0ea5e9" />
      {roots.map((r,i)=>(<circle key={i} cx={mapx(r)} cy={mapy(0)} r={4} fill="#ef4444"/>))}
      <text x={width-10} y={20} textAnchor="end" fontSize="12" fill="#555">
        D = {discr.toFixed(2)} {discr<0? ' (no real roots)': discr===0? ' (touches)': ' (two roots)'}
      </text>
    </svg>
  );
}
