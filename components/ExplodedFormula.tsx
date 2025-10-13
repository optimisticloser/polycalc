'use client';
import { useMemo } from 'react';
import type { FormulaMeta } from '@/lib/types/variable';
import InlineVar from './InlineVar';
import { useFormulaStore } from '@/lib/state/store';

type Props = {
  meta: FormulaMeta;
  vars?: Record<string, number>;
  onVarChange?: (varId: string, value: number) => void;
  className?: string;
};

export default function ExplodedFormula({ 
  meta, 
  vars, 
  onVarChange, 
  className 
}: Props) {
  const { vars: storeVars, setVar, setHoveredVar } = useFormulaStore();
  
  // Usa as variáveis passadas como props ou do store
  const currentVars = vars || storeVars;
  
  // Renderiza a fórmula em modo explodido
  const renderExplodedFormula = useMemo(() => {
    return renderExplodedView(meta, currentVars, onVarChange || setVar, setHoveredVar);
  }, [meta, currentVars, onVarChange, setVar, setHoveredVar]);
  
  return (
    <div className={`exploded-formula-container ${className || ''}`}>
      {renderExplodedFormula}
    </div>
  );
}

// Função para renderizar a fórmula em modo explodido
function renderExplodedView(
  meta: FormulaMeta,
  vars: Record<string, number>,
  onVarChange: (varId: string, value: number) => void,
  onHoverVar: (varId: string | null) => void
) {
  // Mapeamento de símbolos LaTeX para display simples
  const symbolMap: Record<string, string> = {
    '\\alpha': 'α',
    '\\beta': 'β',
    '\\gamma': 'γ',
    '\\delta': 'δ',
    '\\begin{cases}': '',
    '\\end{cases}': '',
    '\\frac{dx}{dt}': 'dx/dt',
    '\\frac{dy}{dt}': 'dy/dt',
    'x^2': 'x²',
    'xy': 'x·y',
    '\\\\': '<br/>'
  };
  
  // Substitui símbolos LaTeX
  let formula = meta.template;
  Object.entries(symbolMap).forEach(([latex, simple]) => {
    formula = formula.replace(new RegExp(latex, 'g'), simple);
  });
  
  // Encontra todos os placeholders de variáveis {{varId}}
  const varPattern = /\{\{(\w+)\}\}/g;
  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  let match;
  
  // Extrai as variáveis da fórmula
  const variables: Array<{id: string, meta: any, value: number}> = [];
  
  while ((match = varPattern.exec(formula)) !== null) {
    const varId = match[1];
    if (meta.variables[varId]) {
      variables.push({
        id: varId,
        meta: meta.variables[varId],
        value: vars[varId] ?? meta.variables[varId].defaultValue
      });
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-2">Exploded Mode: Formula Components</div>
      
      {/* Renderiza cada variável como um token separado */}
      <div className="flex flex-wrap gap-3">
        {variables.map((variable) => (
          <div key={variable.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">{variable.meta.name}</div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{variable.meta.label} =</span>
              <InlineVar
                meta={variable.meta}
                value={variable.value}
                onChange={(value) => onVarChange(variable.id, value)}
                onPointerEnter={() => onHoverVar(variable.id)}
                onPointerLeave={() => onHoverVar(null)}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">{variable.meta.description}</div>
          </div>
        ))}
      </div>
      
      {/* Renderiza a fórmula completa com as variáveis interativas */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Complete Formula:</div>
        <div className="text-lg font-medium">
          {renderFormulaWithVars(meta, vars, onVarChange, onHoverVar)}
        </div>
      </div>
    </div>
  );
}

// Função auxiliar para renderizar a fórmula com variáveis interativas
function renderFormulaWithVars(
  meta: FormulaMeta,
  vars: Record<string, number>,
  onVarChange: (varId: string, value: number) => void,
  onHoverVar: (varId: string | null) => void
) {
  // Mapeamento de símbolos LaTeX para display simples
  const symbolMap: Record<string, string> = {
    '\\alpha': 'α',
    '\\beta': 'β',
    '\\gamma': 'γ',
    '\\delta': 'δ',
    '\\begin{cases}': '',
    '\\end{cases}': '',
    '\\frac{dx}{dt}': 'dx/dt',
    '\\frac{dy}{dt}': 'dy/dt',
    'x^2': 'x²',
    'xy': 'x·y',
    '\\\\': '<br/>'
  };
  
  // Substitui símbolos LaTeX
  let formula = meta.template;
  Object.entries(symbolMap).forEach(([latex, simple]) => {
    formula = formula.replace(new RegExp(latex, 'g'), simple);
  });
  
  // Encontra todos os placeholders de variáveis {{varId}}
  const varPattern = /\{\{(\w+)\}\}/g;
  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = varPattern.exec(formula)) !== null) {
    // Adiciona o texto antes do placeholder
    if (match.index > lastIndex) {
      const text = formula.substring(lastIndex, match.index);
      if (text.trim()) {
        parts.push(
          <span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: text }} />
        );
      }
    }
    
    // Adiciona a variável interativa
    const varId = match[1];
    if (meta.variables[varId]) {
      parts.push(
        <InlineVar
          key={`var-${varId}`}
          meta={meta.variables[varId]}
          value={vars[varId] ?? meta.variables[varId].defaultValue}
          onChange={(value) => onVarChange(varId, value)}
          onPointerEnter={() => onHoverVar(varId)}
          onPointerLeave={() => onHoverVar(null)}
        />
      );
    }
    
    lastIndex = varPattern.lastIndex;
  }
  
  // Adiciona o texto restante após o último placeholder
  if (lastIndex < formula.length) {
    const text = formula.substring(lastIndex);
    if (text.trim()) {
      parts.push(
        <span key={`text-${lastIndex}`} dangerouslySetInnerHTML={{ __html: text }} />
      );
    }
  }
  
  return <>{parts}</>;
}