import { ExpenseCategories } from '@/constants/expenseCategories';
import { z } from 'zod';

const ExpenseCategorySchema = z.enum(ExpenseCategories);
export type ExpenseCategory = z.infer<typeof ExpenseCategorySchema>;

export const ExpenseSchema = z.object({
  name: z.string().trim().min(1, 'Expense name required'),
  description: z
    .string()
    .trim()
    .optional()
    .transform((val) => {
      if (val?.length) return val;
      return undefined;
    }),
  category: ExpenseCategorySchema,
  amount: z
    .number({ required_error: 'Amount required', coerce: true })
    .min(0, 'Enter valid Amount'),
  date: z.coerce.date({ required_error: 'Date Required' }),
});

export type ExpenseValues = z.infer<typeof ExpenseSchema>;
