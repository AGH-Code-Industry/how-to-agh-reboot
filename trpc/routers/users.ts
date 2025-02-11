import { z } from 'zod';
import { procedure, router } from '../init';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userRouter = router({
  getUsers: procedure.query(async () => {
    return await prisma.user.findMany({});
  }),
  addUser: procedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
        },
      });
    }),
});
