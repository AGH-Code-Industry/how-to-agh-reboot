import { QuizDetailsDTO } from '@/types/Quiz';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type Answer = QuizDetailsDTO['questions'][number]['answers'][number];

type QuizQuestionAnswersProps = {
  answers: Answer[];
  selectedAnswer: number | null;
  correctAnswerId: number | null | undefined;
  onSelectAnswer: (answerId: number) => void;
  disabled: boolean;
};

export default function QuizQuestionAnswers({
  answers,
  selectedAnswer,
  correctAnswerId,
  onSelectAnswer,
  disabled,
}: QuizQuestionAnswersProps) {
  const getButtonVariant = (answerId: number) => {
    if (selectedAnswer === null) return 'default';
    if (answerId === correctAnswerId) return 'correct';
    if (answerId === selectedAnswer && answerId !== correctAnswerId) return 'incorrect';
    return 'default';
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex size-full flex-1 grow gap-4" data-testid="quiz-answer-row1">
        {answers.slice(0, 2).map((answer) => (
          <QuizQuestionAnswer
            key={answer.id}
            answer={answer}
            variant={getButtonVariant(answer.id)}
            onSelectAnswer={onSelectAnswer}
            disabled={disabled}
          />
        ))}
      </div>
      <div className="flex size-full flex-1 grow gap-4" data-testid="quiz-answer-row2">
        {answers.slice(2).map((answer) => (
          <QuizQuestionAnswer
            key={answer.id}
            answer={answer}
            variant={getButtonVariant(answer.id)}
            onSelectAnswer={onSelectAnswer}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

type QuizQuestionAnswerProps = {
  answer: Answer;
  variant: 'default' | 'correct' | 'incorrect';
  onSelectAnswer: (answerId: number) => void;
  disabled: boolean;
};

export function QuizQuestionAnswer({
  answer,
  variant,
  onSelectAnswer,
  disabled,
}: QuizQuestionAnswerProps) {
  const getButtonClass = () => {
    console.log(variant);
    switch (variant) {
      case 'correct':
        return 'bg-successAlert-foreground/75';
      case 'incorrect':
        return 'bg-errorAlert-foreground/75';
      default:
        return 'bg-muted-foreground/70';
    }
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className="size-full"
    >
      <Button
        data-testid="quiz-answer-button"
        onClick={() => onSelectAnswer(answer.id)}
        className={cn(
          `transition-colors duration-100 text-white size-full min-h-32 min-w-32 flex-1 grow text-wrap break-words rounded-md p-2 text-lg font-bold`,
          getButtonClass()
        )}
        disabled={disabled}
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {answer.text}
        </motion.span>
      </Button>
    </motion.div>
  );
}
