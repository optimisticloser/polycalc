'use client';
import { useEffect } from 'react';
import { useFormulaStore } from '@/lib/state/store';
import { getFormulaMeta as getRegistryFormulaMeta } from '@/modules/registry-meta';

export function useFormulaMeta(formulaId: string) {
  const { setFormulaMeta, formulaMeta } = useFormulaStore();
  
  useEffect(() => {
    const registryMeta = getRegistryFormulaMeta(formulaId);
    if (registryMeta?.detailedMeta) {
      setFormulaMeta(registryMeta.detailedMeta);
    }
  }, [formulaId, setFormulaMeta]);
  
  return formulaMeta;
}

export function useVariableMeta(varId: string) {
  const { formulaMeta } = useFormulaStore();
  
  if (!formulaMeta || !formulaMeta.variables[varId]) {
    return null;
  }
  
  return formulaMeta.variables[varId];
}