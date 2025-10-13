'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useMemo } from 'react';

type TeXProps = {
  expr: string;
  block?: boolean;
  className?: string;
};

export default function TeX({ expr, block = false, className }: TeXProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(expr, {
        throwOnError: false,
        displayMode: block,
      });
    } catch (error) {
      console.error('Failed to render TeX expression', error, expr);
      return katex.renderToString('\\text{TeX error}', {
        throwOnError: false,
        displayMode: block,
      });
    }
  }, [expr, block]);

  const Tag = block ? 'div' : 'span';

  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
