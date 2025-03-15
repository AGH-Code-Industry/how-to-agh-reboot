import { router } from './init';
import { eventsRouter } from './routers/events';
import { exampleRouter } from './routers/example';
import { quizesRouter } from './routers/quizes';

export const appRouter = router({
  example: exampleRouter,
  events: eventsRouter,
  quizes: quizesRouter,
});

export type AppRouter = typeof appRouter;
