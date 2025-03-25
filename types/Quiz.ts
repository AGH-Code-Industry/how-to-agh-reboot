import { Quiz, QuizQuestion, Question, QuestionType, Answer } from '@prisma/client';

export type QuizDO = Quiz & { _count: { quiz_questions: number } };

export type QuizDTO = {
  id: QuizDO['quiz_id'];
  name: QuizDO['name'];
  description: QuizDO['description'];
  questionCount: QuizDO['_count']['quiz_questions'];
};

export const quizDOtoDTO = (data: QuizDO): QuizDTO => ({
  id: data.quiz_id,
  name: data.name,
  description: data.description,
  questionCount: data._count.quiz_questions,
});

export type QuizDetailsDO = Quiz & {
  quiz_questions: (QuizQuestion & {
    question: Question & { question_type: QuestionType } & { answers: Answer[] };
  })[];
};

export type QuizDetailsDTO = {
  id: QuizDetailsDO['quiz_id'];
  name: QuizDetailsDO['name'];
  description: QuizDetailsDO['description'];
  questions: {
    id: QuizDetailsDO['quiz_questions'][0]['question_id'];
    title: QuizDetailsDO['quiz_questions'][0]['question']['title'];
    description: QuizDetailsDO['quiz_questions'][0]['question']['description'];
    time: QuizDetailsDO['quiz_questions'][0]['question']['time'];
    type: QuizDetailsDO['quiz_questions'][0]['question']['question_type']['name'];
    answers: {
      id: QuizDetailsDO['quiz_questions'][0]['question']['answers'][0]['answer_id'];
      text: QuizDetailsDO['quiz_questions'][0]['question']['answers'][0]['text'];
    }[];
  }[];
};

export const quizDetailsDOtoDTO = (data: QuizDetailsDO): QuizDetailsDTO => ({
  id: data.quiz_id,
  name: data.name,
  description: data.description,
  questions: data.quiz_questions.map((qq) => ({
    id: qq.question_id,
    title: qq.question.title,
    description: qq.question.description,
    time: qq.question.time,
    type: qq.question.question_type.name,
    answers: qq.question.answers.map((a) => ({
      id: a.answer_id,
      text: a.text,
    })),
  })),
});
