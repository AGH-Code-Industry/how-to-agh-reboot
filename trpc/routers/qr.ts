import { prisma } from '@/prisma/prisma';
import { protectedProcedure, router } from '../init';
import { z } from 'zod';

export type SubmitQrResponseType = 'error' | 'info' | 'success';

export type SubmitQrResponse = {
  type: SubmitQrResponseType;
  message: string;
  eventId?: number;
};

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
      return { type: 'error', message: 'Nieznany kod QR' } as SubmitQrResponse;
    }

    const event = await prisma.event.findFirst({
      where: {
        qr_id: {
          equals: qr.qr_id,
        },
      },
    });

    if (event === null) {
      return { type: 'error', message: 'Nieznany kod QR' } as SubmitQrResponse;
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
      return {
        type: 'info',
        message: 'Ten kod został już wcześniej zeskanowany',
      } as SubmitQrResponse;
    }

    await prisma.eventVisit.create({
      data: {
        user_id: ctx.user.id,
        event_id: event.event_id,
      },
    });

    return {
      type: 'success',
      message: 'Kod pomyślnie zeskanowany',
      eventId: event.event_id,
    } as SubmitQrResponse;
  }),
  getScannedAmount: protectedProcedure.query(async (opts) => {
    const { ctx } = opts;

    const eventVisitCount = await prisma.eventVisit.aggregate({
      where: {
        user_id: {
          equals: ctx.user.id,
        },
      },
      _count: {
        event_visit_id: true,
      },
    });

    return { amount: eventVisitCount._count.event_visit_id };
  }),
});
