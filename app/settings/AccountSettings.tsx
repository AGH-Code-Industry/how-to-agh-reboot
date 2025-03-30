'use client';

import { Button } from '@/components/ui/button';
import { PageSectionTitle } from '@/components/layout/PageLayout';
import { useRouter } from 'next/navigation';

export default function AccountSettings() {
  const router = useRouter();
  const loggedIn = false; // todo w przyszlosci

  return (
    <>
      <PageSectionTitle>Konto</PageSectionTitle>
      {loggedIn ? (
        <div className="grid grid-cols-2 gap-4">
          <span className="col-span-full text-center text-sm text-muted-foreground">
            Zalogowano jako Imię Nazwisko
          </span>
          <Button disabled>Reset hasła</Button>
          <Button onClick={() => console.log('Wylogowanie')}>Wyloguj</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <span className="col-span-full text-center text-sm text-muted-foreground">
            Nie zalogowano. Niektóre funkcje mogą nie być dostępne.
          </span>
          <Button onClick={() => router.push('/auth/register')}>Utwórz konto</Button>
          <Button onClick={() => router.push('/auth/login')}>Zaloguj</Button>
        </div>
      )}
    </>
  );
}
