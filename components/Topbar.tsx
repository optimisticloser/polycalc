import Link from 'next/link';

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-2xl border border-white/30 bg-white/70 px-4 py-3 text-zinc-900 shadow-md backdrop-blur-xl">
          <Link href="/" className="text-lg font-semibold tracking-tight hover:text-rose-600">
            Polycalc
          </Link>
          <a
            href="https://github.com/sergio/Polycalc/blob/main/docs/credits.md"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-rose-600 hover:text-rose-700 hover:underline"
          >
            Credits &amp; Inspirations
          </a>
        </div>
      </div>
    </header>
  );
}
