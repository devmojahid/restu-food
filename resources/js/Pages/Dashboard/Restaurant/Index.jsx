import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import RestaurantStats from '@/Components/Admin/Dashboard/RestaurantStats';
import RestaurantOrders from '@/Components/Admin/Dashboard/RestaurantOrders';
import AnalyticsChart from '@/Components/Admin/Dashboard/AnalyticsChart';
import PerformanceMetrics from '@/Components/Admin/Dashboard/PerformanceMetrics';
import QuickActions from '@/Components/Admin/Dashboard/QuickActions';

const RestaurantDashboard = ({ stats, userRole, permissions }) => {
  const [timeRange, setTimeRange] = useState('weekly');

  return (
    <AdminLayout>
      <Head title="Restaurant Dashboard" />
      
      <div className="space-y-6">
        <RestaurantStats stats={stats} />
        
        <PerformanceMetrics />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart 
              title="Sales & Orders Analytics"
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              data={stats.analytics_data}
            />
          </div>
          <div>
            <QuickActions role="restaurant" />
          </div>
        </div>
        
        <RestaurantOrders orders={stats.recent_orders} />
      </div>
    </AdminLayout>
  );
};

export default RestaurantDashboard; 