'use client';

import { ChangeEvent, FC, useEffect, useState } from 'react';

export type EXPENSE_RANGE =
  | 'empty'
  | 'today'
  | 'thisMonth'
  | 'thisWeek'
  | 'thisYear';
export type TableToolbarProp = {
  expenseRange: EXPENSE_RANGE;
  onSearchChange(searchKey: string): void;
  onExpenseRangeChange(range: EXPENSE_RANGE): void;
};

export const TableToolbar: FC<TableToolbarProp> = ({
  expenseRange,
  onExpenseRangeChange,
  onSearchChange,
}) => {
  const [searchKey, setSearchKey] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKey(value);
  };

  const handleExpenseRangeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as any as EXPENSE_RANGE;
    onExpenseRangeChange(value);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      onSearchChange(searchKey);
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [searchKey]);

  return (
    <div className="flex flex-col gap-2 mx-auto md:mx-0 md:justify-between md:flex-row">
      <select
        id="filterBy"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-80 p-2"
        value={expenseRange}
        onChange={handleExpenseRangeChange}
      >
        <option value={'empty'}>
          {expenseRange === 'empty' ? 'Select' : 'Clear'}
        </option>
        <option value={'today'}>Today</option>
        <option value={'thisWeek'}>This Week</option>
        <option value={'thisMonth'}>This Month</option>
        <option value={'thisYear'}>This Year</option>
      </select>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="table-search"
          value={searchKey}
          className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Search for items"
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};
