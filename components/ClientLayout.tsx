'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import Panel from '@/components/Panel';
import Topbar from '@/components/Topbar';
import { registryMeta } from '@/modules/registry-meta';
import { useChatPanel } from '@/lib/contexts/ChatPanelContext';

type ClientLayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { ChatPanelComponent } = useChatPanel();
  const cfAnalyticsToken = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

  return (
    <>
      <Topbar />
      <div className="flex-1 w-full overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl h-full">
          <div className="grid h-full gap-6 grid-cols-1 lg:grid-cols-[240px_1fr_280px] p-4 sm:p-6 lg:p-8 overflow-y-auto lg:overflow-hidden">
            <Panel className="p-6 flex flex-col overflow-hidden">
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
                Inspired by Bret Victor's Kill Math.
              </div>
            </Panel>
            <Panel className="overflow-hidden flex flex-col">
              <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
            </Panel>
            <Panel className="hidden lg:flex overflow-hidden">
              {ChatPanelComponent}
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
    </>
  );
}