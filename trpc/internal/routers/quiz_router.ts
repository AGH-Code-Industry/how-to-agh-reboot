import { z } from 'zod';
import { procedure, router } from '../../init';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const quizRouter = router({
  getQuiz: procedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return prisma.quiz.findUnique({
      where: { quiz_id: input.id },
      include: {
        quiz_questions: { include: { question: { include: { answers: true } } } },
      },
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

  submitAnswer: procedure
    .input(
      z.object({
        quizQuestionId: z.number(),
        userId: z.number(),
        answerId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const answer = await prisma.answer.findUnique({ where: { answer_id: input.answerId } });
      if (!answer) throw new Error('Nie znaleziono odpowiedzi');

      const isCorrect = answer.is_correct;

      await prisma.quizQuestionAnswer.create({
        data: {
          user_id: input.userId,
          quiz_question_id: input.quizQuestionId,
          correct_answer: input.answerId,
        },
      });

      return { correct: isCorrect };
    }),

  getQuizResult: procedure
    .input(z.object({ quizId: z.number(), userId: z.number() }))
    .query(async ({ input }) => {
      const totalQuestions = await prisma.quizQuestion.count({ where: { quiz_id: input.quizId } });
      const correctAnswers = await prisma.quizQuestionAnswer.count({
        where: {
          quiz_question: { quiz_id: input.quizId },
          user_id: input.userId,
        },
      });
      return { totalQuestions, correctAnswers, passed: correctAnswers / totalQuestions >= 0.6 };
    }),

  getQuizProgress: procedure
    .input(z.object({ quizId: z.number(), userId: z.number() }))
    .query(async ({ input }) => {
      const totalQuestions = await prisma.quizQuestion.count({ where: { quiz_id: input.quizId } });
      const answeredQuestions = await prisma.quizQuestionAnswer.count({
        where: { quiz_question: { quiz_id: input.quizId }, user_id: input.userId },
      });
      const nextQuestion = await prisma.quizQuestion.findFirst({
        where: {
          quiz_id: input.quizId,
          quiz_question_answers: { none: { user_id: input.userId } },
        },
      });
      return {
        totalQuestions,
        answeredQuestions,
        nextQuestionId: nextQuestion?.quiz_question_id || null,
      };
    }),

  checkQuizCompletion: procedure
    .input(z.object({ quizId: z.number(), userId: z.number() }))
    .query(async ({ input }) => {
      const result = await prisma.quizResult.findUnique({
        where: { quiz_id_user_id: { quiz_id: input.quizId, user_id: input.userId } },
      });
      return result ? { completed: true, score: result.score } : { completed: false };
    }),
});
