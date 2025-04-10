import { router } from './init';
import { eventsRouter } from './routers/events';
import { exampleRouter } from './routers/example';
import { quizesRouter } from './routers/quizes';
import { buildingsRouter } from '@/trpc/routers/buildings';
import { qrRouter } from './routers/qr';
import { prizesRouter } from './routers/prizes';
import { ratingRouter } from './routers/rating';

export const appRouter = router({
  example: exampleRouter,
  events: eventsRouter,
  quizes: quizesRouter,
  buildings: buildingsRouter,
  qr: qrRouter,
  prizes: prizesRouter,
  rating: ratingRouter,
});

export type AppRouter = typeof appRouter;
