import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import GeneralSettings from '@/app/settings/GeneralSettings';
import AccountSettings from '@/app/settings/AccountSettings';

export default function Settings() {
  return (
    <PageLayout>
      <PageTitle>Ustawienia</PageTitle>
      <GeneralSettings />
      <AccountSettings />
    </PageLayout>
  );
}
