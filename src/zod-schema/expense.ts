import { ExpenseCategories } from '@/constants/expenseCategories';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/table';
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
  files: z
    .object({
      id: z.string(),
      file: z.custom<File>(),
    })
    .array()
    .optional(),
});

export const ExpenseQuerySchema = z.object({
  page: z.number({ coerce: true }).default(DEFAULT_PAGE),
  pageSize: z.number({ coerce: true }).default(DEFAULT_PAGE_SIZE),
  searchKey: z.string().optional(),
  expenseRange: z.string().default('all'),
});

export const EditExpenseSchema = z.object({
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
  files: z
    .object({
      id: z.string(),
      file: z.custom<File>(),
    })
    .array()
    .optional(),
});

export type ExpenseValues = z.infer<typeof ExpenseSchema>;
export type EditExpenseValues = z.infer<typeof ExpenseSchema>;
