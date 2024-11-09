import React from "react";
import { LayoutGrid, Plus, UserPlus, Settings, HelpCircle } from "lucide-react";
import { router } from "@inertiajs/react";

const QuickActionsPanel = ({ quickActionsRef, isOpen, onToggle }) => {
  const quickActions = [
    { 
      icon: Plus, 
      label: 'New Post', 
      description: 'Create a new blog post',
      action: () => router.visit('/admin/posts/create') 
    },
    { 
      icon: UserPlus, 
      label: 'Add User', 
      description: 'Create a new user account',
      action: () => router.visit('/admin/users/create') 
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      description: 'Manage system settings',
      action: () => router.visit('/admin/settings') 
    },
    { 
      icon: HelpCircle, 
      label: 'Help Center', 
      description: 'View documentation and help',
      action: () => window.open('/help', '_blank') 
    },
  ];

  return (
    <div className="relative" ref={quickActionsRef}>
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors duration-200"
        aria-label="Quick actions"
      >
        <LayoutGrid className="h-5 w-5" />
      </button>

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
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/90">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Quick Actions
            </h3>
          </div>

          {/* Actions List */}
          <div className="p-2">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      action.action();
                      onToggle();
                    }}
                    className="flex flex-col items-center p-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors duration-200">
                      <Icon className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200" />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {action.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      {action.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/90">
            <button 
              className="w-full text-sm text-center text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => router.visit('/admin/actions')}
            >
              View all actions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionsPanel; 