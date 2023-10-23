import { ExpenseItem as IExpenseItem } from '@/types/expenses';
import { FC } from 'react';

type ExpenseItemProps = {
  item: IExpenseItem;
};
export const ExpenseItem: FC<ExpenseItemProps> = ({ item }) => {
  return (
    <div className="flex flex-col m-4 p-2 rounded-lg border-2 border-indigo-300">
      <p className="font-extrabold text-indigo-500">{item.name}</p>
      {item.description && (
        <p className="text-sm font-thin">{item.description}</p>
      )}
      <p className="text-sm font-extraligh">{item.category}</p>
      <p className="text-sm font-semibold">{item.amount}</p>
    </div>
  );
};
