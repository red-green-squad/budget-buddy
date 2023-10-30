'use client';
import { ExpenseSummaryRequestBody } from '@/app/api/summary/route';
import { useAsync } from '@/hooks/useAsync';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { ChartType, Toolbar } from './Toolbar';
import { ExpensesChart } from './ExpensesChart';
import { Loader } from '../common/Loader';
import { getMonthName } from '@/utils/common';

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
    { summary: { group: string; totalAmount: number }[] },
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

  const isLoading = expensesSummary.isLoading || yearSuggestions.isLoading;
  const error = expensesSummary.error || yearSuggestions.error;

  const chartData = useMemo(() => {
    const { data: { summary } = { summary: [] } } = expensesSummary;
    if (chartType === 'monthly') {
      summary.sort();
      return summary.map((item) => {
        return {
          group: getMonthName(Number(item.group)),
          totalAmount: item.totalAmount,
        };
      });
    }
    return summary;
  }, [chartType, expensesSummary]);

  return (
    <div className="flex flex-col gap-2 h-full">
      <p className="text-2xl text-center">Summary of Expenses</p>
      <Toolbar
        selectedYear={selectedYear}
        chartType={chartType}
        yearOptions={yearSuggestions.data ?? []}
        onYearChange={setSelectedYear}
        onChartTypeChange={setChartType}
      />
      {isLoading && !error && <Loader />}
      {!isLoading && error && <div>Something went wrong</div>}
      {!isLoading && !error && <ExpensesChart data={chartData} />}
    </div>
  );
};
