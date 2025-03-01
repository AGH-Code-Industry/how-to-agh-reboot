import { ThemeToggleButton } from '@/app/settings/ChangeTheme';
import { Button } from '@/components/ui/button';
import { PageSectionTitle } from '@/components/layout/PageLayout';

export default function GeneralSettings() {
  return (
    <>
      <PageSectionTitle>Ogólne</PageSectionTitle>
      <div className="flex flex-col gap-4">
        <ThemeToggleButton />
        <div className="grid grid-cols-2 gap-4">
          <Button disabled>O aplikacji</Button>
          <Button disabled>Ponów samouczek</Button>
        </div>
      </div>
    </>
  );
}
