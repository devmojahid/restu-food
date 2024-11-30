import React from 'react';
import { Card } from '@/Components/ui/card';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter
} from 'recharts';
import { format } from 'date-fns';

const AdvancedAnalytics = ({ data }) => {
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
                {entry.name}: {entry.name.includes('Revenue') 
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
      <h2 className="text-xl font-semibold mb-6">Advanced Performance Analytics</h2>
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
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
            <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'MMM dd')}
              scale="time"
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={formatCurrency}
              label={{ value: 'Revenue', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              label={{ value: 'Orders', angle: 90, position: 'insideRight' }}
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
            <Bar
              yAxisId="right"
              dataKey="orders"
              name="Orders"
              barSize={20}
              fill="#82ca9d"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="visitors"
              name="Visitors"
              stroke="#ff7300"
              dot={false}
            />
            <Scatter
              yAxisId="right"
              dataKey="conversion_rate"
              name="Conversion Rate"
              fill="red"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Analytics Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <InsightCard
          title="Peak Revenue Day"
          value={formatCurrency(Math.max(...data.map(d => d.revenue)))}
          description="Highest daily revenue"
          trend="up"
        />
        <InsightCard
          title="Best Converting Day"
          value={`${Math.max(...data.map(d => d.conversion_rate))}%`}
          description="Highest conversion rate"
          trend="up"
        />
        <InsightCard
          title="Most Active Day"
          value={Math.max(...data.map(d => d.visitors))}
          description="Peak visitor count"
          trend="up"
        />
        <InsightCard
          title="Average Order Value"
          value={formatCurrency(
            data.reduce((acc, curr) => acc + curr.revenue, 0) / 
            data.reduce((acc, curr) => acc + curr.orders, 0)
          )}
          description="Per order average"
          trend="up"
        />
      </div>
    </Card>
  );
};

const InsightCard = ({ title, value, description, trend }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    <div className={`flex items-center mt-2 text-sm ${
      trend === 'up' ? 'text-green-600' : 'text-red-600'
    }`}>
      {trend === 'up' ? '↑' : '↓'}
      <span className="ml-1">vs. previous period</span>
    </div>
  </div>
);

export default AdvancedAnalytics; 