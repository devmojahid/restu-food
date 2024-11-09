import React from "react";
import { Bell, Check, X } from "lucide-react";

const NotificationPanel = ({ notificationRef, isOpen, onToggle }) => {
  // Mock notifications - in real app, this would come from props or API
  const notifications = [
    {
      id: 1,
      title: "New Update Available",
      message: "A new software update is available for download.",
      time: "5m ago",
      isRead: false,
      type: "update",
    },
    {
      id: 2,
      title: "Welcome to Dashboard",
      message: "Thank you for joining our platform.",
      time: "1h ago",
      isRead: true,
      type: "info",
    },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={notificationRef}>
      {/* Notification Button */}
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200 relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
        )}
      </button>
      
      {/* Notification Panel */}
      {isOpen && (
        <div 
          className={`
            fixed inset-x-0 top-[3.5rem] mx-auto sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2
            w-full sm:w-80 max-w-lg
            bg-white dark:bg-gray-800 
            rounded-b-lg sm:rounded-lg 
            shadow-lg 
            border-t sm:border border-gray-200 dark:border-gray-700 
            overflow-hidden
            z-50
          `}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/90">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              onClick={() => {/* Handle mark all as read */}}
            >
              Mark all read
            </button>
          </div>
          
          {/* Notifications List */}
          <div 
            className="overflow-y-auto overscroll-contain"
            style={{ 
              maxHeight: 'calc(100vh - 12rem)',
              height: notifications.length === 0 ? 'auto' : '400px'
            }}
          >
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`
                      relative px-4 py-3 
                      hover:bg-gray-50 dark:hover:bg-gray-700/50 
                      transition-colors duration-200
                      ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start space-x-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button 
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            onClick={() => {/* Handle mark as read */}}
                          >
                            <Check className="h-4 w-4 text-gray-400 hover:text-blue-500" />
                          </button>
                        )}
                        <button 
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                          onClick={() => {/* Handle dismiss */}}
                        >
                          <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No notifications yet
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/90">
            <button 
              className="w-full text-sm text-center text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => {/* Handle view all */}}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel; 