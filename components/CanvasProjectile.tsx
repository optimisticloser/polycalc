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

export default function CanvasProjectile() {
  const { vars } = useFormulaStore();
  const v0 = vars.v0 ?? 50;
  const theta = vars.theta ?? Math.PI/4;
  const g = vars.g ?? 9.81;
  const [trails, setTrails] = useState<string[]>([]);
  const lastPath = useRef<string>('');

  const { path, points, range, apex } = useMemo(() => {
    const vx = v0 * Math.cos(theta);
    const vy = v0 * Math.sin(theta);
    const T = (2 * vy) / g;
    const R = vx * T;
    const step = Math.max(0.01, T/200);
    const pts: [number, number][] = [];
    let ymax = 0;
    for (let t=0; t<=T; t+=step) {
      const x = vx * t;
      const y = vy * t - 0.5 * g * t * t;
      ymax = Math.max(ymax, y);
      pts.push([x,y]);
    }
    const xmin = 0, xmax = Math.max(10, R*1.1);
    const ymin = -1, yMax = Math.max(10, ymax*1.2);
    const d = pts.map((p,i)=>`${i===0?'M':'L'} ${mapX(p[0],xmin,xmax)} ${mapY(p[1],ymin,yMax)}`).join(' ');
    return { path: d, points: pts, range: R, apex: ymax };
  }, [v0, theta, g]);

  useEffect(()=>{
    if (lastPath.current && lastPath.current !== path) {
      setTrails(t => [lastPath.current, ...t].slice(0, 2));
    }
    lastPath.current = path;
  }, [path]);

  let xmin=0, xmax=0, ymin=0, ymax=0;
  if (points.length) {
    xmin = 0; ymin = -1;
    xmax = Math.max(10, points[points.length-1][0]*1.1);
    ymax = Math.max(10, Math.max(...points.map(p=>p[1]))*1.2);
  }

  const mapx = (x:number)=>mapX(x,xmin,xmax);
  const mapy = (y:number)=>mapY(y,ymin,ymax);

  return (
    <svg width={WIDTH} height={HEIGHT} className="border rounded bg-white">
      <line x1={mapx(0)} y1={mapy(0)} x2={mapx(xmax)} y2={mapy(0)} stroke="#eee" />
      {trails.map((t,i)=>(<path key={i} d={t} fill="none" stroke="#999" strokeWidth="1" />))}
      <path d={path} fill="none" stroke="#111" strokeWidth="2" />
      <circle cx={mapx(xmax/2)} cy={mapy(apex)} r={4} fill="#0ea5e9" />
      <line x1={mapx(0)} y1={mapy(0)} x2={mapx(range)} y2={mapy(0)} stroke="#ef4444" strokeDasharray="4 4" />
      <text x={mapx(range)} y={mapy(0)-6} fontSize="12" textAnchor="end" fill="#ef4444">Range ≈ {range.toFixed(1)}</text>
    </svg>
  );
}
