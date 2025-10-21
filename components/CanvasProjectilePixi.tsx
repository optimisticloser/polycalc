'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormulaStore } from '@/lib/state/store';
import { Application, Graphics, Container, Text, TextStyle } from 'pixi.js';

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

// Gerador de números pseudo-aleatórios baseado em semente
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Classe para elementos visuais do cenário
class ScenarioElement {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  color: number;
  graphics: Graphics;
  scale: number;
  
  constructor(x: number, y: number, width: number, height: number, type: string, color: number, scale: number = 1) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.color = color;
    this.scale = scale;
    this.graphics = new Graphics();
  }
  
  draw() {
    this.graphics.clear();
    this.graphics.scale.set(this.scale);
    
    switch (this.type) {
      case 'building':
        this.graphics.beginFill(this.color);
        this.graphics.drawRect(this.x - this.width/2, this.y - this.height, this.width, this.height);
        this.graphics.endFill();
        // Janelas
        this.graphics.beginFill(0xfbbf24);
        for (let i = 0; i < 3; i++) {
          this.graphics.drawRect(this.x - this.width/2 + 2, this.y - this.height + 5 + i * 8, 3, 4);
        }
        this.graphics.endFill();
        break;
        
      case 'mountain':
        this.graphics.beginFill(this.color);
        this.graphics.drawPolygon([
          this.x - this.width/2, this.y,
          this.x, this.y - this.height,
          this.x + this.width/2, this.y
        ]);
        this.graphics.endFill();
        // Pico nevado
        this.graphics.beginFill(0x9ca3af);
        this.graphics.drawPolygon([
          this.x - 10, this.y - this.height,
          this.x, this.y - this.height - 10,
          this.x + 10, this.y - this.height
        ]);
        this.graphics.endFill();
        break;
        
      case 'tree':
        // Tronco
        this.graphics.beginFill(0x8b4513);
        this.graphics.drawRect(this.x - 2, this.y - 10, 4, 10);
        this.graphics.endFill();
        // Copa
        this.graphics.beginFill(0x228b22);
        this.graphics.drawCircle(this.x, this.y - 15, 8);
        this.graphics.endFill();
        break;
        
      case 'car':
        // Corpo do carro
        this.graphics.beginFill(0xff0000);
        this.graphics.drawRect(this.x - 8, this.y - 4, 16, 8);
        this.graphics.endFill();
        // Rodas
        this.graphics.beginFill(0x000000);
        this.graphics.drawCircle(this.x - 6, this.y + 2, 2);
        this.graphics.drawCircle(this.x + 6, this.y + 2, 2);
        this.graphics.endFill();
        break;
        
      case 'cloud':
        // Nuvem com múltiplos círculos
        this.graphics.beginFill(0xffffff);
        this.graphics.drawCircle(this.x, this.y, 8);
        this.graphics.drawCircle(this.x + 6, this.y, 6);
        this.graphics.drawCircle(this.x - 6, this.y, 6);
        this.graphics.drawCircle(this.x + 3, this.y - 4, 5);
        this.graphics.drawCircle(this.x - 3, this.y - 4, 5);
        this.graphics.endFill();
        break;
        
      case 'wave':
        this.graphics.lineStyle(2, 0x3b82f6);
        this.graphics.moveTo(this.x - 20, this.y);
        this.graphics.quadraticCurveTo(this.x, this.y - this.height, this.x + 20, this.y);
        break;
        
      case 'island':
        this.graphics.beginFill(this.color);
        this.graphics.drawEllipse(this.x, this.y, this.width/2, this.height/2);
        this.graphics.endFill();
        break;
    }
  }
}

export default function CanvasProjectilePixi() {
  const { vars } = useFormulaStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const [trails, setTrails] = useState<Graphics[]>([]);
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

    return {
      path: pts,
      range: R,
      apex: { x: apexX, y: Number.isFinite(apexY) ? apexY : 0 },
      bounds: { xmin, xmax, ymin, ymax },
    };
  }, [vars.v0, vars.theta, vars.g]);

  // Inicializar PixiJS
  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application();
    app.init({
      canvas: canvasRef.current,
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: 0x87CEEB, // Sky blue
      antialias: true,
    });

    appRef.current = app;

    return () => {
      if (app) {
        app.destroy(true);
      }
    };
  }, []);

  // Renderizar cenário e trajetória
  useEffect(() => {
    if (!appRef.current) return;

    const app = appRef.current;
    app.stage.removeChildren();

    const { xmin, xmax, ymin, ymax } = bounds;
    const mapx = (x: number) => mapX(x, xmin, xmax);
    const mapy = (y: number) => mapY(y, ymin, ymax);
    const displayRange = Math.max(0, range);

    // Perspectiva dinâmica - mais prédios e menores conforme a distância aumenta
    const scenarioElements: ScenarioElement[] = [];

    // Calcular escala e quantidade baseada na distância
    let buildingCount, treeCount, carCount, cloudCount;
    let buildingScale, treeScale, carScale, cloudScale;
    
    if (displayRange <= 50) {
      // Distância curta: poucos prédios grandes (rua urbana)
      buildingCount = 4;
      treeCount = 3;
      carCount = 2;
      cloudCount = 2;
      buildingScale = 1.2;
      treeScale = 1.0;
      carScale = 1.0;
      cloudScale = 1.0;
    } else if (displayRange <= 150) {
      // Distância média: mais prédios, tamanho médio (bairro)
      buildingCount = 8;
      treeCount = 5;
      carCount = 3;
      cloudCount = 3;
      buildingScale = 0.8;
      treeScale = 0.8;
      carScale = 0.8;
      cloudScale = 0.9;
    } else if (displayRange <= 300) {
      // Distância longa: muitos prédios pequenos (vista aérea)
      buildingCount = 12;
      treeCount = 8;
      carCount = 4;
      cloudCount = 4;
      buildingScale = 0.5;
      treeScale = 0.6;
      carScale = 0.6;
      cloudScale = 0.7;
    } else {
      // Distância muito longa: muitos prédios muito pequenos (vista de satélite)
      buildingCount = 16;
      treeCount = 10;
      carCount = 5;
      cloudCount = 5;
      buildingScale = 0.3;
      treeScale = 0.4;
      carScale = 0.4;
      cloudScale = 0.5;
    }

    // Prédios com escala dinâmica
    for (let i = 0; i < buildingCount; i++) {
      const x = mapx((i + 1) * (xmax / (buildingCount + 1)));
      const height = 25 + seededRandom(i * 7) * 15;
      const width = 12 + seededRandom(i * 11) * 6;
      scenarioElements.push(new ScenarioElement(x, mapy(0), width, height, 'building', 0x4a5568, buildingScale));
    }
    
    // Árvores com escala dinâmica
    for (let i = 0; i < treeCount; i++) {
      const x = mapx((i + 0.5) * (xmax / (treeCount + 1)));
      scenarioElements.push(new ScenarioElement(x, mapy(0), 0, 0, 'tree', 0x228b22, treeScale));
    }
    
    // Carros com escala dinâmica
    for (let i = 0; i < carCount; i++) {
      const x = mapx((i + 0.3) * (xmax / (carCount + 1)));
      scenarioElements.push(new ScenarioElement(x, mapy(0), 0, 0, 'car', 0xff0000, carScale));
    }

    // Nuvens com escala dinâmica
    for (let i = 0; i < cloudCount; i++) {
      const x = mapx((i + 0.5) * (xmax / (cloudCount + 1)));
      const y = mapy(0) - 40 - seededRandom(i * 31) * 20;
      scenarioElements.push(new ScenarioElement(x, y, 0, 0, 'cloud', 0xffffff, cloudScale));
    }

    // Desenhar elementos do cenário
    scenarioElements.forEach(element => {
      element.draw();
      app.stage.addChild(element.graphics);
    });

    // Linha do solo
    const groundLine = new Graphics();
    groundLine.lineStyle(3, 0x8b5cf6);
    groundLine.moveTo(mapx(0), mapy(0));
    groundLine.lineTo(mapx(xmax), mapy(0));
    app.stage.addChild(groundLine);

    // Trilhas anteriores
    trails.forEach(trail => {
      app.stage.addChild(trail);
    });

    // Trajetória atual
    if (path.length > 1) {
      const trajectory = new Graphics();
      trajectory.lineStyle(4, 0x111111);
      trajectory.moveTo(mapx(path[0][0]), mapy(path[0][1]));
      for (let i = 1; i < path.length; i++) {
        trajectory.lineTo(mapx(path[i][0]), mapy(path[i][1]));
      }
      app.stage.addChild(trajectory);
    }

    // Ponto de lançamento
    const launchPoint = new Graphics();
    launchPoint.beginFill(0xef4444);
    launchPoint.drawCircle(mapx(0), mapy(0), 6);
    launchPoint.endFill();
    app.stage.addChild(launchPoint);

    // Ponto de pico
    if (range > 0) {
      const peakPoint = new Graphics();
      peakPoint.beginFill(0x0ea5e9);
      peakPoint.drawCircle(mapx(apex.x), mapy(apex.y), 5);
      peakPoint.endFill();
      app.stage.addChild(peakPoint);
    }

    // Ponto de impacto
    const impactPoint = new Graphics();
    impactPoint.beginFill(0xf59e0b);
    impactPoint.drawCircle(mapx(displayRange), mapy(0), 6);
    impactPoint.endFill();
    app.stage.addChild(impactPoint);

    // Linha de distância
    const rangeLine = new Graphics();
    rangeLine.lineStyle(2, 0xef4444, 0.5);
    rangeLine.moveTo(mapx(0), mapy(0));
    rangeLine.lineTo(mapx(displayRange), mapy(0));
    app.stage.addChild(rangeLine);

    // Texto da distância
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 0xef4444,
      fontWeight: 'bold',
    });
    const rangeText = new Text({
      text: `Range ≈ ${displayRange.toFixed(1)}m`,
      style,
    });
    rangeText.x = mapx(displayRange/2) - rangeText.width/2;
    rangeText.y = mapy(0) + 20;
    app.stage.addChild(rangeText);

    // Labels dos pontos
    const labelStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 10,
      fill: 0x333333,
      fontWeight: 'bold',
    });

    const launchLabel = new Text({ text: 'Launch', style: labelStyle });
    launchLabel.x = mapx(0) - launchLabel.width/2;
    launchLabel.y = mapy(0) - 20;
    app.stage.addChild(launchLabel);

    if (range > 0) {
      const peakLabel = new Text({ text: 'Peak', style: labelStyle });
      peakLabel.x = mapx(apex.x) - peakLabel.width/2;
      peakLabel.y = mapy(apex.y) - 20;
      app.stage.addChild(peakLabel);
    }

    const impactLabel = new Text({ text: 'Impact', style: labelStyle });
    impactLabel.x = mapx(displayRange) - impactLabel.width/2;
    impactLabel.y = mapy(0) - 20;
    app.stage.addChild(impactLabel);

  }, [path, range, apex, bounds, trails]);

  // Atualizar trilhas
  useEffect(() => {
    if (lastPath.current && lastPath.current !== JSON.stringify(path)) {
      // Criar nova trilha
      const { xmin, xmax, ymin, ymax } = bounds;
      const mapx = (x: number) => mapX(x, xmin, xmax);
      const mapy = (y: number) => mapY(y, ymin, ymax);
      
      const trail = new Graphics();
      trail.lineStyle(2, 0x999999, 0.5);
      if (path.length > 1) {
        trail.moveTo(mapx(path[0][0]), mapy(path[0][1]));
        for (let i = 1; i < path.length; i++) {
          trail.lineTo(mapx(path[i][0]), mapy(path[i][1]));
        }
      }
      
      setTrails(prev => [trail, ...prev].slice(0, 2));
    }
    lastPath.current = JSON.stringify(path);
  }, [path, bounds]);

  return (
    <div className="border rounded overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
}
