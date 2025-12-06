import './globals.scss';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { TRPCProvider } from '@/trpc/client';
import { ThemeProvider } from '@/components/theme-provider';
import NavBar from '@/components/layout/NavBar';
import React from 'react';
import WelcomeOverlay from '@/components/global/WelcomeOverlay';
import { Toaster } from '@/components/ui/sonner';
import ServiceWorkerRegister from '@/components/layout/ServiceWorkerRegister';
import { AuthProvider } from '@/components/auth/AuthContext';
import { PWAProvider } from '@/components/layout/PWAContext';
import { ErrorBoundary } from '@/components/global/ErrorBoundary';
import PerformanceMonitor from '@/components/global/PerformanceMonitor';
import { OfflineIndicator } from '@/components/global/OfflineIndicator';

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-dvh flex-col antialiased`}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCProvider>
              <AuthProvider>
                <PWAProvider>
                  <PerformanceMonitor />
                  <OfflineIndicator />
                  <WelcomeOverlay mode={'automatic'} />
                  <main className="grow overflow-y-auto">{children}</main>
                  <NavBar />
                  <Toaster position="top-center" />
                  <ServiceWorkerRegister />
                </PWAProvider>
              </AuthProvider>
            </TRPCProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
