import { EventVisit } from '@/trpc/internal/types/event';
import { QuizQuestionAnswer } from '@/trpc/internal/types/quiz';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  eventVisits?: EventVisit[];
  quizQuestionAnswers?: QuizQuestionAnswer[];
  createdAt: Date;
  updatedAt: Date;
}
