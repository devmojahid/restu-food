import React, { useState } from 'react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Head } from '@inertiajs/react';
import CustomerStats from '@/Components/Admin/Dashboard/CustomerStats';
import CustomerOrders from '@/Components/Admin/Dashboard/CustomerOrders';
import CustomerAnalytics from '@/Components/Admin/Dashboard/CustomerAnalytics';
import FavoriteRestaurants from '@/Components/Admin/Dashboard/FavoriteRestaurants';
import OrderTimeline from '@/Components/Admin/Dashboard/OrderTimeline';
import QuickActions from '@/Components/Admin/Dashboard/QuickActions';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import Progress from '@/Components/ui/progress';
import { format } from 'date-fns';
import {
  Store,
  ShoppingBag,
  Heart,
  Star,
  TrendingUp,
  Award,
  Gift
} from 'lucide-react';

const CustomerDashboard = ({ stats, userRole, permissions }) => {
  const [timeRange, setTimeRange] = useState('weekly');

  // Enhanced quick actions with icons and descriptions
  const customerQuickActions = [
    {
      label: 'Browse Restaurants',
      href: '/restaurants',
      icon: Store,
      description: 'Explore new places to eat'
    },
    {
      label: 'My Orders',
      href: '/orders',
      icon: ShoppingBag,
      description: 'View your order history'
    },
    {
      label: 'Favorite Places',
      href: '/favorites',
      icon: Heart,
      description: 'Manage your favorite restaurants'
    },
    {
      label: 'My Reviews',
      href: '/reviews',
      icon: Star,
      description: 'See your restaurant reviews'
    },
    {
      label: 'Rewards',
      href: '/rewards',
      icon: Gift,
      description: 'Check your reward points'
    }
  ];

  return (
    <AdminLayout>
      <Head title="Customer Dashboard" />
      
      <div className="space-y-6">
        {/* Customer Stats Overview */}
        <CustomerStats stats={stats} />
        
        {/* Analytics and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CustomerAnalytics 
              title="Your Order History"
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              data={stats.analytics_data}
              stats={stats}
            />
          </div>
          <div className="space-y-6">
            <QuickActions 
              role="customer" 
              actions={customerQuickActions}
            />
            
            {/* Enhanced Rewards Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Rewards Points</h3>
                  <p className="text-sm text-gray-500">Current Tier: {getTierName(stats.rewards_points)}</p>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  {stats.rewards_points || 0} Points
                </Badge>
              </div>
              
              <Progress 
                value={(stats.rewards_points || 0) % 100} 
                className="mb-2"
              />
              
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Next Reward:</span>
                  <span className="font-medium">
                    {100 - ((stats.rewards_points || 0) % 100)} points needed
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Earned {stats.points_this_month || 0} points this month</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <Award className="w-4 h-4" />
                  <span>{getNextTierPoints(stats.rewards_points)} points to next tier</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Orders and Favorites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomerOrders 
            orders={stats.recent_orders} 
            showViewAll={true}
          />
          <FavoriteRestaurants 
            restaurants={stats.favorite_restaurants}
            showViewAll={true}
          />
        </div>
        
        {/* Order Timeline */}
        <div className="mt-6">
          <OrderTimeline 
            orders={stats.recent_orders}
            showDetails={true}
          />
        </div>

        {/* Recent Activity with Enhanced UI */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recent_activity?.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(activity.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                  {activity.metadata && (
                    <div className="mt-2 text-sm text-gray-600">
                      {renderActivityMetadata(activity)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

// Helper functions for enhanced features
const getTierName = (points) => {
  if (points >= 1000) return 'Diamond';
  if (points >= 500) return 'Platinum';
  if (points >= 200) return 'Gold';
  if (points >= 100) return 'Silver';
  return 'Bronze';
};

const getNextTierPoints = (points) => {
  if (points < 100) return 100 - points;
  if (points < 200) return 200 - points;
  if (points < 500) return 500 - points;
  if (points < 1000) return 1000 - points;
  return 0;
};

const getActivityIcon = (type) => {
  const icons = {
    order: <ShoppingBag className="w-4 h-4 text-primary" />,
    review: <Star className="w-4 h-4 text-primary" />,
    reward: <Gift className="w-4 h-4 text-primary" />,
    favorite: <Heart className="w-4 h-4 text-primary" />
  };
  return icons[type] || <Activity className="w-4 h-4 text-primary" />;
};

const renderActivityMetadata = (activity) => {
  switch (activity.type) {
    case 'order':
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{activity.metadata.status}</Badge>
          <span>{activity.metadata.items} items</span>
          <span>•</span>
          <span>{activity.metadata.total}</span>
        </div>
      );
    case 'review':
      return (
        <div className="flex items-center space-x-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < activity.metadata.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      );
    default:
      return null;
  }
};

export default CustomerDashboard; 