'use client';

import { ExpenseItem } from '@/types/expenses';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { Dropdown, DropdownOption } from '../Dropdown';
export type EXPENSE_RANGE =
  | 'all'
  | 'today'
  | 'thisMonth'
  | 'thisWeek'
  | 'thisYear';
export type TableToolbarProp = {
  expenseRange: EXPENSE_RANGE;
  selectedItems: ExpenseItem[];
  onSearchChange(searchKey: string): void;
  onExpenseRangeChange(range: EXPENSE_RANGE): void;
  onDelete(): void;
};

const EXPENSE_RANGE_OPTIONS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Today',
    value: 'today',
  },
  {
    label: 'This Week',
    value: 'thisWeek',
  },
  {
    label: 'This Month',
    value: 'thisMonth',
  },
  {
    label: 'This Year',
    value: 'thisYear',
  },
];

export const TableToolbar: FC<TableToolbarProp> = ({
  expenseRange,
  selectedItems,
  onExpenseRangeChange,
  onSearchChange,
  onDelete,
}) => {
  const [searchKey, setSearchKey] = useState<string>('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKey(value);
  };

  const handleExpenseRangeChange = (option: DropdownOption<EXPENSE_RANGE>) => {
    onExpenseRangeChange(option.value);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      onSearchChange(searchKey);
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [searchKey]);

  return (
    <div className="flex flex-col gap-2 mx-auto md:mx-0 md:justify-between md:flex-row">
      <Dropdown
        value={EXPENSE_RANGE_OPTIONS.find(
          (option) => option.value === expenseRange
        )}
        options={EXPENSE_RANGE_OPTIONS}
        onChange={handleExpenseRangeChange}
        title="Expense Range"
        className="w-64"
      />
      <div className="relative">
        <div className="flex flex-row items-center gap-4 hover:cursor-pointer">
          {selectedItems.length > 0 && (
            <div onClick={onDelete}>
              <MdDelete size={30} color="#ff2424" />
            </div>
          )}
          <div>
            <div className="absolute p-3">
              <AiOutlineSearch />
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
      </div>
    </div>
  );
};
