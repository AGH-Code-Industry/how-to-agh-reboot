import { PageSectionTitle } from '@/components/layout/PageLayout';
import { createClient } from '@/supabase/server';
import { AuthButton } from '@/components/auth/AuthButton';

export default async function AccountSettings() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loggedIn = user !== null && user.is_anonymous === false;

  return (
    <>
      <PageSectionTitle>Konto</PageSectionTitle>
      {loggedIn ? (
        <div className="grid grid-cols-1 gap-4">
          <span className="col-span-full text-center text-sm text-muted-foreground">
            Zalogowano jako <span className="text-foreground">{user.email}</span>
          </span>
          <AuthButton path="/auth/logout" text="Wyloguj" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <span className="col-span-full text-center text-sm text-muted-foreground">
            Nie zalogowano. Postęp może zostać utracony.
          </span>
          <AuthButton path="/auth/register" text="Utwórz konto" />
          <AuthButton path="/auth/login" text="Zaloguj się" />
        </div>
      )}
    </>
  );
}
