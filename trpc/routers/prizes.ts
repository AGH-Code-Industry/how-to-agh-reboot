import { prisma } from '@/prisma/prisma';
import { protectedProcedure, router } from '../init';
import { prizeDOtoDTO } from '@/types/Prize';

export const prizesRouter = router({
  getPrizes: protectedProcedure.query(async (opts) => {
    const { ctx } = opts;

    const userEventVisits = await prisma.eventVisit.aggregate({
      _count: true,
      where: {
        user_id: ctx.user.id,
      },
    });

    const prizes = (await prisma.prize.findMany()).map((p) =>
      prizeDOtoDTO(p, userEventVisits._count)
    );

    return prizes;
  }),
});
