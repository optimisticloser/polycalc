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
  const [trails, setTrails] = useState<string[]>([]);
  const lastPath = useRef<string>('');

  const { path, range, apex, bounds } = useMemo(() => {
    const v0 = Number.isFinite(vars.v0) ? Math.max(0, vars.v0) : 0;
    const theta = Number.isFinite(vars.theta) ? vars.theta : 0;
    const g = Number.isFinite(vars.g) && vars.g > 0 ? vars.g : 9.81;

    const vx = Number.isFinite(v0) ? v0 * Math.cos(theta) : 0;
    const vy = Number.isFinite(v0) ? v0 * Math.sin(theta) : 0;
    const rawT = (2 * vy) / g;
    const T = Number.isFinite(rawT) && rawT > 0 ? rawT : 0;
    const rawRange = vx * T;
    const R = Number.isFinite(rawRange) && rawRange > 0 ? rawRange : 0;
    const apexTime = T / 2;
    const apexY =
      Number.isFinite(apexTime)
        ? vy * apexTime - 0.5 * g * apexTime * apexTime
        : 0;
    const apexX = Number.isFinite(apexTime) ? Math.max(0, vx * apexTime) : 0;

    const xmin = 0;
    const xmax = Math.max(10, R * 1.1);
    const ymin = -1;
    const ymax = Math.max(10, apexY * 1.2);

    const pts: [number, number][] = [];
    if (T > 0 && R > 0) {
      const step = Math.max(0.01, T / 200);
      for (let t = 0; t <= T + step / 2; t += step) {
        const x = vx * t;
        const y = vy * t - 0.5 * g * t * t;
        const px = Number.isFinite(x) ? x : 0;
        const py = Number.isFinite(y) ? y : 0;
        pts.push([px, py]);
      }
      if (!pts.length || pts[pts.length - 1][0] !== R) {
        pts.push([R, 0]);
      }
    } else {
      pts.push([0, 0]);
    }

    const pathString = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p[0], xmin, xmax)} ${mapY(p[1], ymin, ymax)}`)
      .join(' ');

    return {
      path: pathString,
      range: R,
      apex: { x: apexX, y: Number.isFinite(apexY) ? apexY : 0 },
      bounds: { xmin, xmax, ymin, ymax },
    };
  }, [vars.v0, vars.theta, vars.g]);

  useEffect(()=>{
    if (lastPath.current && lastPath.current !== path) {
      setTrails(t => [lastPath.current, ...t].slice(0, 2));
    }
    lastPath.current = path;
  }, [path]);

  const { xmin, xmax, ymin, ymax } = bounds;
  const mapx = (x:number)=>mapX(x,xmin,xmax);
  const mapy = (y:number)=>mapY(y,ymin,ymax);
  const displayRange = Math.max(0, range);

  // Gerador de números pseudo-aleatórios baseado em semente
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Sistema de contexto visual dinâmico
  const renderContextualBackground = () => {
    const elements = [];
    
    // Determina o tipo de cenário baseado na distância
    let scenarioType = 'urban';
    if (displayRange > 200) scenarioType = 'mountain';
    if (displayRange > 500) scenarioType = 'ocean';
    
    // Elementos de fundo baseados no cenário
    if (scenarioType === 'urban') {
      // Prédios próximos - detalhes urbanos
      const buildingCount = Math.min(8, Math.max(3, Math.floor(displayRange / 20)));
      for (let i = 0; i < buildingCount; i++) {
        const x = mapx((i + 1) * (displayRange / buildingCount));
        const height = 20 + seededRandom(i * 7) * 30;
        const width = 15 + seededRandom(i * 11) * 10;
        
        elements.push(
          <rect
            key={`building-${i}`}
            x={x - width/2}
            y={mapy(0) - height}
            width={width}
            height={height}
            fill="#4a5568"
            opacity={0.7}
          />
        );
        
        // Janelas dos prédios
        for (let j = 0; j < 3; j++) {
          elements.push(
            <rect
              key={`window-${i}-${j}`}
              x={x - width/2 + 2}
              y={mapy(0) - height + 5 + j * 8}
              width={3}
              height={4}
              fill="#fbbf24"
              opacity={0.8}
            />
          );
        }
      }
    } else if (scenarioType === 'mountain') {
      // Montanhas - elementos naturais
      const mountainCount = Math.min(5, Math.max(2, Math.floor(displayRange / 100)));
      for (let i = 0; i < mountainCount; i++) {
        const x = mapx((i + 1) * (displayRange / mountainCount));
        const height = 40 + seededRandom(i * 13) * 20;
        const width = 60 + seededRandom(i * 17) * 40;
        
        elements.push(
          <polygon
            key={`mountain-${i}`}
            points={`${x-width/2},${mapy(0)} ${x},${mapy(0) - height} ${x+width/2},${mapy(0)}`}
            fill="#6b7280"
            opacity={0.6}
          />
        );
        
        // Picos das montanhas
        elements.push(
          <polygon
            key={`peak-${i}`}
            points={`${x-10},${mapy(0) - height} ${x},${mapy(0) - height - 10} ${x+10},${mapy(0) - height}`}
            fill="#9ca3af"
            opacity={0.8}
          />
        );
      }
    } else if (scenarioType === 'ocean') {
      // Oceano - elementos aquáticos
      const waveCount = Math.min(10, Math.max(5, Math.floor(displayRange / 50)));
      for (let i = 0; i < waveCount; i++) {
        const x = mapx((i + 1) * (displayRange / waveCount));
        const waveHeight = 5 + seededRandom(i * 19) * 10;
        
        elements.push(
          <path
            key={`wave-${i}`}
            d={`M ${x-20} ${mapy(0)} Q ${x} ${mapy(0) - waveHeight} ${x+20} ${mapy(0)}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            opacity={0.6}
          />
        );
      }
      
      // Ilhas distantes
      const islandCount = Math.min(3, Math.max(1, Math.floor(displayRange / 200)));
      for (let i = 0; i < islandCount; i++) {
        const x = mapx((i + 1) * (displayRange / islandCount));
        const height = 15 + seededRandom(i * 23) * 10;
        const width = 30 + seededRandom(i * 29) * 20;
        
        elements.push(
          <ellipse
            key={`island-${i}`}
            cx={x}
            cy={mapy(0) - height/2}
            rx={width/2}
            ry={height/2}
            fill="#10b981"
            opacity={0.7}
          />
        );
      }
    }
    
    return elements;
  };

  return (
    <svg width={WIDTH} height={HEIGHT} className="border rounded bg-gradient-to-b from-sky-200 to-sky-100">
      {/* Fundo do céu com gradiente */}
      <defs>
        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>
      <rect width={WIDTH} height={HEIGHT} fill="url(#skyGradient)" />
      
      {/* Elementos de contexto visual */}
      {renderContextualBackground()}
      
      {/* Linha do solo */}
      <line x1={mapx(0)} y1={mapy(0)} x2={mapx(xmax)} y2={mapy(0)} stroke="#8b5cf6" strokeWidth="2" />
      
      {/* Trilhas anteriores */}
      {trails.map((t,i)=>(<path key={i} d={t} fill="none" stroke="#999" strokeWidth="1" opacity={0.5} />))}
      
      {/* Trajetória atual */}
      <path d={path} fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" />
      
      {/* Ponto de lançamento */}
      <circle cx={mapx(0)} cy={mapy(0)} r={6} fill="#ef4444" />
      <text x={mapx(0)} y={mapy(0)-10} fontSize="10" textAnchor="middle" fill="#ef4444" fontWeight="bold">
        Launch
      </text>
      
      {/* Ponto de pico */}
      <circle cx={mapx(range > 0 ? apex.x : 0)} cy={mapy(apex.y)} r={5} fill="#0ea5e9" />
      <text x={mapx(range > 0 ? apex.x : 0)} y={mapy(apex.y)-10} fontSize="10" textAnchor="middle" fill="#0ea5e9" fontWeight="bold">
        Peak
      </text>
      
      {/* Ponto de impacto */}
      <circle cx={mapx(displayRange)} cy={mapy(0)} r={6} fill="#f59e0b" />
      <text x={mapx(displayRange)} y={mapy(0)-10} fontSize="10" textAnchor="middle" fill="#f59e0b" fontWeight="bold">
        Impact
      </text>
      
      {/* Linha de distância */}
      <line
        x1={mapx(0)}
        y1={mapy(0)}
        x2={mapx(displayRange)}
        y2={mapy(0)}
        stroke="#ef4444"
        strokeDasharray="4 4"
        strokeWidth="2"
      />
      
      {/* Texto da distância */}
      <text x={mapx(displayRange/2)} y={mapy(0)+20} fontSize="14" textAnchor="middle" fill="#ef4444" fontWeight="bold">
        Range ≈ {displayRange.toFixed(1)}m
      </text>
    </svg>
  );
}
