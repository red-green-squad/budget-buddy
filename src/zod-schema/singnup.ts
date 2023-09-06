import { z } from 'zod';

export const SingUpSchema = z.object({
  fullName: z.string({ required_error: 'FullName is a required field' }).trim(),
  email: z
    .string({ required_error: 'Email required' })
    .email('Please enter a valid email address'),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/,
      {
        message:
          'Password should contain at least 1 Uppercase, 1 lowercase, 1 number and 1 special character ',
      }
    )
    .trim()
    .min(8, 'Password should be minimum of 8 characters'),
});

export type SignUpFields = z.infer<typeof SingUpSchema>;
