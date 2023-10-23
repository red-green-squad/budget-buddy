import { RecentExpenses } from '@/components/dashboard/RecentExpenses';
import { Summary } from '@/components/dashboard/Summary';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-2 p-4 md:flex-row">
      <div className="md:w-2/5">
        <RecentExpenses />
      </div>
      <div className="md:w-3/5">
        <Summary />
      </div>
    </div>
  );
}
