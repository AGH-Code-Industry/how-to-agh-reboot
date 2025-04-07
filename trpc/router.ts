import { router } from './init';
import { eventsRouter } from './routers/events';
import { exampleRouter } from './routers/example';
import { quizesRouter } from './routers/quizes';
import { buildingsRouter } from '@/trpc/routers/buildings';
import { toursRouter } from './routers/tours';
import { qrRouter } from './routers/qr';
import { prizesRouter } from './routers/prizes';

export const appRouter = router({
  example: exampleRouter,
  events: eventsRouter,
  quizes: quizesRouter,
  buildings: buildingsRouter,
  tours: toursRouter,
  qr: qrRouter,
  prizes: prizesRouter,
});

export type AppRouter = typeof appRouter;
