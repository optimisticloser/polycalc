'use client';
import { useFormulaStore } from '@/lib/state/store';

type Props = {
  className?: string;
};

export default function ExplodedModeToggle({ className }: Props) {
  const { explodedMode, setExplodedMode } = useFormulaStore();

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <span className="text-sm text-gray-600">View:</span>
      <button
        onClick={() => setExplodedMode(!explodedMode)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${explodedMode ? 'bg-blue-600' : 'bg-gray-200'}
        `}
        aria-pressed={explodedMode}
        aria-label="Toggle exploded mode"
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${explodedMode ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      <span className="text-sm font-medium">
        {explodedMode ? 'Exploded' : 'Standard'}
      </span>
    </div>
  );
}