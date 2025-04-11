import { ThemeToggleButton } from '@/app/settings/ChangeTheme';
import { PageSectionTitle } from '@/components/layout/PageLayout';
import AboutApplicationButton from '@/components/settings/AboutApplicationButton';
import AboutUsButton from '@/components/settings/AboutUsButton';
import { RequestPWAButton } from '@/app/settings/RequestPWAButton';

export default function GeneralSettings() {
  return (
    <>
      <PageSectionTitle>Ogólne</PageSectionTitle>
      <div className="flex flex-col gap-4">
        <ThemeToggleButton />
        <div className="grid grid-cols-2 gap-4">
          <AboutApplicationButton />
          <AboutUsButton />
        </div>
        <RequestPWAButton />
      </div>
    </>
  );
}
