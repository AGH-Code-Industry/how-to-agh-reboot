'use client';

import { resetSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ServerMessage } from '@/types/Auth';
import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type ResetFormProps = {
  className?: string;
};

export default function ResetForm({ className }: ResetFormProps) {
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = (data: z.infer<typeof resetSchema>) => {
    if (data.email === 'test@test.com') {
      setServerMessage({
        type: 'success',
        message: 'Wysłano link resetujący hasło',
      });
    } else {
      setServerMessage({
        type: 'error',
        message: 'Błąd podczas wysyłania linku resetującego',
      });
    }
  };

  return (
    <div className={className}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Przypomnienie hasła</CardTitle>
          <CardDescription>Podaj email aby otrzymać link resetujący hasło</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {serverMessage && (
              <div
                className={cn(
                  `mb-4 rounded border px-4 py-2`,
                  serverMessage.type == 'success'
                    ? `bg-successAlert text-successAlert-foreground`
                    : `bg-errorAlert text-errorAlert-foreground`
                )}
                role="alert"
              >
                <span className="block text-sm font-semibold sm:inline">
                  {serverMessage.message}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="email">Email</Label>
                <Input {...register('email')} placeholder="name@example.com" />
                {errors.email && (
                  <p className="text-sm text-errorAlert-foreground">{errors.email.message}</p>
                )}
              </div>
            </div>
            <Button type="submit" className="mt-4 w-full">
              Wyślij link resetujący hasło
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Masz juz hasło?{' '}
            <Link href="/auth/login" className="mt-3  underline underline-offset-4">
              Zaloguj się
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
