import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type QuizStatusBarProps = {
  currentQuestion: number;
  totalQuestions: number;
  boolAnswers: boolean[];
  large?: boolean;
};

export default function QuizStatusBar({
  currentQuestion,
  totalQuestions,
  boolAnswers,
  large = false,
}: QuizStatusBarProps) {
  return (
    <div
      className={cn('flex w-fit items-center justify-between gap-x-4', large && 'scale-x-110')}
      data-testid="quiz-status-bar"
    >
      {Array.from({ length: totalQuestions }).map((_, index) => {
        const color =
          index < boolAnswers.length
            ? boolAnswers[index]
              ? 'bg-successAlert-foreground/75'
              : 'bg-errorAlert-foreground/75'
            : index === currentQuestion
              ? 'bg-foreground'
              : 'bg-muted-foreground';

        return (
          <motion.div
            key={index}
            className={cn(`rounded-full ${color} overflow-hidden`, large ? 'size-6' : 'size-4')}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
          >
            {index < boolAnswers.length && (
              <motion.div
                initial={{ scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`size-full rounded-full ${color}`}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
