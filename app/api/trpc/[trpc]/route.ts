import { appRouter } from '@/trpc/router';
import { createTRPCContext } from '@/trpc/init';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    router: appRouter,
    req,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
