import { procedure, router } from '@/trpc/init';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const eventRouter = router({
  getEvents: procedure.query(async () => {
    return prisma.event.findMany();
  }),

  scanQrCode: procedure
    .input(z.object({ userId: z.number(), qrCode: z.string() }))
    .mutation(async ({ input }) => {
      const event = await prisma.event.findFirst({ where: { qr: { code: input.qrCode } } });
      if (!event) return { success: false, message: 'Kod nie należy do gry' };

      const existingVisit = await prisma.eventVisit.findFirst({
        where: { user_id: input.userId, event_id: event.event_id },
      });
      if (existingVisit) return { success: false, message: 'Event już zaliczony' };

      await prisma.eventVisit.create({
        data: { user_id: input.userId, event_id: event.event_id, time: new Date() },
      });
      return { success: true, message: 'Event zaliczony', eventId: event.event_id };
    }),
});
