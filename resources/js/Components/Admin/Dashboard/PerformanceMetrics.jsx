import React from 'react';
import { Card } from '@/Components/ui/card';
import { Progress } from '@/Components/ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, target, progress, trend, change }) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        <span className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {change}%
        </span>
      </div>
      <div className="flex items-baseline mb-2">
        <span className="text-2xl font-bold dark:text-white">{value}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">/ {target}</span>
      </div>
      <Progress value={progress} className="h-2" />
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 inline-block">
        {progress}% of target
      </span>
    </Card>
  );
};

const PerformanceMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Revenue Target"
        value="$8,420"
        target="$10,000"
        progress={84}
        trend="up"
        change={12}
      />
      <MetricCard
        title="Orders Target"
        value="142"
        target="200"
        progress={71}
        trend="up"
        change={8}
      />
      <MetricCard
        title="Customer Satisfaction"
        value="4.6"
        target="5.0"
        progress={92}
        trend="up"
        change={3}
      />
      <MetricCard
        title="Average Response Time"
        value="2.4m"
        target="2.0m"
        progress={83}
        trend="down"
        change={5}
      />
    </div>
  );
};

export default PerformanceMetrics; 