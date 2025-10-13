'use client';
import { useFormulaStore } from '@/lib/state/store';
import type { VariableMeta } from '@/lib/types/variable';
import { useEffect, useState } from 'react';

type Props = {
  className?: string;
};

export default function VariableInfoPanel({ className }: Props) {
  const { hoveredVar, formulaMeta } = useFormulaStore();
  const [position, setPosition] = useState({ bottom: 16, right: 16 });
  
  useEffect(() => {
    const updatePosition = () => {
      const panelWidth = 448; // w-[28rem] = 28rem = 448px
      const panelHeight = 300; // Reduced height
      const margin = 16;
      
      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate optimal position to avoid clipping
      let newBottom = margin;
      let newRight = margin;
      
      // If there's enough space on the right, keep it there
      if (viewportWidth - panelWidth > margin * 2) {
        newRight = margin;
      } else {
        // Otherwise position it on the left
        newRight = viewportWidth - panelWidth - margin;
      }
      
      // If there's enough space at the bottom, keep it there
      if (viewportHeight - panelHeight > margin * 2) {
        newBottom = margin;
      } else {
        // Otherwise position it at the top
        newBottom = viewportHeight - panelHeight - margin;
      }
      
      setPosition({ bottom: newBottom, right: newRight });
    };
    
    if (hoveredVar) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [hoveredVar]);
  
  if (!hoveredVar || !formulaMeta) {
    return null;
  }
  
  const varMeta: VariableMeta | undefined = formulaMeta.variables[hoveredVar];
  
  if (!varMeta) {
    return null;
  }
  
  return (
    <div
      className={`fixed w-[28rem] max-w-2xl bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 ${className || ''}`}
      style={{
        bottom: `${position.bottom}px`,
        right: `${position.right}px`,
        maxHeight: '60vh',
        overflowY: 'auto'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <span 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: varMeta.color || '#3b82f6' }}
          />
          {varMeta.name}
        </h3>
        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
          {varMeta.label}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        {varMeta.description}
      </p>
      
      {varMeta.contextualInfo && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
          <span className="font-medium">Context:</span> {varMeta.contextualInfo}
        </div>
      )}
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Default value:</span>
          <span className="font-mono">{varMeta.defaultValue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Range:</span>
          <span className="font-mono">[{varMeta.min}, {varMeta.max}]</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Step:</span>
          <span className="font-mono">{varMeta.step}</span>
        </div>
        {varMeta.units && (
          <div className="flex justify-between">
            <span className="text-gray-500">Units:</span>
            <span className="font-mono">{varMeta.units}</span>
          </div>
        )}
      </div>
      
      {varMeta.aiHints && varMeta.aiHints.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-1">Tips:</div>
          <ul className="text-xs text-gray-600 space-y-1">
            {varMeta.aiHints.slice(0, 2).map((hint, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}