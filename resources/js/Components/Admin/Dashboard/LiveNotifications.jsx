import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { 
  Bell, 
  ShoppingBag, 
  User, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const LiveNotifications = () => {
  // Dummy notifications data
  const notifications = [
    {
      id: 1,
      type: 'order',
      message: 'New order received',
      time: '2 minutes ago',
      status: 'new',
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      type: 'user',
      message: 'New customer registration',
      time: '5 minutes ago',
      status: 'info',
      icon: User,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      type: 'alert',
      message: 'Low stock warning',
      time: '10 minutes ago',
      status: 'warning',
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-600'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
      info: { color: 'bg-green-100 text-green-800', label: 'Info' },
      warning: { color: 'bg-yellow-100 text-yellow-800', label: 'Warning' }
    };

    const config = statusConfig[status] || statusConfig.info;

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Live Notifications
          </CardTitle>
          <Badge variant="secondary">
            {notifications.length} new
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-full ${notification.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-1">
                      <Clock className="w-3 h-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(notification.status)}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-gray-500">
            <Bell className="w-12 h-12 mb-4 opacity-50" />
            <p>No new notifications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveNotifications; 