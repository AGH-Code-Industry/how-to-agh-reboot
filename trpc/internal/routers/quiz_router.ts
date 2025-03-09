import { z } from 'zod';
import { procedure, router } from '../../init';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const quizRouter = router({
  getQuiz: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return prisma.quiz.findUnique({
      where: { quiz_id: input.id },
      include: { quiz_questions: { include: { question: { include: { answers: true } } } } },
    });
  }),

  getNextQuestion: procedure
    .input(z.object({ quizId: z.number(), userId: z.number() }))
    .query(async ({ input }) => {
      return prisma.quizQuestion.findFirst({
        where: {
          quiz_id: input.quizId,
          quiz_question_answers: { none: { user_id: input.userId } },
        },
        include: { question: { include: { answers: true } } },
      });
    }),
});
