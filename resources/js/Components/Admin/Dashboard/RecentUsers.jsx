import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
  Users,
  TrendingUp,
  Star,
  UserPlus,
  Clock,
  ShoppingBag
} from 'lucide-react';
import { Progress } from '@/Components/ui/progress';

const RecentUsers = ({ users = null }) => {
  // Early return for loading/empty state
  if (!users) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Customer Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <p>No customer data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract data from the users object (which is actually customer analytics data)
  const { total, new_today, growth, segments, retention_rate } = users;

  const customerStats = [
    {
      label: 'Total Customers',
      value: total.toLocaleString(),
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      label: 'New Today',
      value: new_today.toLocaleString(),
      icon: UserPlus,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Retention Rate',
      value: `${retention_rate}%`,
      icon: Star,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Customer Overview
          </CardTitle>
          <Badge variant="secondary" className="font-normal flex items-center">
            <TrendingUp className={`w-4 h-4 mr-1 ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={growth >= 0 ? 'text-green-500' : 'text-red-500'}>
              {growth >= 0 ? '+' : ''}{growth}%
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Customer Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {customerStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Customer Segments */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-gray-500">Customer Segments</h3>
          {segments.map((segment, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm font-medium">{segment.name}</span>
                </div>
                <span className="text-sm text-gray-500">{segment.value}%</span>
              </div>
              <Progress 
                value={segment.value} 
                className="h-2"
                style={{ 
                  '--tw-bg-opacity': 1,
                  backgroundColor: segment.color 
                }}
              />
            </div>
          ))}
        </div>

        {/* Additional Metrics */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Avg. Orders</p>
                <p className="font-medium">3.2 per month</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Avg. Lifetime</p>
                <p className="font-medium">8.5 months</p>
              </div>
            </div>
          </div>
        </div>

        {/* View Details Link */}
        <div className="mt-6 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View Detailed Analytics
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentUsers; 