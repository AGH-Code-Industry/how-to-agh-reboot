import { prisma } from '@/prisma/prisma';
import { protectedProcedure, router } from '../init';
import { z } from 'zod';

export type SubmitQrResponseType = 'error' | 'info' | 'success';

export type RateEventResponse = {
  type: SubmitQrResponseType;
  message: string;
};

export const ratingRouter = router({
  rateEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.number().positive(),
        rating: z.number().positive(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;

      const eventVisit = await prisma.eventVisit.findFirst({
        where: {
          user_id: ctx.user.id,
          event_id: input.eventId,
        },
      });

      if (eventVisit === null) {
        return {
          type: 'error',
          message:
            'Aby ocenić wydarzenie musisz je najpierw odwiedzić poprzez zeskanowanie kodu QR.',
        } as RateEventResponse;
      }

      const rating = await prisma.eventRating.findFirst({
        where: {
          user_id: ctx.user.id,
          event_id: input.eventId,
        },
      });

      if (rating !== null) {
        return {
          type: 'info',
          message: 'To wydarzenie zostało już przez Ciebie ocenione.',
        } as RateEventResponse;
      }

      await prisma.eventRating.create({
        data: {
          user_id: ctx.user.id,
          event_id: input.eventId,
          rating: input.rating,
        },
      });

      return {
        type: 'success',
        message: 'Pomyślnie zapisano ocenę wydarzenia!',
      } as RateEventResponse;
    }),
});
