import { ThemeResetButton } from '@/app/settings/ChangeTheme';
import { PageSectionTitle } from '@/components/layout/PageLayout';
import ResetCookiesButton from '@/components/settings/ResetCookiesButton';

export default function TestSettings() {
  return (
    <>
      <PageSectionTitle>Testy</PageSectionTitle>
      <div className="flex flex-col gap-4">
        <span className="text-center text-sm text-muted-foreground">
          Tymczasowe funkcje przydatne podczas testów
        </span>
        <ThemeResetButton />
        <ResetCookiesButton />
      </div>
    </>
  );
}
