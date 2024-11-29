import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import RestaurantStats from '@/Components/Admin/Dashboard/RestaurantStats';
import RestaurantOrders from '@/Components/Admin/Dashboard/RestaurantOrders';
import AnalyticsChart from '@/Components/Admin/Dashboard/AnalyticsChart';
import PerformanceMetrics from '@/Components/Admin/Dashboard/PerformanceMetrics';
import QuickActions from '@/Components/Admin/Dashboard/QuickActions';

const CustomerDashboard = ({ stats, userRole, permissions }) => {
  const [timeRange, setTimeRange] = useState('weekly');

  return (
    <AdminLayout>
      <Head title="Customer Dashboard" />

    </AdminLayout>
  );
};

export default CustomerDashboard; 