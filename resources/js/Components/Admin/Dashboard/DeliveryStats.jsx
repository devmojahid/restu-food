import React from 'react';
import { Card } from '@/Components/ui/card';
import {
  Truck,
  Clock,
  MapPin,
  DollarSign,
  MapPinOff  // Change this line
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, percentage, description, variant = 'default' }) => {
  const variants = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-rose-100 text-rose-800',
  };

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
              <p className={`text-sm flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                <span>{trend === 'up' ? '↑' : '↓'}</span>
                <span>{percentage}% from last period</span>
              </p>
            )}
          </div>
          <div className="relative">
            <div className={`absolute inset-0 rounded-full scale-150 group-hover:scale-175 transition-transform duration-500 ${variants[variant]}`} />
            <div className={`relative p-3 rounded-full group-hover:bg-opacity-20 transition-colors ${variants[variant]}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:opacity-100 opacity-0 transition-opacity" />
    </Card>
  );
};

const DeliveryStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Active Deliveries"
        value={stats.active_deliveries_count}
        icon={Bike}
        trend="up"
        percentage="12.5"
        description="Currently in progress"
        variant="default"
      />
      <StatCard
        title="Total Distance"
        value={`${stats.total_distance_today} km`}
        icon={MapPinOffOff}
        description="Today's coverage"
        variant="success"
      />
      <StatCard
        title="Average Time"
        value={`${stats.avg_delivery_time} min`}
        icon={Clock}
        trend="down"
        percentage="5.2"
        description="Per delivery"
        variant="warning"
      />
      <StatCard
        title="Earnings Today"
        value={`$${stats.earnings_today}`}
        icon={DollarSign}
        trend="up"
        percentage="8.4"
        description="Including tips"
        variant="success"
      />
    </div>
  );
};

export default DeliveryStats; 