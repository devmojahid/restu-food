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
import RealtimeStats from '@/Components/Admin/Dashboard/RealtimeStats';
import OrdersTable from '@/Components/Admin/Dashboard/OrdersTable';
import AdvancedAnalytics from '@/Components/Admin/Dashboard/AdvancedAnalytics';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Calendar, RefreshCcw, Download } from 'lucide-react';

const AdminDashboard = ({ dashboardData, userRole, permissions }) => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await router.reload({ only: ['dashboardData'] });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <AdminLayout>
      <Head title="Admin Dashboard" />
      
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-gray-500 mt-2">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center"
              disabled={isRefreshing}
            >
              <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <DashboardStats stats={dashboardData.summary_stats} />
        
        {/* Performance Metrics */}
        <PerformanceMetrics metrics={dashboardData.performance_analytics.metrics} />
        
        {/* Revenue Overview and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Revenue & Orders Overview</h2>
                <div className="flex items-center space-x-2">
                  {['daily', 'weekly', 'monthly'].map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <AnalyticsChart 
                data={dashboardData.revenue_overview[
                  timeRange === 'daily' ? 'today' : 
                  timeRange === 'weekly' ? 'weekly' : 'monthly'
                ]}
                timeRange={timeRange}
              />
            </Card>
          </div>
          <div className="space-y-6">
            <QuickActions role={userRole} permissions={permissions} />
            <LiveNotifications />
          </div>
        </div>
        
        {/* Recent Orders and Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentOrders orders={dashboardData.recent_orders} />
          <RecentUsers users={dashboardData.performance_analytics.customers} />
        </div>
        
        {/* Orders Table */}
        <div className="mt-6">
          <OrdersTable orders={dashboardData.recent_orders} />
        </div>
        
        {/* Advanced Analytics */}
        <div className="mt-6">
          <AdvancedAnalytics 
            data={dashboardData.performance_analytics}
            timeRange={timeRange}
          />
        </div>
        
        {/* Realtime Stats */}
        <div className="mt-6">
          <RealtimeStats 
            orders={dashboardData.performance_analytics.orders}
            revenue={dashboardData.performance_analytics.revenue}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 