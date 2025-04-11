import { PageLayout, PageSectionTitle, PageTitle } from '@/components/layout/PageLayout';
import Reward from '@/components/reward/Reward';
import { trpc } from '@/trpc/server';

export default async function Prizes() {
  const prizes = await trpc.prizes.getPrizes();

  return (
    <PageLayout>
      <PageTitle>Upominki</PageTitle>
      <PageSectionTitle className="m-4 text-center text-base font-normal">
        Odwiedzaj wydarzenia w zamian za gadżety! Odbiór upominków - B1, pokój 1, parter, do godziny
        14:45.
      </PageSectionTitle>
      <div className="flex flex-col gap-4">
        {prizes.map((prize) => (
          <Reward
            key={prize.id}
            rewardId={prize.id}
            title={prize.title}
            description={prize.description}
            required={prize.requirement}
            completed={prize.progress}
            code={prize.redeemCode}
            redeemed={prize.redeemed}
          />
        ))}
      </div>
    </PageLayout>
  );
}
