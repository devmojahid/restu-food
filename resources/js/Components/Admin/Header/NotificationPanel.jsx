import React from "react";
import { Bell } from "lucide-react";

const NotificationPanel = ({ notificationRef, isOpen, onToggle }) => {
  // Mock notifications - in real app, this would come from props or API
  const notifications = [
    {
      id: 1,
      title: "New Update Available",
      message: "A new software update is available for download.",
      time: "5m ago",
      isRead: false,
    },
    {
      id: 2,
      title: "Welcome to Dashboard",
      message: "Thank you for joining our platform.",
      time: "1h ago",
      isRead: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={notificationRef}>
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
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 ${
                  !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.title}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
              </div>
            ))}
          </div>
          
          {notifications.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel; 