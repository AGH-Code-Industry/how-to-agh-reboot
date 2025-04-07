import { PageLayout, PageSectionTitle, PageTitle } from '@/components/layout/PageLayout';
import Reward from '@/components/reward/Reward';
import { trpc } from '@/trpc/server';

export default async function Prizes() {
  const prizes = await trpc.prizes.getPrizes();

  return (
    <PageLayout>
      <PageTitle>Nagrody</PageTitle>
      <PageSectionTitle className="m-4 text-center text-base font-normal">
        Wykonuj zadania w zamian za nagrody! Odbiór nagród - namiot WRSS
      </PageSectionTitle>
      <div className="flex flex-col gap-4">
        {prizes.map((prize) => (
          <Reward
            key={prize.id}
            title={prize.title}
            description={prize.description}
            required={prize.requirement}
            completed={prize.progress}
          />
        ))}
      </div>
    </PageLayout>
  );
}
