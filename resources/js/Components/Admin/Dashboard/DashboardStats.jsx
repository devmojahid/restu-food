import React from 'react';
import { Card } from '@/Components/ui/card';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  Store,
  Star,
  Bike,
  Clock
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, percentage, description }) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
          {percentage && (
            <p className={`text-sm mt-2 flex items-center ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? '↑' : '↓'} {percentage}%
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-full">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

const DashboardStats = ({ timeRange }) => {
  // Dummy data - replace with actual data from backend
  const dummyStats = {
    today: {
      revenue: '$12,450',
      orders: '156',
      customers: '89',
      avgOrderValue: '$79.81',
      restaurants: '24',
      rating: '4.8',
      deliveries: '134',
      avgDeliveryTime: '28 mins'
    },
    week: {
      revenue: '$86,450',
      orders: '1,024',
      customers: '456',
      avgOrderValue: '$84.42',
      restaurants: '32',
      rating: '4.7',
      deliveries: '945',
      avgDeliveryTime: '31 mins'
    },
    month: {
      revenue: '$342,120',
      orders: '4,256',
      customers: '1,845',
      avgOrderValue: '$80.39',
      restaurants: '45',
      rating: '4.6',
      deliveries: '3,987',
      avgDeliveryTime: '32 mins'
    },
    year: {
      revenue: '$4,125,890',
      orders: '52,145',
      customers: '12,456',
      avgOrderValue: '$79.12',
      restaurants: '68',
      rating: '4.7',
      deliveries: '48,234',
      avgDeliveryTime: '30 mins'
    }
  };

  const currentStats = dummyStats[timeRange];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue"
        value={currentStats.revenue}
        icon={DollarSign}
        trend="up"
        percentage="12.5"
        description="Overall earnings"
      />
      <StatCard
        title="Total Orders"
        value={currentStats.orders}
        icon={ShoppingBag}
        trend="up"
        percentage="8.2"
        description="Completed orders"
      />
      <StatCard
        title="Active Customers"
        value={currentStats.customers}
        icon={Users}
        trend="up"
        percentage="5.1"
        description="Unique customers"
      />
      <StatCard
        title="Avg. Order Value"
        value={currentStats.avgOrderValue}
        icon={TrendingUp}
        trend="down"
        percentage="2.3"
        description="Per order"
      />
      <StatCard
        title="Active Restaurants"
        value={currentStats.restaurants}
        icon={Store}
        trend="up"
        percentage="3.8"
        description="Partner restaurants"
      />
      <StatCard
        title="Customer Rating"
        value={currentStats.rating}
        icon={Star}
        trend="up"
        percentage="0.5"
        description="Average rating"
      />
      <StatCard
        title="Deliveries"
        value={currentStats.deliveries}
        icon={Bike}
        trend="up"
        percentage="7.4"
        description="Successful deliveries"
      />
      <StatCard
        title="Avg. Delivery Time"
        value={currentStats.avgDeliveryTime}
        icon={Clock}
        trend="down"
        percentage="4.2"
        description="Per delivery"
      />
    </div>
  );
};

export default DashboardStats; 