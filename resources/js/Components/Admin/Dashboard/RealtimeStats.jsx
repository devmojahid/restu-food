import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
  Activity,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag
} from 'lucide-react';

const RealtimeStats = ({ orders = null, revenue = null }) => {
  if (!orders || !revenue) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Realtime Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
            <Activity className="w-12 h-12 mb-4 opacity-50" />
            <p>No realtime data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: 'Current Orders',
      value: orders.total || 0,
      growth: orders.growth || 0,
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Today\'s Revenue',
      value: revenue.total || 0,
      growth: revenue.growth || 0,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
      isCurrency: true
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Realtime Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.growth >= 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{stat.title}</span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={`flex items-center ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {isPositive ? '+' : ''}{stat.growth}%
                  </Badge>
                </div>
                <p className="text-2xl font-semibold">
                  {stat.isCurrency ? '$' : ''}
                  {stat.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeStats; 