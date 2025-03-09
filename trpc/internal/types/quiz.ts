import { User } from '@/trpc/internal/types/user';

export interface QuestionType {
  id: number;
  name: string;
  questions?: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: number;
  time?: Date;
  title: string;
  description?: string;
  questionTypeId: number;
  questionType?: QuestionType;
  answers?: Answer[];
  quizQuestions?: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
  questionId: number;
  question?: Question;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: number;
  name: string;
  description?: string;
  quizQuestions?: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestion {
  id: number;
  questionId: number;
  question?: Question;
  quizId: number;
  quiz?: Quiz;
  quizQuestionAnswers?: QuizQuestionAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestionAnswer {
  id: number;
  correctAnswer: number;
  quizQuestionId: number;
  quizQuestion?: QuizQuestion;
  userId: number;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
