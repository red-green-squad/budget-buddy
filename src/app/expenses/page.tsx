'use client';

import { EXPENSE_RANGE } from '@/components/common/table/TableToolbar';
import { CreateExpenseModal } from '@/components/expenses/CreateExpenseModal';
import { ExpensesList } from '@/components/expenses/ExpensesList';
import { useAsync } from '@/hooks/useAsync';
import { ExpenseListPage } from '@/types/expenses';
import { Filter } from '@/types/filters';
import { getFilter } from '@/utils/filters';
import { ExpenseQuerySchema } from '@/zod-schema/expense';
import axios, { AxiosResponse } from 'axios';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExpenseRequestBody } from '../api/expenses/route';

function parseSearchParamsToObj(
  searchParams: ReadonlyURLSearchParams
): Record<string, any> {
  const response: Record<string, any> = {};
  for (const [key, value] of searchParams.entries()) {
    response[key] = value;
  }
  return response;
}

function getFilters(expenseRange: EXPENSE_RANGE, searchKey?: string) {
  const filters: Filter[] = [];
  if (!!searchKey?.trim().length) {
    filters.push({
      type: 'text',
      path: ['name'],
      condition: 'text:contains',
      value: searchKey,
    });
  }
  const range = expenseRange;
  if (range !== 'empty') {
    const rangeFilter = getFilter(range);
    filters.push(rangeFilter);
  }
  return filters;
}

export default function Expenses() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedParams = parseSearchParamsToObj(searchParams);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { page, pageSize, searchKey, expenseRange } =
    ExpenseQuerySchema.parse(parsedParams);
  const filters = useMemo(() => {
    return getFilters(expenseRange as EXPENSE_RANGE, searchKey);
  }, [searchKey, expenseRange]);

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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

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

  const handlePageChange = (page: number) => {
    const queryString = createQueryString('page', String(page));
    router.push(pathname + `?${queryString}`);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const queryString = createQueryString('pageSize', String(pageSize));
    router.push(pathname + `?${queryString}`);
  };

  const handleFilterRangeChange = (range: EXPENSE_RANGE) => {
    const queryString = createQueryString('expenseRange', range);
    router.push(pathname + `?${queryString}`);
  };

  const handleCreateExpenseComplete = async () => {
    await getExpenses({
      pagination: { page, pageSize },
      filters,
    });
  };

  const handleSearchKeyChange = (searchKey: string) => {
    const queryString = createQueryString('searchKey', searchKey);
    router.push(pathname + `?${queryString}`);
  };

  console.log('ExpenseRange: ', expenseRange);
  console.log(searchParams.toString());

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
          expenseRange={expenseRange as EXPENSE_RANGE}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearchKeyChange={handleSearchKeyChange}
          onExpenseRangeChange={handleFilterRangeChange}
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
