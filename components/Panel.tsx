import type { HTMLAttributes } from 'react';

type PanelProps = HTMLAttributes<HTMLDivElement>;

export default function Panel({ className = '', ...props }: PanelProps) {
  const base =
    'flex flex-col rounded-2xl border border-white/30 bg-white/70 text-zinc-900 shadow-lg backdrop-blur-xl';
  const merged = className ? `${base} ${className}` : base;
  return <div className={merged} {...props} />;
}
