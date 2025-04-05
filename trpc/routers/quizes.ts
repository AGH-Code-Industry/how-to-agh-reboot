import { prisma } from '@/prisma/prisma';
import { procedure, router } from '../init';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { quizDetailsDOtoDTO, quizDOtoDTO } from '@/types/Quiz';

export const quizesRouter = router({
  getQuizes: procedure.query(async () => {
    const quizes = (
      await prisma.quiz.findMany({
        include: {
          _count: {
            select: {
              quiz_questions: true,
            },
          },
        },
      })
    ).map(quizDOtoDTO);

    return quizes;
  }),
  getQuizDetails: procedure
    .input(
      z.object({
        quizId: z.number().positive(),
      })
    )
    .query(async (opts) => {
      const { input } = opts;

      const filter: Prisma.QuizWhereInput = {};

      filter.quiz_id = input.quizId;

      const quizDetailsDO = await prisma.quiz.findFirst({
        include: {
          quiz_questions: {
            include: {
              question: {
                include: {
                  answers: true,
                  question_type: true,
                },
              },
            },
          },
        },
      });

      if (quizDetailsDO) {
        const quizDetailsDTO = quizDetailsDOtoDTO(quizDetailsDO);
        return quizDetailsDTO;
      }

      return null;
    }),
});
