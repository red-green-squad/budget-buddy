'use client';
import { useState } from 'react';
import { ChartType, Toolbar } from './Toolbar';

export const Summary = () => {
  const [selectedYear, setSelectedYear] = useState<number>();
  const [chartType, setChartType] = useState<ChartType>('categories');

  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl text-center">Summary of Expenses</p>
      <Toolbar
        selectedYear={selectedYear}
        chartType={chartType}
        yearOptions={[
          { label: '2021', value: 2021 },
          { label: '2022', value: 2022 },
          { label: '2023', value: 2023 },
          { label: '2024', value: 2024 },
        ]}
        onYearChange={setSelectedYear}
        onChartTypeChange={setChartType}
      />
    </div>
  );
};
