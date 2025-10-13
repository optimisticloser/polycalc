'use client';

import { useEffect, useRef, useState } from 'react';
import NumberChip from '@/components/NumberChip';
import CanvasFourier from '@/components/CanvasFourier';
import ControlsFourier from '@/components/ControlsFourier';
import FormulaLine from '@/components/FormulaLine';
import { useFormulaStore } from '@/lib/state/store';

const BASE_FREQUENCY = 180;

export default function FourierView() {
  const { vars, setVar } = useFormulaStore();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [audioOn, setAudioOn] = useState(false);
  const [audioHint, setAudioHint] = useState<string | null>(null);

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch {
        // ignore stop errors
      }
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainRef.current) {
      gainRef.current.disconnect();
      gainRef.current = null;
    }
    setAudioOn(false);
  };

  const startAudio = async () => {
    try {
      const Ctor =
        typeof window !== 'undefined'
          ? (window.AudioContext || (window as any).webkitAudioContext)
          : undefined;
      if (!Ctor) {
        setAudioHint('Audio API unavailable in this browser.');
        return;
      }
      const ctx =
        audioCtxRef.current && audioCtxRef.current.state !== 'closed'
          ? audioCtxRef.current
          : new Ctor();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      const gain = ctx.createGain();
      const osc = ctx.createOscillator();
      gain.gain.value = 0.15;
      osc.type = 'square';
      const base = Math.max(1, vars.f0 ?? 1);
      osc.frequency.value = BASE_FREQUENCY * base;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorRef.current = osc;
      gainRef.current = gain;
      audioCtxRef.current = ctx;
      setAudioOn(true);
      setAudioHint(null);
    } catch (err) {
      console.error('Audio start failed', err);
      setAudioHint('Audio blocked. Interact with the page and try again.');
      stopAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
      const ctx = audioCtxRef.current;
      if (ctx) {
        ctx.close().catch(() => undefined);
      }
    };
  }, []);

  useEffect(() => {
    if (!audioOn) return;
    const ctx = audioCtxRef.current;
    const osc = oscillatorRef.current;
    if (!ctx || !osc) return;
    const base = Math.max(1, vars.f0 ?? 1);
    osc.frequency.setTargetAtTime(BASE_FREQUENCY * base, ctx.currentTime, 0.05);
  }, [audioOn, vars.f0]);

  const handleToggleAudio = () => {
    if (audioOn) {
      stopAudio();
    } else {
      void startAudio();
    }
  };

  const N = Math.round(vars.N ?? 1);
  const f0 = vars.f0 ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-lg">
        N =
        <NumberChip
          value={N}
          onChange={(v) => setVar('N', Math.round(v))}
          label="N"
          step={1}
          min={1}
          max={25}
          decimals={0}
        />
        f₀ =
        <NumberChip
          value={f0}
          onChange={(v) => setVar('f0', v)}
          label="f0"
          min={1}
          max={5}
          step={0.1}
        />
      </div>
      <FormulaLine className="text-base text-zinc-700" />
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <button
          type="button"
          onClick={handleToggleAudio}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 transition hover:bg-slate-100"
        >
          {audioOn ? 'Stop tone' : 'Play square tone'}
        </button>
        {audioHint && <span className="text-amber-600">{audioHint}</span>}
      </div>
      <CanvasFourier />
      <p className="text-sm text-zinc-600">
        Increase N to see the square wave emerge and notice the persistent Gibbs overshoot near jumps.
      </p>
      <ControlsFourier />
    </div>
  );
}
