import { FC } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type ExpensesChartProps = {
  data: { group: string; totalAmount: number }[];
};

export const ExpensesChart: FC<ExpensesChartProps> = ({ data }) => {
  return (
    <div className="h-[90%]">
      <ResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="totalAmount"
            fill="#82ca9d"
            maxBarSize={30}
            activeBar={<Rectangle fill="purple" stroke="purple" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
