import React from 'react';
import { Card } from '@/Components/ui/card';
import { ShoppingBag, Heart, Clock, Star } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, percentage, description }) => {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
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

const CustomerStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Orders"
        value={stats.total_orders}
        icon={ShoppingBag}
        trend="up"
        percentage="12.5"
        description="Lifetime orders"
      />
      <StatCard
        title="Favorite Places"
        value={stats.favorite_restaurants_count}
        icon={Heart}
        description="Saved restaurants"
      />
      <StatCard
        title="Average Order Time"
        value={`${stats.avg_delivery_time}min`}
        icon={Clock}
        trend="down"
        percentage="5.2"
        description="Delivery time"
      />
      <StatCard
        title="Review Score"
        value={stats.avg_rating}
        icon={Star}
        trend="up"
        percentage="2.3"
        description="Average rating given"
      />
    </div>
  );
};

export default CustomerStats; 