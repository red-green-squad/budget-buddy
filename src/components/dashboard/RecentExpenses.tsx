'use client';
import { ExpenseRequestBody } from '@/app/api/expenses/route';
import { useAsync } from '@/hooks/useAsync';
import { ExpenseListPage } from '@/types/expenses';
import axios, { AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { Loader } from '../common/Loader';
import { EmptyList } from '../common/table/EmptyList';
import { ExpenseItem } from '../expenses/ExpenseItem';

export const RecentExpenses = () => {
  const [{ isLoading, error, data }, getRecentExpenses] = useAsync<
    AxiosResponse<ExpenseListPage>,
    ExpenseRequestBody
  >({
    fn: ({ pagination, sort, filters }) => {
      return axios.get('/api/expenses', {
        params: {
          pagination: JSON.stringify(pagination),
          sort: JSON.stringify(sort),
          filters: JSON.stringify(filters),
        },
      });
    },
  });

  useEffect(() => {
    getRecentExpenses({
      filters: [],
      sort: { field: 'date', value: 'desc' },
      pagination: { page: 1, pageSize: 10 },
    });
  }, []);

  const items = data?.data.items || [];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl text-center">Recent transactions</p>
      {!isLoading && !error && items.length === 0 && <EmptyList />}
      {isLoading && !error && <Loader />}
      {!isLoading && !error && items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            return <ExpenseItem item={item} key={item.id} />;
          })}
        </div>
      )}
    </div>
  );
};
