'use client';
import { useEffect, useRef, useState } from 'react';
import NumberChip from '@/components/NumberChip';
import CanvasSine from '@/components/CanvasSine';
import ControlsSine from '@/components/ControlsSine';
import { useFormulaStore } from '@/lib/state/store';

const BASE_FREQUENCY = 220;

export default function SineView() {
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
      } catch (err) {
        console.error(err);
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
      const Ctor = typeof window !== 'undefined'
        ? (window.AudioContext || (window as any).webkitAudioContext)
        : undefined;
      if (!Ctor) {
        setAudioHint('Audio API unavailable in this browser.');
        return;
      }

      const ctx = audioCtxRef.current && audioCtxRef.current.state !== 'closed'
        ? audioCtxRef.current
        : new Ctor();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      const gain = ctx.createGain();
      const osc = ctx.createOscillator();
      gain.gain.value = Math.min(0.9, Math.max(0, Math.abs(vars.A ?? 1) / 10));
      osc.type = 'sine';
      osc.frequency.value = BASE_FREQUENCY * Math.max(0.1, Math.abs(vars.omega ?? 1));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainRef.current = gain;
      audioCtxRef.current = ctx;
      setAudioOn(true);
      setAudioHint(null);
    } catch (err) {
      console.error(err);
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
    const ctx = audioCtxRef.current;
    if (!audioOn || !ctx) return;
    const osc = oscillatorRef.current;
    const gain = gainRef.current;
    if (osc) {
      const freq = BASE_FREQUENCY * Math.max(0.1, Math.abs(vars.omega ?? 1));
      osc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.05);
    }
    if (gain) {
      const amp = Math.min(0.9, Math.max(0, Math.abs(vars.A ?? 1) / 10));
      gain.gain.setTargetAtTime(amp, ctx.currentTime, 0.05);
    }
  }, [audioOn, vars.A, vars.omega]);

  const handleToggleAudio = () => {
    if (audioOn) {
      stopAudio();
    } else {
      void startAudio();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-lg flex flex-wrap items-center gap-2">
        x(t) =
        <NumberChip
          value={vars.A ?? 1}
          onChange={v => setVar('A', v)}
          label="A"
          min={0}
          max={10}
          step={0.1}
        />
        cos(
        <NumberChip
          value={vars.omega ?? 1}
          onChange={v => setVar('omega', v)}
          label="ω"
          min={0.1}
          max={10}
          step={0.1}
        />
        · t +
        <NumberChip
          value={vars.phi ?? 0}
          onChange={v => setVar('phi', v)}
          label="φ"
          min={-Math.PI}
          max={Math.PI}
          step={0.1}
        />
        )
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <button
          type="button"
          onClick={handleToggleAudio}
          className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 transition"
        >
          {audioOn ? 'Stop tone' : 'Play tone'}
        </button>
        {audioHint && <span className="text-amber-600">{audioHint}</span>}
      </div>
      <CanvasSine />
      <ControlsSine />
    </div>
  );
}
