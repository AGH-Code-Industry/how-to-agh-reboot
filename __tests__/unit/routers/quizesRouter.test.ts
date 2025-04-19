import { quizesRouter } from '@/trpc/routers/quizes';
import { prisma } from '@/prisma/prisma';

jest.mock('../../../trpc/init', () => {
  const mockProcedure = {
    input: jest.fn().mockImplementation((schema) => ({
      query: jest.fn().mockImplementation((handler) => ({
        query: async (input: any) => {
          try {
            schema.parse(input);
            return handler({ input });
          } catch (error) {
            throw new Error('Input validation failed');
          }
        },
        _def: {
          query: handler,
        },
      })),
    })),
    query: jest.fn().mockImplementation((handler) => ({
      query: async () => handler({}),
      _def: {
        query: handler,
      },
    })),
  };

  return {
    procedure: mockProcedure,
    router: jest.fn().mockImplementation((routes) => ({
      createCaller: jest.fn().mockImplementation(() => ({
        getQuizes: async () => routes.getQuizes.query(),
        getQuizDetails: async (input: any) => routes.getQuizDetails.query(input),
      })),
    })),
  };
});

const mockQuiz = {
  quiz_id: 1,
  name: 'Test Quiz',
  description: 'Test Description',
  _count: {
    quiz_questions: 5,
  },
};

const mockQuizDetails = {
  quiz_id: 1,
  name: 'Test Quiz',
  description: 'Test Description',
  quiz_questions: [
    {
      quiz_question_id: 1,
      quiz_id: 1,
      question_id: 1,
      question: {
        question_id: 1,
        title: 'Test Question Title',
        description: 'Test Question Description',
        time: 60,
        question_type: {
          question_type_id: 1,
          name: 'single_choice',
        },
        answers: [
          {
            answer_id: 1,
            text: 'Test Answer 1',
          },
          {
            answer_id: 2,
            text: 'Test Answer 2',
          },
        ],
      },
    },
  ],
};

jest.mock('@/prisma/prisma', () => {
  const findManyQuizesMock = jest.fn();
  const findFirstQuizMock = jest.fn();

  return {
    prisma: {
      quiz: {
        findMany: findManyQuizesMock,
        findFirst: findFirstQuizMock,
      },
    },
  };
});

describe('quizesRouter', () => {
  let findManyQuizesSpy: jest.Mock;
  let findFirstQuizSpy: jest.Mock;
  let caller: ReturnType<typeof quizesRouter.createCaller>;

  beforeEach(() => {
    jest.clearAllMocks();
    findManyQuizesSpy = prisma.quiz.findMany as jest.Mock;
    findFirstQuizSpy = prisma.quiz.findFirst as jest.Mock;
    caller = quizesRouter.createCaller({
      auth: false,
      user: null,
    });
  });

  describe('getQuizes', () => {
    it('should return all quizes with question count', async () => {
      findManyQuizesSpy.mockResolvedValueOnce([mockQuiz]);

      const result = await caller.getQuizes();

      expect(findManyQuizesSpy).toHaveBeenCalledWith({
        include: {
          _count: {
            select: {
              quiz_questions: true,
            },
          },
        },
      });
      expect(result).toEqual([
        {
          id: mockQuiz.quiz_id,
          name: mockQuiz.name,
          description: mockQuiz.description,
          questionCount: mockQuiz._count.quiz_questions,
        },
      ]);
    });

    it('should return empty array when no quizes exist', async () => {
      findManyQuizesSpy.mockResolvedValueOnce([]);

      const result = await caller.getQuizes();

      expect(findManyQuizesSpy).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getQuizDetails', () => {
    it('should return quiz details with questions and answers', async () => {
      findFirstQuizSpy.mockResolvedValueOnce(mockQuizDetails);

      const result = await caller.getQuizDetails({ quizId: 1 });

      expect(findFirstQuizSpy).toHaveBeenCalledWith({
        where: {
          quiz_id: 1,
        },
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
      expect(result).toEqual({
        id: mockQuizDetails.quiz_id,
        name: mockQuizDetails.name,
        description: mockQuizDetails.description,
        questions: [
          {
            id: mockQuizDetails.quiz_questions[0].question_id,
            title: mockQuizDetails.quiz_questions[0].question.title,
            description: mockQuizDetails.quiz_questions[0].question.description,
            time: mockQuizDetails.quiz_questions[0].question.time,
            type: mockQuizDetails.quiz_questions[0].question.question_type.name,
            answers: mockQuizDetails.quiz_questions[0].question.answers.map((a) => ({
              id: a.answer_id,
              text: a.text,
            })),
          },
        ],
      });
    });

    it('should return null when quiz not found', async () => {
      findFirstQuizSpy.mockResolvedValueOnce(null);

      const result = await caller.getQuizDetails({ quizId: 999 });

      expect(findFirstQuizSpy).toHaveBeenCalledWith({
        where: {
          quiz_id: 999,
        },
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
      expect(result).toBeNull();
    });

    it('should throw error for invalid quiz ID', async () => {
      await expect(caller.getQuizDetails({ quizId: -1 })).rejects.toThrow(
        'Input validation failed'
      );
    });
  });
});
