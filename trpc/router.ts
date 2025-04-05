import { router } from './init';
import { eventsRouter } from './routers/events';
import { exampleRouter } from './routers/example';
import { quizesRouter } from './routers/quizes';
import { buildingsRouter } from '@/trpc/routers/buildings';
import { toursRouter } from './routers/tours';

export const appRouter = router({
  example: exampleRouter,
  events: eventsRouter,
  quizes: quizesRouter,
  buildings: buildingsRouter,
  tours: toursRouter,
});

export type AppRouter = typeof appRouter;
