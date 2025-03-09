import {
  QuestionType as PrismaQuestionType,
  Question as PrismaQuestion,
  Answer as PrismaAnswer,
  Quiz as PrismaQuiz,
  QuizQuestion as PrismaQuizQuestion,
  QuizQuestionAnswer as PrismaQuizQuestionAnswer,
} from '@prisma/client';
import {
  Answer,
  Question,
  QuestionType,
  Quiz,
  QuizQuestion,
  QuizQuestionAnswer,
} from '@/trpc/internal/types/quiz';

export const toDomainQuestionType = (
  qt: PrismaQuestionType & { questions?: PrismaQuestion[] }
): QuestionType => ({
  id: qt.question_type_id,
  name: qt.name,
  questions: qt.questions ? qt.questions.map(toDomainQuestion) : [],
  createdAt: qt.created_at,
  updatedAt: qt.updated_at,
});

export const toDomainQuestion = (
  q: PrismaQuestion & { answers?: PrismaAnswer[]; quiz_questions?: PrismaQuizQuestion[] }
): Question => ({
  id: q.question_id,
  time: q.time ?? undefined,
  title: q.title,
  description: q.description ?? undefined,
  questionTypeId: q.question_type_id,
  questionType: undefined,
  answers: q.answers ? q.answers.map(toDomainAnswer) : [],
  quizQuestions: q.quiz_questions ? q.quiz_questions.map(toDomainQuizQuestion) : [],
  createdAt: q.created_at,
  updatedAt: q.updated_at,
});

export const toDomainAnswer = (a: PrismaAnswer): Answer => ({
  id: a.answer_id,
  text: a.text,
  isCorrect: a.is_correct,
  questionId: a.question_id,
  question: undefined,
  createdAt: a.created_at,
  updatedAt: a.updated_at,
});

export const toDomainQuiz = (
  quiz: PrismaQuiz & { quiz_questions?: PrismaQuizQuestion[] }
): Quiz => ({
  id: quiz.quiz_id,
  name: quiz.name,
  description: quiz.description ?? undefined,
  quizQuestions: quiz.quiz_questions ? quiz.quiz_questions.map(toDomainQuizQuestion) : [],
  createdAt: quiz.created_at,
  updatedAt: quiz.updated_at,
});

export const toDomainQuizQuestion = (
  qq: PrismaQuizQuestion & { quiz_question_answers?: PrismaQuizQuestionAnswer[] }
): QuizQuestion => ({
  id: qq.quiz_question_id,
  questionId: qq.question_id,
  question: undefined,
  quizId: qq.quiz_id,
  quiz: undefined,
  quizQuestionAnswers: qq.quiz_question_answers
    ? qq.quiz_question_answers.map(toDomainQuizQuestionAnswer)
    : [],
  createdAt: qq.created_at,
  updatedAt: qq.updated_at,
});

export const toDomainQuizQuestionAnswer = (qqa: PrismaQuizQuestionAnswer): QuizQuestionAnswer => ({
  id: qqa.quiz_question_answer_id,
  correctAnswer: qqa.correct_answer,
  quizQuestionId: qqa.quiz_question_id,
  quizQuestion: undefined,
  userId: qqa.user_id,
  user: undefined,
  createdAt: qqa.created_at,
  updatedAt: qqa.updated_at,
});
