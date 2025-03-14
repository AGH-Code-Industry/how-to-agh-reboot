import { PageLayout, PageSectionTitle, PageTitle } from '@/components/layout/PageLayout';
import Reward from '@/components/reward/Reward';

export default function Prizes() {
  const tempNagroda = {
    reward: 'Kubek z Uśmieszkiem',
    requirement: 'Wykonaj 5 zadań rangi średniej lub trudnej.',
    completed: 3,
    required: 8,
  };

  const tempNagrodaFull = {
    reward: 'Kubek z Uśmieszkiem',
    requirement: 'Wykonaj 5 zadań rangi średniej lub trudnej.',
    completed: 8,
    required: 8,
  };

  return (
    <PageLayout>
      <PageTitle>Nagrody</PageTitle>
      <PageSectionTitle className="m-4 text-center text-base font-normal">
        Wykonuj zadania w zamian za nagrody! Odbiór nagród - namiot WRSS
      </PageSectionTitle>
      <div className="flex flex-col gap-4">
        <Reward {...tempNagroda} />
        <Reward {...tempNagroda} />
        <Reward {...tempNagrodaFull} />
        <Reward {...tempNagrodaFull} />
        <Reward {...tempNagroda} />
        <Reward {...tempNagroda} />
      </div>
    </PageLayout>
  );
}
