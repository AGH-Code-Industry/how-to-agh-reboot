import { ThemeResetButton } from '@/app/settings/ChangeTheme';
import { PageSectionTitle } from '@/components/layout/PageLayout';

export default function TestSettings() {
  return (
    <>
      <PageSectionTitle>Testy</PageSectionTitle>
      <div className="flex flex-col gap-4">
        <span className="text-muted-foreground text-center text-sm">
          Tymczasowe funkcje przydatne podczas testów
        </span>
        <ThemeResetButton />
      </div>
    </>
  );
}
