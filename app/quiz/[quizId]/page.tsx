'use client';

import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import QuizQuestionAnswers from '@/components/quiz/QuizQuestionAnswers';
import QuizStatusBar from '@/components/quiz/QuizStatusBar';
import { delay } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { QuizDetailsDTO } from '@/types/Quiz';
import { use, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type QuizPageProps = {
  params: Promise<{
    quizId: string;
  }>;
};

type QuizScreenState = 'intro' | 'question-loading' | 'question' | 'finished';

const INTRO_DURATION = 3000;
const QUESTION_LOADING_DURATION = 1500;
const AFTER_ANSWER_DURATION = 1000;

const VARIANTS = {
  enter: {
    x: 1000,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -1000,
    opacity: 0,
  },
};

export default function QuizPage({ params }: QuizPageProps) {
  const { quizId } = use(params);
  const { data: quizData, isLoading }: { data: QuizDetailsDTO | undefined; isLoading: boolean } =
    trpc.quizes.getQuizDetails.useQuery({
      quizId: Number(quizId),
    });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [boolAnswers, setBoolAnswers] = useState<boolean[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [state, setState] = useState<QuizScreenState>('intro');

  useEffect(() => {
    if (!quizData) return;

    if (state === 'intro') {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, INTRO_DURATION);
      return () => clearTimeout(timer);
    }
  }, [state, quizData]);

  const handleNextQuestion = async () => {
    setState('question-loading');
    await delay(QUESTION_LOADING_DURATION);
    setSelectedAnswer(null);
    setState('question');
  };

  const handleSelectAnswer = async (answerId: number) => {
    if (isChecking || !quizData) return;

    setSelectedAnswer(answerId);
    setIsChecking(true);

    try {
      const isCorrect = answerId === quizData.questions[currentQuestion].answers[0].id; // TODO: Do poprawy jak bedzie gotowe

      setBoolAnswers((prev) => [...prev, isCorrect]);

      await delay(AFTER_ANSWER_DURATION);

      if (currentQuestion === quizData.questions.length - 1) {
        setState('finished');
      } else {
        setCurrentQuestion((prev) => prev + 1);
        handleNextQuestion();
      }
    } finally {
      setIsChecking(false);
    }
  };

  if (isLoading || !quizData) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <p className="text-lg font-semibold">
          {isLoading ? 'Ładowanie quizu...' : 'Nie znaleziono quizu.'}
        </p>
      </div>
    );
  }

  return (
    <PageLayout className="flex h-full flex-col items-center gap-y-8 p-8">
      {state === 'intro' && (
        <IntroScreen quizName={quizData.name} quizDescription={quizData.description} />
      )}
      {state === 'question-loading' && (
        <QuestionLoadingScreen
          currentQuestion={currentQuestion}
          quizData={quizData}
          boolAnswers={boolAnswers}
        />
      )}
      {state === 'question' && (
        <QuestionScreen
          quizData={quizData}
          currentQuestion={currentQuestion}
          boolAnswers={boolAnswers}
          selectedAnswer={selectedAnswer}
          handleSelectAnswer={handleSelectAnswer}
          isChecking={isChecking}
        />
      )}
      {state === 'finished' && <QuizFinishedScreen quizData={quizData} boolAnswers={boolAnswers} />}
    </PageLayout>
  );
}

type IntroScreenProps = {
  quizName: string;
  quizDescription: string | null;
};

const IntroScreen = ({ quizName, quizDescription }: IntroScreenProps) => {
  return (
    <motion.div
      key="intro"
      custom={1}
      variants={VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex size-full flex-col items-center justify-center gap-8 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <PageTitle className="m-0 text-center">{quizName}</PageTitle>
      </motion.div>

      <motion.p
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
      >
        {quizDescription}
      </motion.p>
    </motion.div>
  );
};

type QuestionLoadingScreenProps = {
  currentQuestion: number;
  quizData: QuizDetailsDTO;
  boolAnswers: boolean[];
};

const QuestionLoadingScreen = ({
  currentQuestion,
  quizData,
  boolAnswers,
}: QuestionLoadingScreenProps) => {
  return (
    <motion.div
      key="question-loading"
      custom={1}
      variants={VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex size-full flex-col items-center justify-center gap-8"
    >
      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
        <QuizStatusBar
          currentQuestion={currentQuestion}
          totalQuestions={quizData.questions.length}
          boolAnswers={boolAnswers}
          large
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-semibold"
      >
        Pytanie {currentQuestion + 1}
      </motion.p>
    </motion.div>
  );
};

type QuestionScreenProps = {
  quizData: QuizDetailsDTO;
  currentQuestion: number;
  boolAnswers: boolean[];
  selectedAnswer: number | null;
  handleSelectAnswer: (answerId: number) => void;
  isChecking: boolean;
};

const QuestionScreen = ({
  quizData,
  currentQuestion,
  boolAnswers,
  selectedAnswer,
  handleSelectAnswer,
  isChecking,
}: QuestionScreenProps) => {
  return (
    <motion.div
      key="question"
      custom={1}
      variants={VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex size-full flex-col items-center gap-y-8"
    >
      <PageTitle className="m-0">{quizData.name}</PageTitle>
      <QuizStatusBar
        currentQuestion={currentQuestion}
        totalQuestions={quizData.questions.length}
        boolAnswers={boolAnswers}
      />
      <div className="flex h-full grow flex-col items-center gap-y-2">
        <p className="text-center text-base text-muted-foreground">
          {quizData.questions[currentQuestion].description}
        </p>
        <div className="flex h-full grow flex-col items-center gap-y-8">
          <div className="flex flex-1 items-center justify-center text-center">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-semibold"
            >
              {quizData.questions[currentQuestion].title}
            </motion.p>
          </div>
          <div className="w-full flex-1">
            <QuizQuestionAnswers
              answers={quizData.questions[currentQuestion].answers}
              selectedAnswer={selectedAnswer}
              correctAnswerId={quizData.questions[currentQuestion].answers[0].id}
              onSelectAnswer={handleSelectAnswer}
              disabled={isChecking}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

type QuizFinishedScreenProps = {
  quizData: QuizDetailsDTO;
  boolAnswers: boolean[];
};

const QuizFinishedScreen = ({ quizData, boolAnswers }: QuizFinishedScreenProps) => {
  return (
    <motion.div
      key="finished"
      custom={1}
      variants={VARIANTS}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex h-full flex-col items-center justify-center gap-8 p-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
        className="text-center"
      >
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold"
        >
          Quiz zakończony!
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-2xl"
        >
          Wynik: {boolAnswers.filter(Boolean).length}/{quizData.questions.length}
        </motion.p>
      </motion.div>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }}>
        <QuizStatusBar
          currentQuestion={quizData.questions.length - 1}
          totalQuestions={quizData.questions.length}
          boolAnswers={boolAnswers}
          large
        />
      </motion.div>
    </motion.div>
  );
};
