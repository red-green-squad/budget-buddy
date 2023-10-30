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
          <XAxis name="Group" dataKey="group" />
          <YAxis name="Amount" />
          <Tooltip cursor={false} />
          <Bar
            dataKey="totalAmount"
            fill="#3949AB"
            maxBarSize={30}
            activeBar={
              <Rectangle strokeWidth={'16 0'} fill="#3949AB" stroke="#3949AB" />
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
