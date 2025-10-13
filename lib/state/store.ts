'use client';
import { create } from 'zustand';
import type { FormulaMeta } from '@/lib/types/variable';

export type Vars = Record<string, number>;
export type Message = { role: 'user'|'assistant'|'system'; content: string };

type FormulaState = {
  formulaId: string;
  vars: Vars;
  setVar: (k: string, v: number) => void;
  setMany: (patch: Vars) => void;
  setFormula: (id: string, initial: Vars) => void;
  step: number;
  setStep: (i: number) => void;
  actions: string[];
  pushAction: (s: string) => void;
  messages: Message[];
  setMessages: (m: Message[]) => void;
  
  // Estado para controle de variáveis com metadados
  formulaMeta: FormulaMeta | null;
  setFormulaMeta: (meta: FormulaMeta) => void;
  hoveredVar: string | null;
  setHoveredVar: (varId: string | null) => void;
  selectedVar: string | null;
  setSelectedVar: (varId: string | null) => void;
  resetVar: (varId: string) => void;
  resetAllVars: () => void;
  
  // Estado para controle do modo explodido
  explodedMode: boolean;
  setExplodedMode: (enabled: boolean) => void;
};

export const useFormulaStore = create<FormulaState>((set, get) => ({
  formulaId: 'quadratic',
  vars: { a: 1, b: 0, c: 0 },
  setVar: (k, v) => set((s) => ({ vars: { ...s.vars, [k]: v } })),
  setMany: (patch) => set((s) => ({ vars: { ...s.vars, ...patch } })),
  setFormula: (id, initial) => set({ formulaId: id, vars: initial }),
  step: 0,
  setStep: (i) => set({ step: i }),
  actions: [],
  pushAction: (s) => set((st) => ({ actions: [s, ...st.actions].slice(0, 20) })),
  messages: [{ role: 'assistant', content: 'Ask me anything about the current formula.' }],
  setMessages: (m) => set({ messages: m }),
  
  // Novo estado para controle de variáveis
  formulaMeta: null,
  setFormulaMeta: (meta) => set({ formulaMeta: meta }),
  hoveredVar: null,
  setHoveredVar: (varId) => set({ hoveredVar: varId }),
  selectedVar: null,
  setSelectedVar: (varId) => set({ selectedVar: varId }),
  resetVar: (varId) => {
    const { formulaMeta, setVar } = get();
    if (formulaMeta?.variables[varId]) {
      setVar(varId, formulaMeta.variables[varId].defaultValue);
    }
  },
  resetAllVars: () => {
    const { formulaMeta, setMany } = get();
    if (formulaMeta) {
      const defaultValues: Vars = {};
      Object.entries(formulaMeta.variables).forEach(([key, meta]) => {
        defaultValues[key] = meta.defaultValue;
      });
      setMany(defaultValues);
    }
  },
  
  // Estado para controle do modo explodido
  explodedMode: false,
  setExplodedMode: (enabled) => set({ explodedMode: enabled }),
}));
