import FormulaClient from './Client';
import { ids } from '@/modules/registry';
import { resolveFormulaId } from '@/modules/registry-meta';

export function generateStaticParams() {
  return ids.map(id => ({ id }));
}

export const dynamicParams = false;

export default async function FormulaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const formulaId = resolveFormulaId(resolvedParams.id);
  return <FormulaClient id={formulaId} searchParams={resolvedSearchParams} />;
}
