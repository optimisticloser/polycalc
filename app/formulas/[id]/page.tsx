import FormulaClient from './Client';
import { Suspense } from 'react';
import { ids } from '@/modules/registry';
import { resolveFormulaId } from '@/modules/registry-meta';

export function generateStaticParams() {
  return ids.map(id => ({ id }));
}

export const dynamicParams = false;

export default async function FormulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formulaId = resolveFormulaId(id);
  return (
    <Suspense fallback={null}>
      <FormulaClient id={formulaId} />
    </Suspense>
  );
}
