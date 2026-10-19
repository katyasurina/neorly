import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Введіть коректний email'),
  password: z.string().min(1, 'Введіть пароль'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1, "Введіть ім'я"),
  email: z.email('Введіть коректний email'),
  password: z.string().min(8, 'Пароль має містити щонайменше 8 символів'),
});

export type RegisterValues = z.infer<typeof registerSchema>;
