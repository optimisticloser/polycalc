'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormulaStore } from '@/lib/state/store';

const WIDTH = 700;
const HEIGHT = 360;
const PAD = 30;

function mapX(x: number, xmin: number, xmax: number) {
  return PAD + (x - xmin) / (xmax - xmin) * (WIDTH - 2*PAD);
}
function mapY(y: number, ymin: number, ymax: number) {
  const t = (y - ymin) / (ymax - ymin);
  return HEIGHT - PAD - t * (HEIGHT - 2*PAD);
}

export default function CanvasQuadratic() {
  const { vars } = useFormulaStore();
  const a = vars.a ?? 1;
  const b = vars.b ?? 0;
  const c = vars.c ?? 0;
  const [trails, setTrails] = useState<string[]>([]);
  const lastPath = useRef<string>('');

  const { path, points, roots, discr, vertex } = useMemo(() => {
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
    const d = pts.map((p,i) => `${i===0?'M':'L'} ${mapX(p[0],-10,10)} ${mapY(p[1],ymin,ymax)}`).join(' ');
    const D = b*b - 4*a*c;
    const rootVals: number[] = [];
    if (a !== 0 && D >= 0) {
      const sqrtD = Math.sqrt(D);
      rootVals.push((-b + sqrtD)/(2*a));
      rootVals.push((-b - sqrtD)/(2*a));
    }
    const vx = (a !== 0) ? -b/(2*a) : 0;
    const vy = a*vx*vx + b*vx + c;
    return { path: d, points: pts, roots: rootVals, discr: D, vertex: [vx, vy] as [number, number] };
  }, [a,b,c]);

  useEffect(()=>{
    if (lastPath.current && lastPath.current !== path) {
      setTrails(t => [lastPath.current, ...t].slice(0, 2));
    }
    lastPath.current = path;
  }, [path]);

  let ymin = Infinity, ymax = -Infinity;
  for (const [,y] of points) { ymin = Math.min(ymin,y); ymax = Math.max(ymax,y); }
  if (ymax === ymin) { ymax = ymin + 1; }

  const mapx = (x:number)=>mapX(x,-10,10);
  const mapy = (y:number)=>mapY(y,ymin,ymax);

  return (
    <svg width={WIDTH} height={HEIGHT} className="border rounded bg-white">
      <line x1={mapx(-10)} y1={mapy(0)} x2={mapx(10)} y2={mapy(0)} stroke="#eee" />
      <line x1={mapx(0)} y1={mapy(-999)} x2={mapx(0)} y2={mapy(999)} stroke="#eee" />
      {trails.map((t,i)=>(<path key={i} d={t} fill="none" stroke="#999" strokeWidth="1" />))}
      <path d={path} fill="none" stroke="#111" strokeWidth="2" />
      <circle cx={mapx(vertex[0])} cy={mapy(vertex[1])} r={4} fill="#0ea5e9" />
      {roots.map((r,i)=>(<circle key={i} cx={mapx(r)} cy={mapy(0)} r={4} fill="#ef4444"/>))}
      <text x={WIDTH-10} y={20} textAnchor="end" fontSize="12" fill="#555">
        D = {discr.toFixed(2)} {discr<0? ' (no real roots)': discr===0? ' (touches)': ' (two roots)'}
      </text>
    </svg>
  );
}
