import './globals.css';
import type { ReactNode } from 'react';
import { ChatPanelProvider } from '@/lib/contexts/ChatPanelContext';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'Polycalc',
  description: 'Explorador de matemática interativo inspirado em Kill Math',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex h-screen flex-col text-zinc-900 antialiased">
        <ChatPanelProvider>
          <ClientLayout>{children}</ClientLayout>
        </ChatPanelProvider>
      </body>
    </html>
  );
}
