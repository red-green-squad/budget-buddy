'use client';

import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal';
import { ExpensesList } from '@/components/expenses/ExpensesList';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/table';
import { useAsync } from '@/hooks/useAsync';
import { ExpenseListPage } from '@/types/expenses';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { ExpenseRequestBody } from '../api/expenses/route';

export default function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [expensesResult, getExpenses] = useAsync<
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

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateExpense = () => {
    setIsModalOpen(true);
  };

  const handleCreateExpenseComplete = async () => {
    await getExpenses({
      pagination: { page, pageSize },
    });
  };

  return (
    <div className="h-full shadow-md sm:rounded-lg flex-1 p-4 flex flex-col">
      <div className="flex flex-col h-[15%]">
        <h1 className="mb-4 text-xl text-center">Expenses</h1>
        <button
          onClick={handleCreateExpense}
          className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-md self-end px-4 py-2 my-4"
        >
          Create Expense
        </button>
      </div>
      <div className="flex flex-col h-[85%]">
        <ExpensesList
          expenses={expensesResult}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
      <CreateExpenseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onComplete={handleCreateExpenseComplete}
      />
    </div>
  );
}
