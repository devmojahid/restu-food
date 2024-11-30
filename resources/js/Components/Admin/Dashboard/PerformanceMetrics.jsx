import React, { useState } from 'react';
import { Card } from '@/Components/ui/card';
import { LoadingOverlay } from '@/Components/ui/loading-overlay';
import KpiCard from './KpiCard';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Clock,
  DollarSign
} from 'lucide-react';

const PerformanceMetrics = ({ data, loading }) => {
  const [timeRange, setTimeRange] = useState('weekly');

  const metrics = [
    {
      title: "Customer Satisfaction",
      value: "98%",
      change: "+2.1",
      trend: "up",
      icon: Users,
      target: "99%",
      progress: 98,
      sparklineData: [65, 74, 85, 82, 90, 95, 98]
    },
    {
      title: "Average Order Time",
      value: "24m",
      change: "-5.2",
      trend: "down",
      icon: Clock,
      target: "20m",
      progress: 80,
      sparklineData: [30, 28, 26, 24, 25, 24, 24]
    },
    {
      title: "Revenue per Order",
      value: "$42.50",
      change: "+8.1",
      trend: "up",
      icon: DollarSign,
      target: "$45.00",
      progress: 85,
      sparklineData: [35, 38, 40, 39, 41, 42, 42.5]
    },
    {
      title: "Order Completion Rate",
      value: "95%",
      change: "+1.2",
      trend: "up",
      icon: ShoppingCart,
      target: "98%",
      progress: 95,
      sparklineData: [90, 92, 93, 94, 94, 95, 95]
    }
  ];

  return (
    <LoadingOverlay loading={loading} text="Updating metrics...">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <KpiCard
            key={index}
            {...metric}
          />
        ))}
      </div>
    </LoadingOverlay>
  );
};

export default PerformanceMetrics; 