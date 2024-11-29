import React from 'react';
import { Card } from '@/Components/ui/card';
import { Users, ShoppingBag, Store, FileText } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
        </div>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Users"
        value={stats.users}
        icon={Users}
      />
      <StatCard
        title="Total Orders"
        value={stats.orders}
        icon={ShoppingBag}
      />
      <StatCard
        title="Restaurants"
        value={stats.restaurants}
        icon={Store}
      />
      <StatCard
        title="Blog Posts"
        value={stats.blogs}
        icon={FileText}
      />
    </div>
  );
};

export default DashboardStats; 