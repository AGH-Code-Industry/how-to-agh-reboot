import { PageLayout, PageTitle } from '@/components/layout/PageLayout';
import NotificationSettings from '@/app/settings/NotificationSettings';
import GeneralSettings from '@/app/settings/GeneralSettings';
import AccountSettings from '@/app/settings/AccountSettings';
import TestSettings from '@/app/settings/TestSettings';

export default function Settings() {
  return (
    <PageLayout>
      <PageTitle>Ustawienia</PageTitle>
      <GeneralSettings />
      <NotificationSettings />
      <AccountSettings />
      <TestSettings />
    </PageLayout>
  );
}
