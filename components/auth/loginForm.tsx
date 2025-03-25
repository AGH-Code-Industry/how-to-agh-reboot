'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/lib/validation';
import { Label } from '../ui/label';
import type * as z from 'zod';
import { useState } from 'react';
import { MESSAGE_STYLES } from '@/lib/constants/message-styles';
import { ServerMessage } from '@/types/Auth';

type LoginFormProps = {
  className?: string;
};

export default function LoginForm({ className }: LoginFormProps) {
  const [serverMessage, setServerMessage] = useState<ServerMessage | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    if (data.password === 'test123') {
      setServerMessage({
        type: 'success',
        message: 'Zalogowano pomyślnie',
      });
    } else {
      setServerMessage({
        type: 'error',
        message: 'Niepoprawne dane logowania',
      });
    }
  };

  return (
    <div className={className}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Logowanie</CardTitle>
          <CardDescription>Podaj login i hasło do swojego konta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {serverMessage && (
              <div
                className={`mb-4 rounded border px-4 py-2 ${MESSAGE_STYLES[serverMessage.type]}`}
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
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Hasło</Label>
                  <Link
                    href="/auth/reset"
                    className="inline-block text-sm underline-offset-4 hover:underline"
                    tabIndex={-1}
                  >
                    Zapomniałeś hasła?
                  </Link>
                </div>
                <Input type="password" {...register('password')} />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>
            <Button type="submit" className="mt-4 w-full">
              Zaloguj się
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Nie masz konta?{' '}
            <Link href="/auth/register" className="mt-3  underline underline-offset-4">
              Zarejestruj się
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
