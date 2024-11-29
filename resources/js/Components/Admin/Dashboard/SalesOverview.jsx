import React from 'react';
import { Card } from '@/Components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select';

const SalesOverview = ({ data, period, onPeriodChange }) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold dark:text-white">Sales Overview</h3>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
            <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" name="Orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-primary/10 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold dark:text-white">
            ${data.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold dark:text-white">
            {data.reduce((acc, curr) => acc + curr.orders, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SalesOverview; 