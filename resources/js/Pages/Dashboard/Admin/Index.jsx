import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import DashboardStats from '@/Components/Admin/Dashboard/Stats';
import RecentOrders from '@/Components/Admin/Dashboard/RecentOrders';
import RecentUsers from '@/Components/Admin/Dashboard/RecentUsers';
import AnalyticsChart from '@/Components/Admin/Dashboard/AnalyticsChart';
import PerformanceMetrics from '@/Components/Admin/Dashboard/PerformanceMetrics';
import QuickActions from '@/Components/Admin/Dashboard/QuickActions';
import LiveNotifications from '@/Components/Admin/Dashboard/LiveNotifications';

const AdminDashboard = ({ stats, userRole, permissions }) => {
  const [timeRange, setTimeRange] = useState('weekly');

  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />
      
      <div className="space-y-6">
        <DashboardStats stats={stats} />
        
        <PerformanceMetrics />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart 
              title="Revenue & Orders Overview"
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              data={stats.analytics_data}
            />
          </div>
          <div className="space-y-6">
            <QuickActions role="admin" />
            {/* <LiveNotifications /> */}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentOrders orders={stats.recent_orders} />
          <RecentUsers users={stats.recent_users} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 