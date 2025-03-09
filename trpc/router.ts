import { router } from './init';
import { exampleRouter } from '@/trpc/internal/routers/example';

export const appRouter = router({
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;
