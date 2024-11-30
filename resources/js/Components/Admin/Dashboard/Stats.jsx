import React from 'react';
import { Card } from '@/Components/ui/card';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const getIcon = (iconName) => {
    const icons = {
      'dollar-sign': DollarSign,
      'shopping-bag': ShoppingBag,
      'users': Users,
      'trending-up': TrendingUp,
      'activity': Activity
    };
    const Icon = icons[iconName] || Activity;
    return Icon;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(stats).map(([key, stat]) => {
        const Icon = getIcon(stat.icon);
        const isPositiveGrowth = stat.growth > 0;

        return (
          <Card key={key} className="p-6">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                key === 'total_revenue' ? 'bg-blue-50 text-blue-600' :
                key === 'total_orders' ? 'bg-green-50 text-green-600' :
                key === 'active_customers' ? 'bg-purple-50 text-purple-600' :
                'bg-orange-50 text-orange-600'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex items-center space-x-1">
                {isPositiveGrowth ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm font-medium ${
                  isPositiveGrowth ? 'text-green-500' : 'text-red-500'
                }`}>
                  {isPositiveGrowth ? '+' : ''}{stat.growth}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              <p className="text-2xl font-semibold mt-1">
                {key === 'total_revenue' ? '$' : ''}{stat.value.toLocaleString()}
                {key === 'avg_order_value' ? '$' : ''}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats; 