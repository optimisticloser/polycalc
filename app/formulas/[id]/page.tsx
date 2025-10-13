import FormulaClient from './Client';
import { Suspense } from 'react';
import { ids } from '@/modules/registry';
import { resolveFormulaId } from '@/modules/registry-meta';

export function generateStaticParams() {
  return ids.map(id => ({ id }));
}

export const dynamicParams = false;

export default function FormulaPage({ params }: any) {
  const formulaId = resolveFormulaId(params.id);
  return (
    <Suspense fallback={null}>
      <FormulaClient id={formulaId} />
    </Suspense>
  );
}
