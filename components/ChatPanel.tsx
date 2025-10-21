'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { useFormulaStore } from '@/lib/state/store';
import { useFormulaMeta } from '@/lib/hooks/useFormulaMeta';
import { lastAssistantMessageIsCompleteWithToolCalls, DefaultChatTransport } from 'ai';
import MarkdownRenderer from './MarkdownRenderer';

export default function ChatPanel() {
  const { formulaId, vars, setVar, setMany, pushAction } = useFormulaStore();
  const formulaMeta = useFormulaMeta(formulaId);
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, status, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { formulaId },
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall: async ({ toolCall }) => {
      console.log('Tool call recebido:', toolCall);
      
      if (toolCall.toolName === 'setVariable') {
        const args = toolCall.input as { name: string; value: number };
        setVar(args.name, args.value);
        pushAction(`Alterou ${args.name} para ${args.value}`);
        
        addToolResult({
          tool: 'setVariable',
          toolCallId: toolCall.toolCallId,
          output: `Variável ${args.name} alterada para ${args.value}`
        });
      }
      
      if (toolCall.toolName === 'setMany') {
        const args = toolCall.input as { patch: Record<string, number> };
        setMany(args.patch);
        const changes = Object.entries(args.patch).map(([k, v]) => `${k}=${v}`).join(', ');
        pushAction(`Aplicou cenário: ${changes}`);
        
        addToolResult({
          tool: 'setMany',
          toolCallId: toolCall.toolCallId,
          output: `Cenário aplicado: ${changes}`
        });
      }
    },
    onError: (error) => {
      console.error('Erro no chat:', error);
    },
  });

  // Scroll automático para baixo quando há novas mensagens ou quando está carregando
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  return (
    <div className="flex flex-col h-full border-l border-zinc-200">
      {/* Header com estilo do projeto */}
      <div className="bg-rose-500 text-white p-4">
        <h3 className="font-semibold text-lg">Tutor de Matemática</h3>
        <p className="text-sm opacity-90 mt-1">
          {formulaMeta?.title || 'Fórmula Atual'}
        </p>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-zinc-500 text-sm">
            <p>Olá! Sou seu tutor de matemática.</p>
            <p className="mt-2">Posso explicar como cada variável afeta a visualização e alterar valores em tempo real.</p>
            <p className="mt-2">O que gostaria de saber sobre esta fórmula?</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-500 text-white max-w-[60%]' 
                : 'bg-gray-100 text-gray-800 w-full max-w-none'
            }`}>
              <div>
                {message.parts.map((part, i) => 
                  part.type === 'text' ? (
                    <MarkdownRenderer 
                      key={i} 
                      content={part.text} 
                      className="text-sm"
                      textColor={message.role === 'user' ? 'text-white' : 'text-gray-700'}
                    />
                  ) : null
                )}
              </div>
              
              {/* Renderizar tool calls se existirem */}
              {message.parts.filter(part => part.type === 'tool-call').map((part: any, i: number) => (
                <div key={i} className="text-xs mt-2 p-2 bg-white/50 rounded border border-gray-300">
                  <div className="flex items-center gap-1">
                    <span>🔧</span>
                    <span>Executando: {part.toolName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {(status === 'submitted' || status === 'streaming') && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Elemento invisível para scroll automático */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-zinc-200 p-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte sobre esta fórmula..."
            className="flex-1 border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            disabled={status !== 'ready'}
          />
          <button
            type="submit"
            disabled={status !== 'ready' || !input.trim()}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
