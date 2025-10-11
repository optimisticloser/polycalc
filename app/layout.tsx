import './globals.css';
import type { ReactNode } from 'react';
import { registry } from '@/modules/registry';
import Link from 'next/link';

export const metadata = {
  title: 'Polycalc',
  description: 'Playable math explorer inspired by Kill Math',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-900">
        <div className="grid grid-cols-[260px_1fr_340px] min-h-screen">
          <aside className="border-r border-zinc-200 p-4">
            <h1 className="font-bold text-xl mb-3">Polycalc</h1>
            <nav className="space-y-2 text-sm">
              <Link className="block hover:underline" href="/">Home</Link>
              <div className="mt-4 font-semibold text-zinc-700 uppercase tracking-wide text-xs">Formulas</div>
              {registry.map(f => (
                <Link key={f.id} className="block hover:underline" href={`/formulas/${f.id}`}>{f.title}</Link>
              ))}
            </nav>
            <div className="mt-6 text-xs text-zinc-500">
              Inspired by Bret Victor’s Kill Math
            </div>
          </aside>
          <main>{children}</main>
          <aside className="border-l border-zinc-200">
            {/* Chat panel is injected on formula pages */}
          </aside>
        </div>
      </body>
    </html>
  );
}
