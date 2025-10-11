'use client';
import { create } from 'zustand';

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
};

export const useFormulaStore = create<FormulaState>((set) => ({
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
}));
