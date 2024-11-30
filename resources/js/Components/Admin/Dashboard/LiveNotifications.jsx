import React, { useEffect, useState } from 'react';
import { Card } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Bell, Check, X } from 'lucide-react';
import Echo from 'laravel-echo';

const NotificationItem = ({ notification, onAction }) => {
  const getTypeStyles = (type) => {
    const styles = {
      order: 'bg-blue-100 text-blue-800',
      alert: 'bg-red-100 text-red-800',
      update: 'bg-green-100 text-green-800',
      default: 'bg-gray-100 text-gray-800'
    };
    return styles[type] || styles.default;
  };

  return (
    <div className="flex items-start space-x-4 p-4 border-b last:border-0">
      <div className={`w-2 h-2 rounded-full mt-2 ${getTypeStyles(notification.type)}`} />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-sm">{notification.title}</p>
            <p className="text-sm text-gray-500">{notification.message}</p>
          </div>
          <Badge variant="outline" className="ml-2">
            {notification.time}
          </Badge>
        </div>
        {notification.actions && (
          <div className="flex space-x-2 mt-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAction(notification.id, 'accept')}
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-600"
              onClick={() => onAction(notification.id, 'reject')}
            >
              <X className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const LiveNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Laravel Echo
    const echo = new Echo({
      broadcaster: 'pusher',
      key: process.env.MIX_PUSHER_APP_KEY,
      cluster: process.env.MIX_PUSHER_APP_CLUSTER,
      forceTLS: true
    });

    // Subscribe to notification channel
    echo.private('notifications')
      .listen('NewNotification', (e) => {
        setNotifications(prev => [e.notification, ...prev]);
      });

    // Fetch initial notifications
    fetchNotifications();

    return () => {
      echo.leave('notifications');
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationAction = async (id, action) => {
    try {
      await fetch(`/api/notifications/${id}/${action}`, { method: 'POST' });
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error('Error handling notification action:', error);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Live Notifications</h3>
          </div>
          <Badge variant="secondary">
            {notifications.length} New
          </Badge>
        </div>
      </div>
      
      <div className="divide-y max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading notifications...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onAction={handleNotificationAction}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No new notifications
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveNotifications; 