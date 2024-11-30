import React from 'react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { format } from 'date-fns';
import { 
  TrendingUp, 
  Clock, 
  Bike,
  DollarSign,
  Route,
  Star
} from 'lucide-react';

const DeliveryAnalytics = ({ data, timeRange, onTimeRangeChange }) => {
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border">
          <p className="font-medium mb-2">
            {format(new Date(label), 'MMM dd, HH:mm')}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-400">
                {entry.name}: {
                  entry.name.includes('Time') 
                    ? formatTime(entry.value)
                    : entry.name.includes('Earnings') 
                    ? `$${entry.value}`
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

  const gradients = (
    <defs>
      <linearGradient id="colorDeliveries" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
      </linearGradient>
      <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
      </linearGradient>
    </defs>
  );

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Delivery Analytics
          </h2>
          <p className="text-sm text-gray-500 mt-1">Performance metrics and trends</p>
        </div>
        <div className="flex space-x-2">
          {['today', 'week', 'month'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Deliveries & Earnings Chart */}
      <div className="h-[300px] mb-6">
        <h3 className="text-sm font-medium mb-4 flex items-center">
          <Bike className="w-4 h-4 mr-2" />
          Deliveries & Earnings
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data?.performance}>
            {gradients}
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              stroke="#888888"
            />
            <YAxis 
              yAxisId="left" 
              stroke="#888888"
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#888888"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="deliveries"
              name="Deliveries"
              fill="url(#colorDeliveries)"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="earnings"
              name="Earnings"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Delivery Time Analysis */}
      <div className="h-[300px]">
        <h3 className="text-sm font-medium mb-4 flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Delivery Time Analysis
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data?.timing}>
            {gradients}
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              stroke="#888888"
            />
            <YAxis 
              tickFormatter={(value) => `${value}m`}
              stroke="#888888"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="avg_time"
              name="Average Time"
              stroke="#ffc658"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTime)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <MetricCard
          title="On-Time Rate"
          value={`${data?.metrics?.on_time_rate}%`}
          icon={Clock}
          trend="up"
          change="+2.5%"
        />
        <MetricCard
          title="Customer Rating"
          value={data?.metrics?.avg_rating}
          icon={Star}
          trend="up"
          change="+0.3"
        />
        <MetricCard
          title="Efficiency Score"
          value={`${data?.metrics?.efficiency_score}%`}
          icon={TrendingUp}
          trend="up"
          change="+4.2%"
        />
      </div>
    </Card>
  );
};

const MetricCard = ({ title, value, icon: Icon, trend, change }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <Icon className="w-5 h-5 text-gray-400" />
      <span className={`text-sm ${
        trend === 'up' ? 'text-green-600' : 'text-red-600'
      }`}>
        {change}
      </span>
    </div>
    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h4>
    <p className="text-2xl font-semibold mt-1">{value}</p>
  </div>
);

export default DeliveryAnalytics; 