import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Niepoprawny email' }),
  password: z.string().min(6, { message: 'Hasło musi mieć co najmniej 6 znaków' }),
});

export const registerSchema = z
  .object({
    email: z.string().email({ message: 'Niepoprawny email' }),
    password: z.string().min(6, { message: 'Hasło musi mieć co najmniej 6 znaków' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła muszą być takie same',
    path: ['confirmPassword'],
  });

export const resetSchema = z.object({
  email: z.string().email({ message: 'Niepoprawny email' }),
});
