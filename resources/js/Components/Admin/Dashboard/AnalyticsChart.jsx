import React from 'react';
import { Card } from '@/Components/ui/card';
import { Select } from '@/Components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from 'recharts';
import { format } from 'date-fns';

const AnalyticsChart = ({ data, title, timeRange, onTimeRangeChange }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            {format(new Date(label), 'MMM dd, yyyy')}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {entry.name}: {entry.name === 'Revenue' 
                  ? formatCurrency(entry.value)
                  : entry.value
                }
              </p>
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
      
      <div className="h-[400px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorOrders)"
            />
            <Brush dataKey="date" height={30} stroke="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(data?.reduce((acc, curr) => acc + curr.revenue, 0) || 0)}
          trend="up"
          percentage="12.5"
        />
        <SummaryCard
          title="Total Orders"
          value={data?.reduce((acc, curr) => acc + curr.orders, 0) || 0}
          trend="up"
          percentage="8.2"
        />
        <SummaryCard
          title="Average Order Value"
          value={formatCurrency(
            data?.reduce((acc, curr) => acc + curr.revenue, 0) / 
            data?.reduce((acc, curr) => acc + curr.orders, 0) || 0
          )}
          trend="up"
          percentage="5.3"
        />
        <SummaryCard
          title="Conversion Rate"
          value="3.2%"
          trend="down"
          percentage="2.1"
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

export default AnalyticsChart; 