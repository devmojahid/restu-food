import React, { useEffect, useState } from 'react';
import { Card } from '@/Components/ui/card';
import { Bell, X, CheckCircle, AlertCircle } from 'lucide-react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const LiveNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize Laravel Echo
    window.Pusher = Pusher;
    
    const echo = new Echo({
      broadcaster: 'pusher',
      key: import.meta.env.VITE_PUSHER_APP_KEY,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
      encrypted: true,
      enabledTransports: ['ws', 'wss'],
    });

    // Connection status handling
    echo.connector.pusher.connection.bind('connected', () => {
      setIsConnected(true);
    });

    echo.connector.pusher.connection.bind('disconnected', () => {
      setIsConnected(false);
    });

    // Listen for various notification types
    echo.private('notifications')
      .listen('NewOrder', (e) => {
        addNotification({
          type: 'order',
          message: `New order #${e.order.id} received`,
          time: new Date(),
          priority: 'high'
        });
      })
      .listen('OrderStatusChanged', (e) => {
        addNotification({
          type: 'status',
          message: `Order #${e.order.id} status changed to ${e.order.status}`,
          time: new Date(),
          priority: 'medium'
        });
      })
      .listen('LowStockAlert', (e) => {
        addNotification({
          type: 'inventory',
          message: `Low stock alert: ${e.product.name}`,
          time: new Date(),
          priority: 'high'
        });
      })
      .listen('CustomerFeedback', (e) => {
        addNotification({
          type: 'feedback',
          message: `New feedback received from ${e.customer.name}`,
          time: new Date(),
          priority: 'medium'
        });
      });

    return () => {
      echo.disconnect();
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev].slice(0, 10);
      // Play sound for high priority notifications
      if (notification.priority === 'high') {
        playNotificationSound();
      }
      return newNotifications;
    });
  };

  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const getNotificationStyle = (type) => {
    const styles = {
      order: 'bg-blue-50 dark:bg-blue-900/50',
      status: 'bg-green-50 dark:bg-green-900/50',
      inventory: 'bg-red-50 dark:bg-red-900/50',
      feedback: 'bg-purple-50 dark:bg-purple-900/50'
    };
    return styles[type] || 'bg-gray-50 dark:bg-gray-800';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Live Notifications
        </h3>
        <div className="flex items-center">
          {isConnected ? (
            <span className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Connected
            </span>
          ) : (
            <span className="flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              Disconnected
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {notifications.map((notification, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-3 rounded-lg ${getNotificationStyle(notification.type)} transition-all duration-200 hover:scale-[1.02]`}
          >
            <div>
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(notification.time).toLocaleTimeString()}
              </p>
            </div>
            <button 
              onClick={() => removeNotification(index)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {notifications.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No new notifications
          </p>
        )}
      </div>
    </Card>
  );
};

export default LiveNotifications; 