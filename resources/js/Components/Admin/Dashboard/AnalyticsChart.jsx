import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from '@/Components/ui/card';
import { LoadingState } from '@/Components/ui/loading-state';

const AnalyticsChart = ({ data, timeRange }) => {
  if (!data) {
    return <LoadingState message="Loading chart data..." />;
  }

  // Get the correct data array based on timeRange
  const chartData = (() => {
    switch(timeRange) {
      case 'daily':
        return data.hourly_data || [];
      case 'weekly':
        return data.daily_data || [];
      case 'monthly':
        return data.weekly_data || [];
      default:
        return [];
    }
  })();

  // Format the data for the chart
  const formattedData = chartData.map(item => ({
    name: timeRange === 'daily' ? item.hour :
          timeRange === 'weekly' ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }) :
          item.week,
    Revenue: item.revenue,
    Orders: item.orders,
    'Avg Order': item.avg_order_value
  }));

  // Calculate statistics
  const stats = {
    totalRevenue: data.total || 0,
    totalOrders: data.orders || 0,
    growth: data.growth || 0,
    avgOrderValue: formattedData.length > 0 
      ? formattedData.reduce((sum, item) => sum + (item['Avg Order'] || 0), 0) / formattedData.length
      : 0
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between space-x-8 text-sm">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-medium">
                {entry.name === 'Revenue' ? '$' : ''}
                {entry.value.toLocaleString()}
                {entry.name === 'Avg Order' ? '$' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-xl font-semibold">${stats.totalRevenue.toLocaleString()}</p>
          <span className={`text-sm ${stats.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stats.growth >= 0 ? '+' : ''}{stats.growth}%
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-xl font-semibold">{stats.totalOrders.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="text-xl font-semibold">${stats.avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs"
              tick={{ fill: '#6B7280' }}
              tickFormatter={value => `$${value.toLocaleString()}`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              className="text-xs"
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="Revenue"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="Orders"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorOrders)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart; 