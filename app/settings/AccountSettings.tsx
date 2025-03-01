'use client';

import { Button } from '@/components/ui/button';
import { PageSectionTitle } from '@/components/layout/PageLayout';
import { useState } from 'react';

export default function AccountSettings() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <PageSectionTitle>Konto</PageSectionTitle>
      {loggedIn ? (
        <div className="grid grid-cols-2 gap-4">
          <span className="text-muted-foreground text-center text-sm col-span-full">
            Zalogowano jako Imię Nazwisko
          </span>
          <Button disabled>Reset hasła</Button>
          <Button onClick={() => setLoggedIn(false)}>Wyloguj</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <span className="text-muted-foreground text-center text-sm col-span-full">
            Nie zalogowano. Niektóre funkcje mogą być niedostępne.
          </span>
          <Button disabled>Utwórz konto</Button>
          <Button onClick={() => setLoggedIn(true)}>Zaloguj</Button>
        </div>
      )}
    </>
  );
}
