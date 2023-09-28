'use client';

import { AsyncResult } from '@/hooks/useAsync';
import { ExpenseItem, ExpenseListPage } from '@/types/expenses';
import { AxiosResponse } from 'axios';
import { FC } from 'react';
import { Table } from '../common/table/Table';
import { TableToolbar } from '../common/table/TableToolbar';

export type ExpenseListProps = {
  expenses: AsyncResult<AxiosResponse<ExpenseListPage>>;
  page: number;
  pageSize: number;
  onPageChange(page: number): void;
  onPageSizeChange(pageSize: number): void;
  onSearchKeyChange(searchKey: string): void;
};

export const ExpensesList: FC<ExpenseListProps> = ({
  expenses,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSearchKeyChange,
}) => {
  const { isLoading, error, data: result } = expenses;
  return (
    <div className="h-full flex flex-col flex-1 gap-4">
      <TableToolbar onSearchChange={onSearchKeyChange} />
      <Table<ExpenseItem>
        isLoading={isLoading}
        hasError={!!error}
        page={page}
        pageSize={pageSize}
        totalItemCount={result?.data.totalItemCount || 0}
        items={result?.data.items || []}
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
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};
