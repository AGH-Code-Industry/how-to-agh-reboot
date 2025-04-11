import { prisma } from '@/prisma/prisma';
import { privateProcedure, protectedProcedure, router } from '../init';
import { prizeDOtoDTO, prizeRedeemCodeDOtoDTO } from '@/types/Prize';
import { z } from 'zod';
import { generateRandomString } from '@/lib/utils';
import { Prisma } from '@prisma/client';

export const prizesRouter = router({
  getPrizes: protectedProcedure.query(async (opts) => {
    const { ctx } = opts;

    const userEventVisits = await prisma.eventVisit.aggregate({
      _count: true,
      where: {
        user_id: ctx.user.id,
      },
    });

    const prizes = (
      await prisma.prize.findMany({
        include: {
          redeem_codes: {
            where: {
              user_id: ctx.user.id,
            },
          },
        },
      })
    ).map((p) => prizeDOtoDTO(p, userEventVisits._count));

    return prizes;
  }),
  createRedeemCode: protectedProcedure
    .input(
      z.object({
        rewardId: z.number().positive(),
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;

      const reward = await prisma.prize.findFirst({
        where: {
          prize_id: input.rewardId,
        },
      });

      if (reward === null) {
        return { type: 'error', message: 'Nie znaleziono nagrody.' };
      }

      const userEventVisits = await prisma.eventVisit.aggregate({
        _count: true,
        where: {
          user_id: ctx.user.id,
        },
      });

      if (userEventVisits._count < reward.required_visits) {
        return {
          type: 'error',
          message: 'Musisz zeskanować więcej kodów QR, aby odebrać tą nagrodę.',
        };
      }

      const prizeRedeemCode = await prisma.prizeRedeemCode.findFirst({
        where: {
          user_id: ctx.user.id,
          prize_id: reward.prize_id,
        },
      });

      if (prizeRedeemCode !== null) {
        return {
          type: 'info',
          message: 'Kod odbioru dla tej nagrody już istnieje.',
          code: prizeRedeemCode.code,
        };
      }

      let code;

      while ((code = generateRandomString(6))) {
        const databaseCode = await prisma.prizeRedeemCode.findFirst({
          where: {
            code: code,
          },
        });

        if (databaseCode === null) {
          break;
        }
      }

      await prisma.prizeRedeemCode.create({
        data: {
          user_id: ctx.user.id,
          code: code,
          prize_id: reward.prize_id,
        },
      });

      return { type: 'success', message: 'Poprawnie utworzono kod odbioru.', code: code };
    }),
  getRedeemCodes: privateProcedure
    .input(
      z.object({
        redeemed: z.boolean().optional(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;

      const filter: Prisma.PrizeRedeemCodeWhereInput = {};

      if (input.redeemed !== undefined) {
        filter.used = input.redeemed;
      }

      const prizeRedeemCodes = (
        await prisma.prizeRedeemCode.findMany({
          where: filter,
        })
      ).map(prizeRedeemCodeDOtoDTO);

      return prizeRedeemCodes;
    }),
  useRedeemCode: privateProcedure
    .input(
      z.object({
        redeemCodeId: z.number().positive(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;

      await prisma.prizeRedeemCode.update({
        where: {
          prize_redeem_code_id: input.redeemCodeId,
        },
        data: {
          used: true,
        },
      });
    }),
});
