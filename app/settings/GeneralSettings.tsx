import { ThemeToggleButton } from '@/app/settings/ChangeTheme';
import { Button } from '@/components/ui/button';
import { PageSectionTitle } from '@/components/layout/PageLayout';
import AboutApplicationButton from '@/components/settings/AboutApplicationButton';

export default function GeneralSettings() {
  return (
    <>
      <PageSectionTitle>Ogólne</PageSectionTitle>
      <div className="flex flex-col gap-4">
        <ThemeToggleButton />
        <div className="grid grid-cols-2 gap-4">
          <AboutApplicationButton />
          <Button disabled>Ponów samouczek</Button>
        </div>
      </div>
    </>
  );
}
