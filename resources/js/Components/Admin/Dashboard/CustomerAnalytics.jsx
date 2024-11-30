import React from 'react';
import { Card } from '@/Components/ui/card';
import { Select } from '@/Components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { format } from 'date-fns';

const CustomerAnalytics = ({ data, title, timeRange, onTimeRangeChange, stats }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
          <p className="font-medium mb-2">{format(new Date(label), 'MMM dd, yyyy')}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-400">
                {entry.name}: {entry.name === 'Spent' 
                  ? formatCurrency(entry.value)
                  : entry.value
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
        <Select
          value={timeRange}
          onValueChange={onTimeRangeChange}
          className="w-32"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'MMM dd')}
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={formatCurrency}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="spent"
              name="Spent"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="orders"
              name="Orders"
              fill="#82ca9d"
              radius={[4, 4, 0, 0]}
            />
            <ReferenceLine
              y={data?.reduce((acc, curr) => acc + curr.spent, 0) / data?.length}
              yAxisId="left"
              stroke="#ff7300"
              strokeDasharray="3 3"
              label="Avg. Spent"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <SummaryCard
          title="Total Spent"
          value={formatCurrency(data?.reduce((acc, curr) => acc + curr.spent, 0) || 0)}
          trend="up"
          percentage="15.3"
        />
        <SummaryCard
          title="Order Frequency"
          value={`${(data?.reduce((acc, curr) => acc + curr.orders, 0) / 30).toFixed(1)}/day`}
          trend="up"
          percentage="8.2"
        />
        <SummaryCard
          title="Average Order"
          value={formatCurrency(
            data?.reduce((acc, curr) => acc + curr.spent, 0) / 
            data?.reduce((acc, curr) => acc + curr.orders, 0) || 0
          )}
          trend="up"
          percentage="5.7"
        />
        <SummaryCard
          title="Rewards Points"
          value={stats?.rewards_points || 0}
          trend="up"
          percentage="12.1"
        />
      </div>
    </Card>
  );
};

const SummaryCard = ({ title, value, trend, percentage }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{value}</p>
    <p className={`text-sm mt-1 ${
      trend === 'up' ? 'text-green-600' : 'text-red-600'
    }`}>
      {trend === 'up' ? '↑' : '↓'} {percentage}%
    </p>
  </div>
);

export default CustomerAnalytics; 