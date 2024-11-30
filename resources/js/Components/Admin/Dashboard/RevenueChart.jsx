import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  ComposedChart
} from 'recharts';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const RevenueChart = ({ data, timeRange }) => {
  const [chartType, setChartType] = useState('area');

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
          <p className="font-medium mb-2">
            {format(new Date(label), 'MMM dd, yyyy')}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-8">
              <span className="text-gray-600 dark:text-gray-400">
                {entry.name}:
              </span>
              <span className="font-medium">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const gradients = (
    <defs>
      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
      </linearGradient>
    </defs>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Revenue Overview
          </h2>
          <div className="flex items-center mt-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-2xl font-bold">
              {formatCurrency(data?.total_revenue || 0)}
            </span>
            <span className={`ml-2 flex items-center ${
              data?.revenue_change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {data?.revenue_change >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(data?.revenue_change)}%
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              Area
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              Bar
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data?.chart_data}>
              {gradients}
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MMM dd')}
              />
              <YAxis 
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorProfit)"
              />
            </AreaChart>
          ) : (
            <ComposedChart data={data?.chart_data}>
              {gradients}
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'MMM dd')}
              />
              <YAxis 
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="url(#colorRevenue)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="profit"
                name="Profit"
                fill="url(#colorProfit)"
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart; 