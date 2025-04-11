import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import ManageRewardList from '@/components/reward/ManageRewardsList';
import { createClient } from '@/supabase/server';
import { redirect } from 'next/navigation';

export default async function ManagePrizes() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user === null || user.email !== 'codeindustry@agh.edu.pl') {
    redirect('/prizes');
  }

  return (
    <PageLayout>
      <PageTitle className="mb-8">Zarządzanie upominkami</PageTitle>
      <ManageRewardList />
    </PageLayout>
  );
}
