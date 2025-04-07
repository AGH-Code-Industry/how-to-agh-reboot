import { prisma } from '@/prisma/prisma';
import { protectedProcedure, router } from '../init';
import { z } from 'zod';

export const qrRouter = router({
  submitQr: protectedProcedure.input(z.string()).mutation(async (opts) => {
    const { input, ctx } = opts;

    const qr = await prisma.qR.findFirst({
      where: {
        code: {
          equals: input,
        },
      },
    });

    if (qr === null) {
      return { error: true, message: 'Nieznany kod QR' };
    }

    const event = await prisma.event.findFirst({
      where: {
        qr_id: {
          equals: qr.qr_id,
        },
      },
    });

    if (event === null) {
      return { error: true, message: 'Nieznany kod QR' };
    }

    const eventVisit = await prisma.eventVisit.findFirst({
      where: {
        event_id: {
          equals: event.event_id,
        },
        user_id: {
          equals: ctx.user.id,
        },
      },
    });

    if (eventVisit !== null) {
      return { error: true, message: 'Ten kod został już zeskanowany' };
    }

    await prisma.eventVisit.create({
      data: {
        user_id: ctx.user.id,
        event_id: event.event_id,
      },
    });

    return { error: false, message: 'Kod pomyślnie zeskanowany' };
  }),
});
