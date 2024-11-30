import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { 
  Calendar,
  Download,
  Filter,
  RefreshCcw,
  TrendingUp,
  Package,
  BarChart2,
  DollarSign,
  ShoppingBag,
  Clock
} from 'lucide-react';
import ProductStats from '@/Components/Admin/Dashboard/ProductStats';
import SalesAnalytics from '@/Components/Admin/Products/SalesAnalytics';
import TopProducts from '@/Components/Admin/Products/TopProducts';
import CategoryPerformance from '@/Components/Admin/Products/CategoryPerformance';
import { LoadingState } from '@/Components/ui/loading-state';
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastViewport } from "@/Components/ui/toast";

const EcommerceReport = ({ stats: initialStats, userRole, permissions }) => {
  const [timeRange, setTimeRange] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('overview');
  const [stats, setStats] = useState(initialStats);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (title, description, variant = "default") => {
    const id = Date.now();
    setToasts(current => [...current, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id));
    }, 5000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/products/stats?timeRange=${timeRange}`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        throw new Error(data.message || 'Error fetching stats');
      }
    } catch (error) {
      console.error('Error refreshing stats:', error);
      addToast('Error', error.message, 'destructive');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    handleRefresh().catch(err => {
      setError(err.message);
      console.error('Error in useEffect:', err);
    });
  }, [timeRange]);

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  return (
    <AdminLayout>
      <Head title="E-commerce Reports" />

      <ToastProvider>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <Package className="w-8 h-8 mr-3" />
                E-commerce Reports
              </h1>
              <p className="text-gray-500 mt-2">
                Comprehensive analysis of your product performance and sales metrics
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
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Time Range Filter */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div className="flex space-x-2">
                  {['today', 'week', 'month', 'quarter', 'year'].map((range) => (
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

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 ml-auto">
                <span className="text-sm text-gray-500">View:</span>
                <div className="flex space-x-2">
                  {['overview', 'detailed', 'analytics'].map((mode) => (
                    <Button
                      key={mode}
                      variant={viewMode === mode ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode(mode)}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Overview */}
          <ProductStats stats={stats} timeRange={timeRange} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Analytics */}
            <Card className="lg:col-span-2">
              <SalesAnalytics 
                data={stats.sales_data} 
                isLoading={isRefreshing}
              />
            </Card>

            {/* Top Products */}
            <TopProducts 
              products={stats.top_products} 
              isLoading={isRefreshing}
            />

            {/* Category Performance */}
            <CategoryPerformance 
              data={stats.category_performance}
              isLoading={isRefreshing}
            />
          </div>

          {/* Additional Reports Section */}
          {viewMode === 'detailed' && (
            <div className="space-y-6">
              {/* Add detailed reports components */}
            </div>
          )}

          {viewMode === 'analytics' && (
            <div className="space-y-6">
              {/* Add advanced analytics components */}
            </div>
          )}
        </div>

        {toasts.map(toast => (
          <Toast key={toast.id} variant={toast.variant}>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </AdminLayout>
  );
};

export default EcommerceReport; 