import { quizDOtoDTO, quizDetailsDOtoDTO, QuizDO, QuizDetailsDO } from '@/types/Quiz';

describe('Quiz Types', () => {
  describe('quizDOtoDTO', () => {
    it('should correctly transform Quiz with question count', () => {
      const mockQuiz: QuizDO = {
        quiz_id: 1,
        name: 'AGH History Quiz',
        description: 'Test your knowledge about AGH University',
        created_at: new Date(),
        updated_at: new Date(),
        _count: {
          quiz_questions: 5,
        },
      };

      const result = quizDOtoDTO(mockQuiz);

      expect(result).toEqual({
        id: 1,
        name: 'AGH History Quiz',
        description: 'Test your knowledge about AGH University',
        questionCount: 5,
      });
    });

    it('should handle quiz with no description', () => {
      const mockQuiz: QuizDO = {
        quiz_id: 1,
        name: 'AGH History Quiz',
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
        _count: {
          quiz_questions: 3,
        },
      };

      const result = quizDOtoDTO(mockQuiz);

      expect(result).toEqual({
        id: 1,
        name: 'AGH History Quiz',
        description: null,
        questionCount: 3,
      });
    });
  });

  describe('quizDetailsDOtoDTO', () => {
    it('should correctly transform Quiz with questions and answers', () => {
      const mockQuizDetails: QuizDetailsDO = {
        quiz_id: 1,
        name: 'AGH History Quiz',
        description: 'Test your knowledge about AGH University',
        created_at: new Date(),
        updated_at: new Date(),
        quiz_questions: [
          {
            quiz_question_id: 1,
            quiz_id: 1,
            question_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            question: {
              question_id: 1,
              title: 'When was AGH founded?',
              description: 'Choose the correct founding year',
              time: new Date('1970-01-01T00:05:00Z'), // 5 minutes
              question_type_id: 1,
              created_at: new Date(),
              updated_at: new Date(),
              question_type: {
                question_type_id: 1,
                name: 'single_choice',
                created_at: new Date(),
                updated_at: new Date(),
              },
              answers: [
                {
                  answer_id: 1,
                  text: '1919',
                  is_correct: true,
                  question_id: 1,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
                {
                  answer_id: 2,
                  text: '1920',
                  is_correct: false,
                  question_id: 1,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              ],
            },
          },
        ],
      };

      const result = quizDetailsDOtoDTO(mockQuizDetails);

      expect(result).toEqual({
        id: 1,
        name: 'AGH History Quiz',
        description: 'Test your knowledge about AGH University',
        questions: [
          {
            id: 1,
            title: 'When was AGH founded?',
            description: 'Choose the correct founding year',
            time: new Date('1970-01-01T00:05:00Z'),
            type: 'single_choice',
            answers: [
              {
                id: 1,
                text: '1919',
              },
              {
                id: 2,
                text: '1920',
              },
            ],
          },
        ],
      });
    });

    it('should handle quiz with no description and question with no description', () => {
      const mockQuizDetails: QuizDetailsDO = {
        quiz_id: 1,
        name: 'AGH History Quiz',
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
        quiz_questions: [
          {
            quiz_question_id: 1,
            quiz_id: 1,
            question_id: 1,
            created_at: new Date(),
            updated_at: new Date(),
            question: {
              question_id: 1,
              title: 'When was AGH founded?',
              description: null,
              time: null,
              question_type_id: 1,
              created_at: new Date(),
              updated_at: new Date(),
              question_type: {
                question_type_id: 1,
                name: 'single_choice',
                created_at: new Date(),
                updated_at: new Date(),
              },
              answers: [
                {
                  answer_id: 1,
                  text: '1919',
                  is_correct: true,
                  question_id: 1,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
              ],
            },
          },
        ],
      };

      const result = quizDetailsDOtoDTO(mockQuizDetails);

      expect(result).toEqual({
        id: 1,
        name: 'AGH History Quiz',
        description: null,
        questions: [
          {
            id: 1,
            title: 'When was AGH founded?',
            description: null,
            time: null,
            type: 'single_choice',
            answers: [
              {
                id: 1,
                text: '1919',
              },
            ],
          },
        ],
      });
    });
  });
});
