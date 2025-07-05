import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import DashboardStats from '@/Components/Admin/Dashboard/DashboardStats';
import RevenueChart from '@/Components/Admin/Dashboard/RevenueChart';
import OrdersOverview from '@/Components/Admin/Dashboard/OrdersOverview';
// import LiveOrders from '@/Components/Admin/Dashboard/LiveOrders';
// import RestaurantPerformance from '@/Components/Admin/Dashboard/RestaurantPerformance';
import CustomerInsights from '@/Components/Admin/Dashboard/CustomerInsights';
// import DeliveryMetrics from '@/Components/Admin/Dashboard/DeliveryMetrics';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import {
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Settings,
  Download,
  RefreshCcw
} from 'lucide-react';

const AdminDashboard = ({ dashboardData = {}, userRole, permissions }) => {
  const [timeRange, setTimeRange] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = dashboardData?.summary_stats || {
    total_revenue: {
      value: 0,
      growth: 0,
      label: 'Total Revenue',
      icon: 'dollar-sign'
    },
    total_orders: {
      value: 0,
      growth: 0,
      label: 'Total Orders',
      icon: 'shopping-bag'
    },
    active_customers: {
      value: 0,
      growth: 0,
      label: 'Active Customers',
      icon: 'users'
    },
    avg_order_value: {
      value: 0,
      growth: 0,
      label: 'Average Order Value',
      icon: 'trending-up'
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await router.reload({ only: ['stats'] });
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
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
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
            <Button
              variant="outline"
              onClick={() => {/* Add export logic */ }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Time Range Filter */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex space-x-2">
                {['today', 'week', 'month', 'year'].map((range) => (
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
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Stats Overview */}
        {/* <DashboardStats stats={dashboardData?.summary_stats || {
          total_revenue: {
            value: 0,
            growth: 0,
            label: 'Total Revenue',
            icon: 'dollar-sign'
          },
          total_orders: {
            value: 0,
            growth: 0,
            label: 'Total Orders',
            icon: 'shopping-bag'
          },
          active_customers: {
            value: 0,
            growth: 0,
            label: 'Active Customers',
            icon: 'users'
          },
          avg_order_value: {
            value: 0,
            growth: 0,
            label: 'Average Order Value',
            icon: 'trending-up'
          }
        }} timeRange={timeRange} /> */}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <RevenueChart data={stats.revenue_data} timeRange={timeRange} />
          </Card>

          {/* Orders Overview */}
          <Card>
            <OrdersOverview data={stats.orders_overview} />
          </Card>

          {/* Live Orders */}
          {/* <Card>
            <LiveOrders orders={stats.live_orders} />
          </Card> */}
        </div>

        {/* Restaurant & Customer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Restaurant Performance */}
          {/* <Card className="lg:col-span-2">
            <RestaurantPerformance data={stats.restaurant_performance} />
          </Card> */}

          {/* Customer Insights */}
          <Card>
            <CustomerInsights data={stats.customer_insights} />
          </Card>
        </div>

        {/* Delivery Metrics */}
        <Card>
          {/* <DeliveryMetrics data={stats.delivery_metrics} timeRange={timeRange} /> */}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
