'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error boundary triggered', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-white/30 bg-white/80 p-10 text-center text-zinc-900 shadow-lg backdrop-blur-xl">
        <h2 className="text-3xl font-semibold text-rose-600">Something went wrong</h2>
        <p className="mt-4 text-sm text-zinc-600">
          An unexpected error occurred. You can try again or head back to the home page.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white shadow hover:bg-zinc-800"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full bg-rose-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-rose-500"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
