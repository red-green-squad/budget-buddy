import { z } from 'zod';

export const SingInSchema = z.object({
  email: z
    .string({ required_error: 'Email required' })
    .email('Please enter a valid email address'),
  password: z.string({ required_error: 'Password required' }),
});

export type SingInFieldValues = z.infer<typeof SingInSchema>;
