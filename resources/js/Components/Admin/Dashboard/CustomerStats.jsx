import React from 'react';
import { Card } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';
import { ShoppingBag, Heart, Clock, Star } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, percentage, description }) => {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">
              {typeof value === 'object' ? value.value : value}
            </h3>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            {percentage && (
              <p className={`text-sm flex items-center space-x-1 ${
                trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                <span>{trend === 'up' ? '↑' : '↓'}</span>
                <span>{percentage}% from last month</span>
              </p>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full scale-150 group-hover:scale-175 transition-transform duration-500" />
            <div className="relative p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:opacity-100 opacity-0 transition-opacity" />
    </Card>
  );
};

const CustomerStats = ({ stats = {}, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={`skeleton-${i}`} className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-[120px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const {
    total_orders = { value: 0, growth: 0 },
    total_spent = { value: 0, growth: 0 },
    avg_order_value = { value: 0, growth: 0 },
    rewards_level = { value: 'Bronze', points: 0 }
  } = stats;

  const statsConfig = [
    {
      key: 'total_orders',
      title: 'Total Orders',
      value: total_orders.value,
      icon: ShoppingBag,
      trend: total_orders.growth >= 0 ? 'up' : 'down',
      percentage: Math.abs(total_orders.growth),
      description: 'Lifetime orders'
    },
    {
      key: 'total_spent',
      title: 'Total Spent',
      value: `$${total_spent.value}`,
      icon: Heart,
      trend: total_spent.growth >= 0 ? 'up' : 'down',
      percentage: Math.abs(total_spent.growth),
      description: 'Total spending'
    },
    {
      key: 'avg_order',
      title: 'Average Order',
      value: `$${avg_order_value.value}`,
      icon: Clock,
      trend: avg_order_value.growth >= 0 ? 'up' : 'down',
      percentage: Math.abs(avg_order_value.growth),
      description: 'Per order value'
    },
    {
      key: 'rewards',
      title: 'Rewards Level',
      value: rewards_level.value,
      icon: Star,
      description: `${rewards_level.points} points earned`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat) => (
        <StatCard
          key={stat.key}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          percentage={stat.percentage}
          description={stat.description}
        />
      ))}
    </div>
  );
};

export default CustomerStats; 