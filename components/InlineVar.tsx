'use client';
import { useRef, useState, useCallback } from 'react';
import clsx from 'clsx';
import type { VariableMeta } from '@/lib/types/variable';

type Props = {
  meta: VariableMeta;
  value: number;
  onChange: (v: number) => void;
  className?: string;
  showTooltip?: boolean;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

export default function InlineVar({
  meta,
  value,
  onChange,
  className,
  showTooltip = true,
  onPointerEnter,
  onPointerLeave
}: Props) {
  const startX = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const commit = useCallback((newValue: number) => {
    const clampedValue = Math.max(meta.min, Math.min(meta.max, newValue));
    onChange(clampedValue);
  }, [meta.min, meta.max, onChange]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!meta.editable) return;
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    setIsDragging(true);
    e.preventDefault();
  }, [meta.editable]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (startX.current === null || !isDragging || !meta.editable) return;
    
    const dx = e.clientX - startX.current;
    const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    const delta = dx * meta.step * mult;
    commit(value + delta);
    startX.current = e.clientX;
  }, [isDragging, value, meta.step, meta.editable, commit]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    startX.current = null;
    setIsDragging(false);
  }, []);

  const onDoubleClick = useCallback(() => {
    if (!meta.editable) return;
    
    const newValue = prompt(
      `Definir valor para ${meta.name} (${meta.label})`,
      value.toString()
    );
    
    if (newValue !== null) {
      const parsed = parseFloat(newValue);
      if (!isNaN(parsed)) {
        commit(parsed);
      }
    }
  }, [meta, value, commit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!meta.editable) return;
    
    const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    const step = meta.step * mult;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        commit(value + step);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        commit(value - step);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onDoubleClick();
        break;
    }
  }, [meta.editable, meta.step, value, commit, onDoubleClick]);

  const formatValue = (val: number): string => {
    const decimals = meta.decimals ?? 2;
    if (meta.format === 'percentage') {
      return `${(val * 100).toFixed(decimals)}%`;
    }
    if (meta.format === 'angle') {
      return `${(val * 180 / Math.PI).toFixed(decimals)}°`;
    }
    return val.toFixed(decimals);
  };

  const displayValue = formatValue(value);
  const hasChanged = Math.abs(value - meta.defaultValue) > 0.001;

  return (
    <span className="relative inline-block">
      <span
        className={clsx(
          'inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer select-none',
          meta.editable ? 'hover:bg-opacity-80 hover:scale-105' : 'cursor-default',
          isDragging ? 'bg-opacity-90 scale-105 shadow-lg' : 'bg-opacity-70',
          meta.color ? `bg-[${meta.color}] bg-opacity-20` : 'bg-blue-100',
          meta.color ? `border-[${meta.color}]` : 'border-blue-300',
          hasChanged ? 'border-2' : 'border border-dashed',
          className
        )}
        style={{
          backgroundColor: meta.color ? `${meta.color}20` : undefined,
          borderColor: meta.color ? meta.color : undefined,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerEnter={() => {
          setIsHovered(true);
          onPointerEnter?.();
        }}
        onPointerLeave={() => {
          setIsHovered(false);
          onPointerLeave?.();
        }}
        onDoubleClick={onDoubleClick}
        onKeyDown={handleKeyDown}
        tabIndex={meta.editable ? 0 : -1}
        role={meta.editable ? "spinbutton" : "text"}
        aria-label={meta.name}
        aria-valuemin={meta.min}
        aria-valuemax={meta.max}
        aria-valuenow={value}
        aria-description={meta.description}
      >
        <span className="font-mono">
          {displayValue}
        </span>
        {meta.units && (
          <span className="ml-1 text-xs opacity-70">
            {meta.units}
          </span>
        )}
        {meta.editable && (
          <span className={clsx(
            'ml-1 text-xs opacity-0 transition-opacity',
            (isHovered || isDragging) && 'opacity-60'
          )}>
            {isDragging ? '✋' : '👆'}
          </span>
        )}
      </span>
      
      {showTooltip && isHovered && !isDragging && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl max-w-xs">
          <div className="font-semibold text-white mb-1">
            {meta.name} ({meta.label})
          </div>
          <div className="text-gray-300 text-xs mb-2">
            {meta.description}
          </div>
          {meta.contextualInfo && (
            <div className="text-gray-400 text-xs italic">
              {meta.contextualInfo}
            </div>
          )}
          {meta.editable && (
            <div className="text-gray-400 text-xs mt-2 pt-2 border-t border-gray-700">
              <div>Dica: Arraste para ajustar, clique duas vezes para editar</div>
              <div>Shift+arraste: 10x | Alt+arraste: 0.1x</div>
              <div>Setas: ajuste fino | Enter/Space: editar</div>
            </div>
          )}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </span>
  );
}