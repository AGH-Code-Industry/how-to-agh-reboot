import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@/trpc/router';
import superjson from 'superjson';

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: superjson,
      url: getUrl(),
      headers: () => {
        const headers = new Headers();
        headers.set('x-trpc-source', 'nextjs-react');
        return headers;
      },
    }),
  ],
});
