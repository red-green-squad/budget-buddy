import { ExpenseItem as IExpenseItem } from '@/types/expenses';
import { ExpenseItem } from '../expenses/ExpenseItem';

const expenseItems: IExpenseItem[] = [
  {
    id: '1',
    name: 'name',
    amount: 400,
    category: 'Charity and Donations',
    files: [],
    createdAt: new Date(),
    date: new Date(),
    description: 'a',
    updatedAt: new Date(),
  },
];
export const RecentExpenses = () => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl text-center">Recent transactions</p>
      <div className="flex flex-col gap-2">
        {expenseItems.map((item) => {
          return <ExpenseItem item={item} key={item.id} />;
        })}
      </div>
    </div>
  );
};
