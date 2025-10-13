'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormulaStore } from '@/lib/state/store';

const WIDTH = 700;
const HEIGHT = 360;
const PAD_X = 60;
const AXIS_Y = 210;
const R_MIN = 1;
const R_MAX = 100;
const MASS_MIN = 1;
const MASS_MAX = 100;
const G = 6.674;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function CanvasGravity() {
  const { vars } = useFormulaStore();
  const setVar = useFormulaStore((s) => s.setVar);

  const m1 = clamp(vars.m1 ?? 10, MASS_MIN, MASS_MAX);
  const m2 = clamp(vars.m2 ?? 10, MASS_MIN, MASS_MAX);
  const distance = clamp(vars.r ?? 20, R_MIN, R_MAX);

  const scale = useMemo(() => {
    return (WIDTH - 2 * PAD_X) / R_MAX;
  }, []);

  const halfDistPx = (distance / 2) * scale;
  const centerX = WIDTH / 2;
  const leftX = centerX - halfDistPx;
  const rightX = centerX + halfDistPx;

  const massRadius = (mass: number) => 18 + (mass / MASS_MAX) * 25;

  const force = useMemo(() => {
    return (G * m1 * m2) / (distance * distance);
  }, [m1, m2, distance]);

  const forceArrow = useMemo(() => {
    const maxArrow = 60;
    const minArrow = 12;
    const length = clamp(force * 2, minArrow, maxArrow);
    return length;
  }, [force]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dragging, setDragging] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (event: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const pointerX = clamp(
        event.clientX - rect.left,
        PAD_X,
        WIDTH - PAD_X
      );
      const offset = dragging === 'left' ? centerX - pointerX : pointerX - centerX;
      const newDistance = clamp((Math.abs(offset) * 2) / scale, R_MIN, R_MAX);
      setVar('r', newDistance);
    };
    const handleUp = () => setDragging(null);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [dragging, scale, setVar]);

  return (
    <svg
      ref={svgRef}
      width={WIDTH}
      height={HEIGHT}
      className="border rounded bg-white"
    >
      <defs>
        <marker
          id="force-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
        </marker>
      </defs>

      {/* axis */}
      <line
        x1={PAD_X / 2}
        y1={AXIS_Y}
        x2={WIDTH - PAD_X / 2}
        y2={AXIS_Y}
        stroke="#e2e8f0"
        strokeWidth={2}
      />

      {/* distance ruler */}
      <line
        x1={leftX}
        y1={AXIS_Y - 40}
        x2={rightX}
        y2={AXIS_Y - 40}
        stroke="#94a3b8"
        strokeDasharray="6 4"
      />
      <line
        x1={leftX}
        y1={AXIS_Y - 45}
        x2={leftX}
        y2={AXIS_Y - 35}
        stroke="#94a3b8"
      />
      <line
        x1={rightX}
        y1={AXIS_Y - 45}
        x2={rightX}
        y2={AXIS_Y - 35}
        stroke="#94a3b8"
      />
      <text
        x={(leftX + rightX) / 2}
        y={AXIS_Y - 48}
        textAnchor="middle"
        fontSize={12}
        fill="#1e293b"
      >
        r = {distance.toFixed(1)}
      </text>

      {/* masses */}
      <circle
        cx={leftX}
        cy={AXIS_Y}
        r={massRadius(m1)}
        fill="#2563eb"
        fillOpacity={0.8}
        stroke="#1d4ed8"
        onPointerDown={(event) => {
          event.preventDefault();
          setDragging('left');
        }}
        style={{ cursor: 'ew-resize' }}
      />
      <circle
        cx={rightX}
        cy={AXIS_Y}
        r={massRadius(m2)}
        fill="#f97316"
        fillOpacity={0.85}
        stroke="#ea580c"
        onPointerDown={(event) => {
          event.preventDefault();
          setDragging('right');
        }}
        style={{ cursor: 'ew-resize' }}
      />

      <text
        x={leftX}
        y={AXIS_Y + massRadius(m1) + 18}
        textAnchor="middle"
        fontSize={12}
        fill="#1d4ed8"
      >
        m1 = {m1.toFixed(1)}
      </text>
      <text
        x={rightX}
        y={AXIS_Y + massRadius(m2) + 18}
        textAnchor="middle"
        fontSize={12}
        fill="#ea580c"
      >
        m2 = {m2.toFixed(1)}
      </text>

      {/* force arrows */}
      <line
        x1={leftX}
        y1={AXIS_Y}
        x2={leftX + forceArrow}
        y2={AXIS_Y}
        stroke="#ef4444"
        strokeWidth={3}
        markerEnd="url(#force-arrow)"
      />
      <line
        x1={rightX}
        y1={AXIS_Y}
        x2={rightX - forceArrow}
        y2={AXIS_Y}
        stroke="#ef4444"
        strokeWidth={3}
        markerEnd="url(#force-arrow)"
      />

      <text
        x={WIDTH - PAD_X}
        y={80}
        textAnchor="end"
        fontSize={14}
        fontWeight={600}
        fill="#ef4444"
      >
        F ≈ {force.toFixed(2)} N
      </text>
      <text
        x={WIDTH - PAD_X}
        y={100}
        textAnchor="end"
        fontSize={12}
        fill="#475569"
      >
        G = 6.674 (scaled)
      </text>
    </svg>
  );
}
