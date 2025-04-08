import { trpc } from '@/trpc/server';
import { QuizDTO } from '@/types/Quiz';
import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import QuizCard from '@/components/quiz/QuizCard';

export default async function QuizPage() {
  const quizes = await trpc.quizes.getQuizes();

  return (
    <PageLayout>
      <PageTitle>Quiz</PageTitle>
      <div className="flex flex-col gap-4">
        {quizes?.map((quiz: QuizDTO) => <QuizCard key={quiz.id} quiz={quiz} />)}
      </div>
    </PageLayout>
  );
}
