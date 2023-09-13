import { z } from 'zod';

export const SignInSchema = z.object({
  email: z
    .string({ required_error: 'Email required' })
    .email('Please enter a valid email address'),
  password: z
    .string({ required_error: 'Password required' })
    .min(1, 'Password required'),
});

export type SignInFieldValues = z.infer<typeof SignInSchema>;
