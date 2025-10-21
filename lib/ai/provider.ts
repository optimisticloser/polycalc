import { openai, createOpenAI } from '@ai-sdk/openai';

// Configuração do provider de IA
export const aiProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.PRIMARY_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || process.env.PRIMARY_BASE_URL,
});

// Configuração do modelo
export const chatModel = aiProvider('gpt-4o-mini');

// Cliente OpenAI para uso direto
export const openaiClient = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.PRIMARY_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || process.env.PRIMARY_BASE_URL,
});
