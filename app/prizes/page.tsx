import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import Reward from '@/components/reward/Reward';

export default function Prizes() {
  const tempNagroda = {
    reward: 'Kubek z Uśmieszkiem',
    requirement: 'Wykonaj 5 zadań rangi średniej lub trudnej.',
    completion: 0.33,
  };

  const tempNagrodaFull = {
    reward: 'Kubek z Uśmieszkiem',
    requirement: 'Wykonaj 5 zadań rangi średniej lub trudnej.',
    completion: 1,
  };

  return (
    <PageLayout>
      <PageTitle>Nagrody</PageTitle>
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
