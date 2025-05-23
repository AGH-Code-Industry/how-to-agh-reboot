'use client';

import { JSX, useMemo, useState } from 'react';
import { Provider } from '@supabase/supabase-js';
import { FaGoogle } from '@react-icons/all-files/fa/FaGoogle';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { createClient } from '@/supabase/client';
import { trpc } from '@/trpc/client';

type Props = {
  onError?: (error: string) => void;
};

export default function SocialLoginButtons({ onError }: Props): JSX.Element {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data } = trpc.qr.getScannedAmount.useQuery();

  const shouldNotSocialLogin = useMemo(() => data !== undefined && data.amount > 0, [data]);

  const handleSocialLogin = async (provider: Provider) => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setIsLoading(false);
      onError?.(error.message);
    }
  };

  return (
    <div className="mt-4 space-y-3 border-t pt-4">
      <p className="text-center text-sm text-muted-foreground">lub kontynuuj przez</p>
      <Button
        variant="outline"
        onClick={() => handleSocialLogin('google')}
        className={cn(
          `flex w-full items-center justify-center rounded border p-2`,
          isLoading && 'cursor-wait opacity-50'
        )}
      >
        <FaGoogle className="mr-2" />
        <span>{isLoading ? 'Przekierowywanie...' : 'Zaloguj przez Google'}</span>
      </Button>

      {shouldNotSocialLogin ? (
        <p className="text-center text-sm text-errorAlert-foreground">
          Logując się za pomocą Google utracisz obecny postęp.
        </p>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Zostaniesz przekierowany do{' '}
          <span className="text-foreground">{process.env.NEXT_PUBLIC_SUPABASE_URL}</span>
        </p>
      )}
    </div>
  );
}
