import React from 'react';
import { Card } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { ArrowUpRight, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const KpiCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  target,
  progress,
  metric = '',
  sparklineData,
  className = '' 
}) => {
  // Convert sparkline data to chart format
  const chartData = sparklineData?.map((value, index) => ({
    value,
    index
  })) || [];

  return (
    <Card className={`p-6 relative overflow-hidden ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold mt-1 dark:text-white">
            {value}
            {metric && <span className="text-sm font-normal ml-1">{metric}</span>}
          </h3>
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>

      {sparklineData && (
        <div className="h-[40px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={trend === 'up' ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background/95 shadow-lg rounded-lg p-2 text-xs border">
                        {payload[0].value}
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {target && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500 dark:text-gray-400">Progress</span>
            <span className="font-medium dark:text-white">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Target: {target}
          </p>
        </div>
      )}

      {change && (
        <div className={`flex items-center mt-4 text-sm ${
          trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          <span className="font-medium">{change}%</span>
          <span className="ml-2">vs last period</span>
        </div>
      )}

      {/* Background decoration */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent -z-10" />
    </Card>
  );
};

export default KpiCard; 