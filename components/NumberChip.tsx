'use client';
import { useRef, useState } from 'react';
import clsx from 'clsx';

type Props = {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  decimals?: number;
  className?: string;
  label?: string;
};

export default function NumberChip({
  value, onChange, step = 0.1, min = -1e9, max = 1e9, decimals = 2, className, label
}: Props) {
  const startX = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [local, setLocal] = useState<string>(value.toFixed(decimals));

  const commit = (v: number) => {
    const nv = Math.max(min, Math.min(max, v));
    onChange(nv);
    setLocal(nv.toFixed(decimals));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    setActive(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null || !active) return;
    const dx = e.clientX - startX.current;
    const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    const delta = dx * step * mult;
    commit(parseFloat(local) + delta);
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    startX.current = null;
    setActive(false);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => setLocal(e.target.value);
  const onBlur = () => {
    const parsed = parseFloat(local);
    if (!Number.isNaN(parsed)) commit(parsed);
    else setLocal(value.toFixed(decimals));
  };

  return (
    <span className={clsx("inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-sm",
      active ? "bg-zinc-100 border-zinc-400" : "bg-white border-zinc-300",
      "scrub select-none", className)}
      role="spinbutton"
      aria-label={label || "number"}
      aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <input
        value={local}
        onChange={onInput}
        onBlur={onBlur}
        className="w-16 bg-transparent outline-none text-right"
        inputMode="decimal"
        aria-label={label || "number input"}
      />
    </span>
  );
}
