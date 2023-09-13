'use client';

import { ExpenseCategories } from '@/constants/expenseCategories';
import { ExpenseValues } from '@/zod-schema/expense';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

type ExpenseFormProps = {
  errors: FieldErrors<ExpenseValues>;
  register: UseFormRegister<ExpenseValues>;
};

export const ExpenseForm = ({ register, errors }: ExpenseFormProps) => {
  return (
    <form className="flex flex-col gap-4 overflow-auto">
      <section className="flex flex-col p-4 gap-4">
        <label>Expense Name</label>
        <input
          className="h-12 p-2 border-0 ring-2 ring-inset ring-indigo-200 rounded-lg focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-400"
          {...register('name')}
        />
        {errors.name && (
          <span className="text-red-400">{errors.name.message}</span>
        )}
      </section>
      <section className="flex flex-col p-4 gap-4">
        <label>Description</label>
        <input
          type="text"
          className="h-12 p-2 border-0 ring-2 ring-inset ring-indigo-200 rounded-lg focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-400"
          {...register('description')}
        />
        {errors.description && (
          <span className="text-red-400">{errors.description.message}</span>
        )}
      </section>
      <section className="flex flex-col p-4 gap-4">
        <label>Expense Category</label>
        <select
          id="filterBy"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          {...register('category')}
        >
          {ExpenseCategories.map((category) => {
            return (
              <option key={category} value={category}>
                {category}
              </option>
            );
          })}
        </select>
        {errors.category && (
          <span className="text-red-400">{errors.category.message}</span>
        )}
      </section>
      <section className="flex flex-col p-4 gap-4">
        <label>Amount</label>
        <input
          type="number"
          defaultValue={0}
          className="h-12 p-2 border-0 ring-2 ring-inset ring-indigo-200 rounded-lg focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-400"
          {...register('amount', {
            onChange(event) {
              event.target.value =
                event.target.value !== '' ? parseFloat(event.target.value) : 0;
            },
          })}
        />
        {errors.amount && (
          <span className="text-red-400">{errors.amount.message}</span>
        )}
      </section>
      <section className="flex flex-col p-4 gap-4">
        <label>Date</label>
        <input
          type="date"
          className="h-12 p-2 border-0 ring-2 ring-inset ring-indigo-200 rounded-lg focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-400"
          {...register('date')}
        />
        {errors.date && (
          <span className="text-red-400">{errors.date.message}</span>
        )}
      </section>
    </form>
  );
};
