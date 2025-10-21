import { formulaContexts } from './formula-contexts';
import { getFormulaMeta } from '@/modules/registry-meta';

export function getFormulaContext(formulaId: string) {
  console.log('Buscando contexto para:', formulaId);
  const context = formulaContexts[formulaId];
  const meta = getFormulaMeta(formulaId);
  
  console.log('Contexto encontrado:', !!context);
  console.log('Meta encontrada:', !!meta);
  
  if (!context) {
    console.log('Contexto não encontrado, usando fallback');
    // Fallback para fórmula não encontrada
    return {
      formulaId: 'unknown',
      systemPrompt: `Você é um tutor de matemática e física. Responda sempre em português brasileiro de forma didática e clara.`,
      concept: 'Fórmula não reconhecida',
      typicalQuestions: ['Como posso ajudar com esta fórmula?'],
      tools: { setVariable: true, setMany: true }
    };
  }
  
  // Enriquecer system prompt com variáveis atuais
  const enrichedPrompt = `${context.systemPrompt}

Fórmula: ${meta?.title || formulaId}
Descrição: ${meta?.detailedMeta?.description || 'N/A'}

Variáveis disponíveis:
${Object.entries(meta?.defaults || {})
  .map(([key, v]) => `- ${key}: valor padrão ${v}`)
  .join('\n')}

Exemplos de perguntas que estudantes fazem:
${context.typicalQuestions.map(q => `- ${q}`).join('\n')}
`;

  return {
    ...context,
    systemPrompt: enrichedPrompt
  };
}
