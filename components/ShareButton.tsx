"use client";

import { useCallback, useState } from 'react';

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy URL', error);
    }
  }, []);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleShare}
        className="mt-3 rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Share
      </button>
      {copied && (
        <span className="absolute left-1/2 -translate-x-1/2 translate-y-1.5 rounded bg-black px-2 py-1 text-xs text-white">
          Copied!
        </span>
      )}
    </div>
  );
}
