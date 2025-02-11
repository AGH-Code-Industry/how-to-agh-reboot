import { router } from './init';
import { userRouter } from './routers/users';
import { exampleRouter } from './routers/example';

export const appRouter = router({
  user: userRouter,
  example: exampleRouter,
});

export type AppRouter = typeof appRouter;
