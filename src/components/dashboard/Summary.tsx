'use client';
import { ExpenseSummaryRequestBody } from '@/app/api/summary/route';
import { useAsync } from '@/hooks/useAsync';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChartType, Toolbar } from './Toolbar';

export const Summary = () => {
  const [selectedYear, setSelectedYear] = useState<number>();
  const [chartType, setChartType] = useState<ChartType>('categories');

  const [yearSuggestions, getYearSuggestions] = useAsync<
    { label: string; value: number }[],
    any
  >({
    fn: async () => {
      const response = await axios.get('api/summary/year-suggestions');

      const yearOptions =
        response.data?.years.map((year: number) => ({
          label: String(year),
          value: year,
        })) ?? [];
      setSelectedYear(yearOptions[0].value);
      return yearOptions;
    },
  });

  const [expensesSummary, getExpensesSummary] = useAsync<
    any,
    ExpenseSummaryRequestBody
  >({
    fn: async (data) => {
      const response = await axios.post('api/summary', data);
      return response.data;
    },
  });

  useEffect(() => {
    getYearSuggestions({});
  }, []);

  useEffect(() => {
    if (selectedYear) {
      getExpensesSummary({
        year: selectedYear,
        groupBy: chartType === 'categories' ? 'category' : 'month',
      });
    }
  }, [chartType, selectedYear]);

  console.log(expensesSummary.data);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl text-center">Summary of Expenses</p>
      <Toolbar
        selectedYear={selectedYear}
        chartType={chartType}
        yearOptions={yearSuggestions.data ?? []}
        onYearChange={setSelectedYear}
        onChartTypeChange={setChartType}
      />
    </div>
  );
};
