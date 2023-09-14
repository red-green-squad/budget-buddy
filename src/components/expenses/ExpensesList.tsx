'use client';

import { ExpenseRequestBody } from '@/app/api/expenses/route';
import { useAsync } from '@/hooks/useAsync';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Table } from './Table';
import { TableToolbar } from './TableToolbar';
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

export const ExpensesList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [{ data }, getExpenses] = useAsync<
    AxiosResponse<ExpenseListPage>,
    ExpenseRequestBody
  >({
    fn: ({ pagination, sort }) => {
      return axios.get('/api/expenses', {
        params: {
          pagination: JSON.stringify(pagination),
          sort: JSON.stringify(sort),
        },
      });
    },
  });

  useEffect(() => {
    getExpenses({
      pagination: { page, pageSize },
    });
  }, [page, pageSize]);

  return (
    <div className="h-full flex flex-col flex-1 gap-4">
      <TableToolbar />
      <Table<ExpenseItem>
        page={page}
        pageSize={pageSize}
        totalItemCount={data?.data.totalItemCount || 0}
        items={data?.data.items || []}
        columns={[
          {
            key: 'name',
            name: 'Name',
            type: 'string',
          },
          {
            key: 'description',
            name: 'Description',
            type: 'string',
          },
          {
            key: 'category',
            name: 'Category',
            type: 'string',
          },
          {
            key: 'amount',
            name: 'Amount',
            type: 'number',
          },
          {
            key: 'createdAt',
            name: 'Created On',
            type: 'date',
          },
          {
            key: 'date',
            name: 'Expense Date',
            type: 'date',
          },
        ]}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};
