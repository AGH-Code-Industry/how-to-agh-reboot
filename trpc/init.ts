import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { Context } from './context';

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;
export const procedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;

  if (!ctx.auth) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      auth: ctx.auth,
      user: ctx.user,
    },
  });
});
