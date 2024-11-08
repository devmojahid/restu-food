import React from "react";
import { Link } from "@inertiajs/react";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { defaultAvatar } from "@/Constants/images";

const UserMenu = ({ userMenuRef, isOpen, onToggle, user, onLogout }) => {
  const userAvatar = user?.profile_photo_url || defaultAvatar;

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label="User menu"
      >
        <div className="relative">
          <img
            src={userAvatar}
            alt={user?.name}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800"></div>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
          
          <div className="py-1">
            <Link
              href={route("profile.edit")}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <User className="h-4 w-4 mr-3" />
              Your Profile
            </Link>
            
            <Link
              href={route("settings.index")}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Link>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 py-1">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 