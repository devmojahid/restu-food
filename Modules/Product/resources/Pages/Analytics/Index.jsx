import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  BarChart2,
  TrendingUp,
  Calendar,
  Download,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  DollarSign,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';

const AnalyticsCard = ({ title, value, trend, percentage, icon: Icon, description }) => (
  <Card className="p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        {percentage && (
          <div className={`flex items-center mt-2 text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {percentage}%
          </div>
        )}
      </div>
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  </Card>
);

const ProductAnalytics = ({ analyticsData, timeRange }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await router.reload({ only: ['analyticsData'] });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <AdminLayout>
      <Head title="Product Analytics" />

      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <BarChart2 className="w-8 h-8 mr-3" />
              Product Analytics
            </h1>
            <p className="text-gray-500 mt-2">
              Advanced analytics and insights for your products
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
              onClick={() => {/* Add export logic */}}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Time Range Filter */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex space-x-2">
                {['today', 'week', 'month', 'quarter', 'year'].map((range) => (
                  <Button
                    key={range}
                    variant={selectedTimeRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeRange(range)}
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

        {/* Sales Forecast Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title="Predicted Revenue"
            value={formatCurrency(analyticsData?.forecasts?.sales_forecast?.predicted_revenue)}
            trend="up"
            percentage={analyticsData?.forecasts?.sales_forecast?.growth_rate}
            icon={DollarSign}
            description="Next period forecast"
          />
          <AnalyticsCard
            title="Predicted Units"
            value={analyticsData?.forecasts?.sales_forecast?.predicted_units?.toLocaleString()}
            trend="up"
            percentage={analyticsData?.forecasts?.sales_forecast?.growth_rate}
            icon={Package}
            description="Expected sales volume"
          />
          <AnalyticsCard
            title="Confidence Score"
            value={`${analyticsData?.forecasts?.sales_forecast?.confidence_score}%`}
            icon={TrendingUp}
            description="Forecast accuracy"
          />
          <AnalyticsCard
            title="Stock Risk"
            value={analyticsData?.forecasts?.inventory_forecast?.stockout_risks?.length || '0'}
            icon={AlertTriangle}
            trend="down"
            percentage="15"
            description="Products at risk"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Sales Trend</h2>
              <Badge variant="outline">
                {selectedTimeRange.toUpperCase()}
              </Badge>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData?.trends?.sales_trend || []}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Category Distribution */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Category Distribution</h2>
              <Badge variant="outline">
                Revenue Share
              </Badge>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData?.trends?.category_trend || []}
                    dataKey="total_revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                  >
                    {(analyticsData?.trends?.category_trend || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performing Products */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-xl font-semibold mb-6">Top Performing Products</h2>
            <div className="space-y-4">
              {(analyticsData?.insights?.top_performing || []).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.total_quantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.total_revenue)}</p>
                    <p className="text-sm text-green-600">Avg. {formatCurrency(product.avg_price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Recommendations</h2>
            <div className="space-y-4">
              {(analyticsData?.insights?.recommendations?.pricing_recommendations || []).map((rec, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                  <div className="mt-2">
                    <Badge variant="outline">{rec.impact}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductAnalytics; 