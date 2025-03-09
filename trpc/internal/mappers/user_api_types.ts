import { User } from '@/trpc/internal/types/user';
import {
  User as PrismaUser,
  EventVisit as PrismaEventVisit,
  QuizQuestionAnswer as PrismaQuizQuestionAnswer,
} from '@prisma/client';
import { toDomainEventVisit } from '@/trpc/internal/mappers/event_api_types';
import { toDomainQuizQuestionAnswer } from '@/trpc/internal/mappers/quiz_api_types';
export const toDomainUser = (
  user: PrismaUser & {
    event_visits?: PrismaEventVisit[];
    quiz_question_answers?: PrismaQuizQuestionAnswer[];
  }
): User => ({
  id: user.user_id,
  firstName: user.first_name,
  lastName: user.last_name,
  password: user.password,
  eventVisits: user.event_visits ? user.event_visits.map(toDomainEventVisit) : [],
  quizQuestionAnswers: user.quiz_question_answers
    ? user.quiz_question_answers.map(toDomainQuizQuestionAnswer)
    : [],
  createdAt: user.created_at,
  updatedAt: user.updated_at,
});
