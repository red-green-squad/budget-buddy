import { ExpenseCategory } from '@/zod-schema/expense';

export type ExpenseItem = {
  id: string;
  name: string;
  description: string;
  category: ExpenseCategory;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  images: unknown[];
  amount: number;
};

export type ExpenseListPage = {
  page: number;
  pageSize: number;
  totalItemCount: number;
  items: ExpenseItem[];
};
