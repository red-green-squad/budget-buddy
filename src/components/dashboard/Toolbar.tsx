'use client';

import { FC } from 'react';
import { Dropdown, DropdownOption } from '../common/Dropdown';

export type ChartType = 'categories' | 'monthly';
export type ToolbarProps = {
  chartType: ChartType;
  selectedYear?: number;
  yearOptions: DropdownOption<number>[];
  onChartTypeChange(chartType: ChartType): void;
  onYearChange(year: number): void;
};

export const Toolbar: FC<ToolbarProps> = ({
  chartType,
  selectedYear,
  yearOptions,
  onYearChange,
  onChartTypeChange,
}) => {
  const selectedValue = yearOptions.find(
    (option) => option.value === selectedYear
  );
  const handleYearChange = (option: DropdownOption<number>) => {
    const year = option.value;
    onYearChange(year);
  };
  return (
    <nav className="p-4 flex flex-col items-center gap-4 justify-around md:flex-row">
      <ul className="flex flex-row gap-4 items-center justify-center">
        <li
          className={`p-2 w-28 rounded-lg text-sm bg-indigo-200 text-center hover:cursor-pointer hover:border-b-2 hover:border-indigo-500 ${
            chartType === 'categories'
              ? 'bg-indigo-400 border-b-2 border-indigo-500 text-gray-200'
              : ''
          }`}
          onClick={() => onChartTypeChange('categories')}
        >
          Categories
        </li>
        <li
          className={`p-2 w-28 rounded-lg text-sm bg-indigo-200 text-center hover:cursor-pointer hover:border-b-2 hover:border-indigo-500 ${
            chartType === 'monthly'
              ? 'bg-indigo-400 border-b-2 border-indigo-500 text-gray-200'
              : ''
          }`}
          onClick={() => onChartTypeChange('monthly')}
        >
          Month
        </li>
      </ul>
      <Dropdown
        title="Year"
        options={yearOptions}
        value={selectedValue}
        onChange={handleYearChange}
        className="w-48 md:w-54 lg:w-60"
      />
    </nav>
  );
};
