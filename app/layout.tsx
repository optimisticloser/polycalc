import './globals.css';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Panel from '@/components/Panel';
import Topbar from '@/components/Topbar';
import { registryMeta } from '@/modules/registry-meta';

export const metadata = {
  title: 'Polycalc',
  description: 'Playable math explorer inspired by Kill Math',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const cfAnalyticsToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-screen flex-col text-zinc-900 antialiased">
        <Topbar />
        <div className="flex-1 w-full">
          <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 pt-8 sm:px-6 lg:px-8">
            <div className="grid flex-1 gap-6 lg:grid-cols-[260px_1fr_320px]">
              <Panel className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-rose-500">Navigate</p>
                    <Link className="mt-2 block text-lg font-semibold hover:text-rose-600" href="/">
                      Home
                    </Link>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">Formulas</p>
                    <nav className="mt-3 space-y-2 text-sm">
                      {registryMeta.map(f => (
                        <Link key={f.id} className="block font-medium hover:text-rose-600" href={`/formulas/${f.id}`}>
                          {f.title}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
                <div className="mt-auto pt-6 text-xs text-zinc-600">
                  Inspired by Bret Victor’s Kill Math.
                </div>
              </Panel>
              <Panel className="p-4 lg:p-6">
                <main className="flex-1">{children}</main>
              </Panel>
              <Panel className="hidden items-center justify-center p-6 text-sm text-zinc-600 lg:flex">
                <p>Chat tutor appears on formula pages.</p>
              </Panel>
            </div>
          </div>
        </div>
        {cfAnalyticsToken ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: cfAnalyticsToken })}
          ></script>
        ) : null}
      </body>
    </html>
  );
}
