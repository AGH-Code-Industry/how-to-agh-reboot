'use client';

import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, unstable_httpBatchStreamLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import { AppRouter } from './router';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

let clientQueryClientSingleton: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient());
}

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}

export function TRPCProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>
) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof window !== 'undefined' && (window as any).Cypress
          ? httpBatchLink({
              transformer: superjson,
              url: getUrl(),
              headers: () => {
                const headers = new Headers();
                headers.set('x-trpc-source', 'nextjs-react');
                return headers;
              },
            })
          : unstable_httpBatchStreamLink({
              transformer: superjson,
              url: getUrl(),
              headers: () => {
                const headers = new Headers();
                headers.set('x-trpc-source', 'nextjs-react');
                return headers;
              },
            }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </trpc.Provider>
  );
}
