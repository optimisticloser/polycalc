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
  simplified?: boolean; // Se true, usa o modelo simplificado sem LaTeX
};

export default function InteractiveFormula({ 
  meta, 
  vars, 
  onVarChange, 
  className,
  simplified = false
}: Props) {
  const { vars: storeVars, setVar, hoveredVar, setHoveredVar } = useFormulaStore();
  
  // Usa as variáveis passadas como props ou do store
  const currentVars = vars || storeVars;
  
  // Renderiza a fórmula com variáveis interativas
  const renderFormula = useMemo(() => {
    if (simplified) {
      // Modo simplificado sem renderização LaTeX
      return renderSimpleFormula(meta, currentVars, onVarChange || setVar, setHoveredVar);
    }
    
    // Modo completo com LaTeX (será implementado depois)
    return renderSimpleFormula(meta, currentVars, onVarChange || setVar, setHoveredVar);
  }, [meta, currentVars, onVarChange, setVar, setHoveredVar, simplified]);
  
  return (
    <div className={`formula-container ${className || ''}`}>
      {renderFormula}
    </div>
  );
}

// Função para renderizar fórmula simplificada (sem LaTeX)
function renderSimpleFormula(
  meta: FormulaMeta,
  vars: Record<string, number>,
  onVarChange: (varId: string, value: number) => void,
  onHoverVar: (varId: string | null) => void
) {
  // Substitui os placeholders {{varId}} pelos componentes InlineVar
  let formula = meta.template;
  
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
  
  return (
    <div className="text-lg font-medium">
      {parts.length > 0 ? parts : formula}
    </div>
  );
}

// Componente simplificado para renderizar uma única variável
type SingleVarProps = {
  varId: string;
  meta: FormulaMeta;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
};

export function InteractiveVariable({ 
  varId, 
  meta, 
  value, 
  onChange, 
  className 
}: SingleVarProps) {
  const { vars: storeVars, setVar, setHoveredVar } = useFormulaStore();
  
  if (!meta.variables[varId]) {
    return null;
  }
  
  const varMeta = meta.variables[varId];
  const currentValue = value ?? storeVars[varId] ?? varMeta.defaultValue;
  
  return (
    <InlineVar
      meta={varMeta}
      value={currentValue}
      onChange={onChange || ((v) => setVar(varId, v))}
      onPointerEnter={() => setHoveredVar(varId)}
      onPointerLeave={() => setHoveredVar(null)}
      className={className}
    />
  );
}