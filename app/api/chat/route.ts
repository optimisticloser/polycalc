import { openai } from '@ai-sdk/openai';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { getFormulaContext } from '@/lib/ai/get-formula-context';
import { getFormulaMeta } from '@/modules/registry-meta';

// Configuração do modelo
const model = openai('gpt-4o');

export async function POST(req: Request) {
  try {
    // Debug: verificar variáveis de ambiente
    console.log('API Key:', process.env.PRIMARY_API_KEY ? 'Presente' : 'Ausente');
    console.log('Model:', 'gpt-4o');
    console.log('Base URL:', process.env.PRIMARY_BASE_URL);
    
    const { messages, formulaId } = await req.json();
    
    console.log('FormulaId recebido:', formulaId);
    console.log('Messages recebidos:', messages);
    
    // Verificar se messages é um array válido
    if (!Array.isArray(messages)) {
      console.error('Messages não é um array:', messages);
      return new Response('Messages deve ser um array', { status: 400 });
    }
    
    // Obter contexto específico da fórmula
    const context = getFormulaContext(formulaId || 'quadratic');
    const formulaMeta = getFormulaMeta(formulaId || 'quadratic');
    
    console.log('Contexto obtido:', context.formulaId);
    console.log('Meta obtida:', formulaMeta?.title);

    // Determinar variáveis permitidas para esta fórmula (ex.: ['V','T','n'] para ideal-gas)
    const allowedVariableKeys = Object.keys(
      (formulaMeta?.defaults as Record<string, unknown>) ||
      {}
    );

    // Construir schemas de tools com validação por fórmula
    const setVariableSchema = z.object({
      name: (allowedVariableKeys.length > 0
        ? z.enum(allowedVariableKeys as [string, ...string[]])
        : z.string()
      ).describe('Nome da variável (permitidas: ' + (allowedVariableKeys.join(', ') || '—') + ')'),
      value: z.number().describe('Novo valor da variável'),
    });

    const setManySchema = z.object({
      patch: (allowedVariableKeys.length > 0
        ? z.record(z.enum(allowedVariableKeys as [string, ...string[]]), z.number())
        : z.record(z.string(), z.number())
      ).describe('Objeto com variáveis e valores (apenas: ' + (allowedVariableKeys.join(', ') || '—') + ')'),
    });

    const result = await streamText({
      model,
      system: context.systemPrompt,
      messages: convertToModelMessages(messages),
      tools: {
        setVariable: tool({
          description: `Define o valor de uma variável específica na fórmula (permitidas: ${allowedVariableKeys.join(', ') || '—'})`,
          inputSchema: setVariableSchema,
        }),
        setMany: tool({
          description: `Define múltiplas variáveis de uma vez (apenas chaves: ${allowedVariableKeys.join(', ') || '—'})`,
          inputSchema: setManySchema,
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Erro no chat:', error);
    return new Response('Erro interno do servidor', { status: 500 });
  }
}
