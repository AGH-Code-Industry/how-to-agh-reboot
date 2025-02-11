import { initTRPC } from '@trpc/server';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return {};
});

const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
export const procedure = t.procedure;
