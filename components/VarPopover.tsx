'use client';
import { useState, useRef, useEffect } from 'react';
import type { VariableMeta } from '@/lib/types/variable';
import { useFormulaStore } from '@/lib/state/store';
import { askTutor, askTutorWithContext } from '@/lib/ai/client';

type Props = {
  meta: VariableMeta;
  value: number;
  onChange: (value: number) => void;
  isVisible: boolean;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onAskTutor?: (message: string) => void;
};

export default function VarPopover({ 
  meta, 
  value, 
  onChange, 
  isVisible, 
  position,
  onClose 
}: Props) {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [isAskingTutor, setIsAskingTutor] = useState(false);
  const { vars, formulaMeta, setMessages, messages } = useFormulaStore();
  const hasAskedInsight = useRef(false);

  // Carrega insight da IA quando o popover fica visível
  useEffect(() => {
    if (isVisible && !hasAskedInsight.current && meta.aiContext && formulaMeta) {
      hasAskedInsight.current = true;
      loadAIInsight();
    }
  }, [isVisible]);

  const loadAIInsight = async () => {
    if (!meta.aiContext || !formulaMeta) return;
    
    setIsLoadingInsight(true);
    try {
      // Cria uma mensagem contextual para a IA
      const contextMessage = {
        role: 'system' as const,
        content: `Você é um tutor especializado em matemática e ciências. 
        
        Fórmula atual: ${formulaMeta.title}
        Descrição: ${formulaMeta.description}
        
        Variável foco: ${meta.name} (${meta.label})
        Valor atual: ${value}
        Valor padrão: ${meta.defaultValue}
        Descrição: ${meta.description}
        Contexto adicional: ${meta.contextualInfo || ''}
        Contexto para IA: ${meta.aiContext}
        
        Forneça uma explicação concisa (máximo 2 frases) sobre como esta variável afeta a fórmula atual, 
        considerando o seu valor atual em relação ao padrão. Se o valor atual for muito diferente do padrão,
        comente sobre isso.`
      };

      const response = await askTutor([contextMessage]);
      setAiInsight(response.content);
    } catch (error) {
      console.error('Erro ao carregar insight da IA:', error);
      setAiInsight('Não foi possível carregar a análise da IA no momento.');
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handleReset = () => {
    onChange(meta.defaultValue);
  };

  const handleAskTutor = async () => {
    if (!formulaMeta) return;
    
    setIsAskingTutor(true);
    try {
      const response = await askTutorWithContext(meta.id, {
        label: meta.name,
        desc: meta.description,
        unit: meta.units
      });
      
      // Adiciona a pergunta e resposta ao painel de chat
      const userMessage = { role: 'user' as const, content: `Explique ${meta.name} e como ela afeta a fórmula.` };
      const assistantMessage = { role: 'assistant' as const, content: response.content };
      
      setMessages([...messages, userMessage, assistantMessage]);
      
      // Fecha o popover após perguntar
      onClose();
    } catch (error) {
      console.error('Erro ao perguntar ao tutor:', error);
    } finally {
      setIsAskingTutor(false);
    }
  };

  const hasChanged = Math.abs(value - meta.defaultValue) > 0.001;

  // Componentes de ícones SVG
  const SparkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );

  const LoadingIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin text-gray-400">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
  );

  const ResetIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
    </svg>
  );

  if (!isVisible || !position) return null;

  // Calcula a posição do popover para evitar que saia da tela
  const popoverWidth = 320;
  const popoverHeight = 280;
  const margin = 10;

  let left = position.x;
  let top = position.y;

  // Ajusta horizontalmente se necessário
  if (left + popoverWidth > window.innerWidth - margin) {
    left = window.innerWidth - popoverWidth - margin;
  }
  if (left < margin) {
    left = margin;
  }

  // Ajusta verticalmente se necessário
  if (top + popoverHeight > window.innerHeight - margin) {
    top = position.y - popoverHeight - 10; // Posiciona acima do elemento
  }
  if (top < margin) {
    top = margin;
  }

  return (
    <div
      className="fixed z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        maxHeight: `${window.innerHeight - 40}px`,
        overflowY: 'auto'
      }}
      role="dialog"
      aria-labelledby={`var-popover-title-${meta.id}`}
      aria-describedby={`var-popover-desc-${meta.id}`}
      aria-modal="true"
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: meta.color || '#3b82f6' }}
            aria-hidden="true"
          />
          <h3 id={`var-popover-title-${meta.id}`} className="font-semibold text-gray-900">{meta.name}</h3>
          <span className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">
            {meta.label}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      {/* Descrição */}
      <p id={`var-popover-desc-${meta.id}`} className="text-sm text-gray-600 mb-3">
        {meta.description}
      </p>

      {/* Informações contextuais */}
      {meta.contextualInfo && (
        <div className="mb-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
          <span className="font-medium">Contexto:</span> {meta.contextualInfo}
        </div>
      )}

      {/* Valor atual e controles */}
      <div className="bg-gray-50 rounded p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Valor atual:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg">
              {value.toFixed(meta.decimals ?? 2)}
              {meta.units && <span className="text-sm ml-1">{meta.units}</span>}
            </span>
            {hasChanged && (
              <button
                onClick={handleReset}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Redefinir para valor padrão"
              >
                <ResetIcon />
              </button>
            )}
          </div>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div>Padrão: {meta.defaultValue.toFixed(meta.decimals ?? 2)}</div>
          <div>Intervalo: [{meta.min}, {meta.max}]</div>
          <div>Passo: {meta.step}</div>
        </div>
      </div>

      {/* Insight da IA */}
      <div className="border-t border-gray-200 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <SparkIcon />
          <span className="text-sm font-medium text-gray-700">Análise da IA</span>
          {isLoadingInsight && (
            <LoadingIcon />
          )}
        </div>
        
        {aiInsight ? (
          <p className="text-sm text-gray-600 leading-relaxed">
            {aiInsight}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            {isLoadingInsight ? 'Analisando variável...' : 'Insight não disponível'}
          </p>
        )}
      </div>

      {/* Botão Ask Tutor */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <button
          onClick={handleAskTutor}
          disabled={isAskingTutor}
          className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAskingTutor ? (
            <>
              <LoadingIcon />
              <span>Perguntando...</span>
            </>
          ) : (
            <>
              <SparkIcon />
              <span>Perguntar ao Tutor</span>
            </>
          )}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          O tutor irá explicar esta variável e pode sugerir cenários.
        </p>
      </div>

      {/* Dicas da IA */}
      {meta.aiHints && meta.aiHints.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Dicas:</div>
          <ul className="text-xs text-gray-600 space-y-1">
            {meta.aiHints.map((hint, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instruções de interação */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Arraste para ajustar o valor</div>
          <div>• Shift+arraste: ajuste rápido (10x)</div>
          <div>• Alt+arraste: ajuste fino (0.1x)</div>
          <div>• Duplo clique: editar valor</div>
        </div>
      </div>
    </div>
  );
}