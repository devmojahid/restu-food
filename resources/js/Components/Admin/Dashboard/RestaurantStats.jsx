import React from 'react';
import { Card } from '@/Components/ui/card';
import { ShoppingBag, DollarSign, Clock, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, percentage }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold mt-1 dark:text-white">{value}</h3>
          {percentage && (
            <p className={`text-sm mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? '+' : '-'}{percentage}% from last month
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

const RestaurantStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Orders"
        value={stats.orders}
        icon={ShoppingBag}
        trend="up"
        percentage="12.5"
      />
      <StatCard
        title="Total Revenue"
        value={`$${stats.revenue?.toFixed(2)}`}
        icon={DollarSign}
        trend="up"
        percentage="8.2"
      />
      <StatCard
        title="Pending Orders"
        value={stats.pending_orders}
        icon={Clock}
        trend="down"
        percentage="3.1"
      />
      <StatCard
        title="Average Order Value"
        value={`$${(stats.revenue / stats.orders || 0).toFixed(2)}`}
        icon={TrendingUp}
        trend="up"
        percentage="5.3"
      />
    </div>
  );
};

export default RestaurantStats; 