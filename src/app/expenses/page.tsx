'use client';

import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal';
import { ExpensesList } from '@/components/expenses/ExpensesList';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@/constants/table';
import { useAsync } from '@/hooks/useAsync';
import { ExpenseListPage } from '@/types/expenses';
import { Filter } from '@/types/filters';
import axios, { AxiosResponse } from 'axios';
import { produce } from 'immer';
import { useEffect, useState } from 'react';
import { ExpenseRequestBody } from '../api/expenses/route';

export default function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [expensesResult, getExpenses] = useAsync<
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
    getExpenses({
      pagination: { page, pageSize },
      filters,
    });
  }, [page, pageSize, filters]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreateExpense = () => {
    setIsModalOpen(true);
  };

  const handleCreateExpenseComplete = async () => {
    await getExpenses({
      pagination: { page, pageSize },
      filters,
    });
  };

  const handleSearchKeyChange = (searchKey: string) => {
    if (searchKey.trim().length > 0) {
      const updatedFilters = produce(filters, (draft) => {
        const searchFilterIndex = draft.findIndex(
          (filter) => filter.path.join('.') === 'name'
        );
        if (searchFilterIndex !== -1) {
          draft[searchFilterIndex].value = searchKey;
        } else {
          draft.push({
            type: 'text',
            path: ['name'],
            condition: 'text:contains',
            value: searchKey,
          });
        }
      });
      setFilters(updatedFilters);
    } else {
      const updatedFilters = produce(filters, (draft) => {
        const searchFilterIndex = draft.findIndex(
          (filter) => filter.path.join('.') === 'name'
        );
        if (searchFilterIndex !== -1) {
          draft.splice(searchFilterIndex, 1);
        }
      });
      setFilters(updatedFilters);
    }
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
          onSearchKeyChange={handleSearchKeyChange}
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
