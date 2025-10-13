import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-white/30 bg-white/80 p-10 text-center text-zinc-900 shadow-lg backdrop-blur-xl">
        <h2 className="text-3xl font-semibold text-rose-600">We lost that page</h2>
        <p className="mt-4 text-sm text-zinc-600">
          The link you followed might be broken or the page may have been removed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-rose-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-rose-500"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
