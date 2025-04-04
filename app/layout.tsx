import './globals.scss';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { TRPCProvider } from '@/trpc/client';
import { ThemeProvider } from '@/components/theme-provider';
import NavBar from '@/components/layout/NavBar';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'How To AGH',
  description: 'Wkrocz w świat AGH!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  registerServiceWorker();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-dvh flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>
            <main className="grow overflow-y-auto">{children}</main>
            <NavBar />
            <Toaster position="top-center" />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  }
};
