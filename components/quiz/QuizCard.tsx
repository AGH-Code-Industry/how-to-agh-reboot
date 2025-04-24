'use client';

import { QuizDTO } from '@/types/Quiz';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function QuizCard({ quiz }: { quiz: QuizDTO }) {
  const completed = false; // TODO: Replace when trpc is ready
  const router = useRouter();

  return (
    <Card className="flex flex-col gap-2 p-2 shadow-md">
      <CardHeader className="flex flex-col gap-y-1">
        <CardTitle>{quiz.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
      </CardHeader>
      <CardContent>
        {!completed && (
          <p className="pb-2 text-xs text-muted-foreground/75" data-testid="completion-info">
            Żeby ukończyć quiz, musisz odpowiedzieć na przynajmniej 50% pytań poprawnie.
          </p>
        )}
        <div className="flex justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <p className="text-sm">Ukończony:</p>
            <div
              data-testid="completion-indicator"
              className={cn(
                'size-4 rounded-full',
                completed ? 'bg-successAlert-foreground/75' : 'bg-errorAlert-foreground/75'
              )}
            ></div>
          </div>

          <Button disabled={completed} onClick={() => router.push(`/quiz/${quiz.id}`)}>
            Rozpocznij
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
