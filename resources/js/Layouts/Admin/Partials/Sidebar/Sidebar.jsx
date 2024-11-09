import React from "react";
import { Link } from "@inertiajs/react";
import { X, Activity } from "lucide-react";
import SidebarAllLinks from "./SidebarAllLinks";

const Sidebar = ({ sidebarOpen, closeSidebar, isMobile }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile 
            ? 'fixed inset-y-0 left-0 z-50' 
            : 'fixed inset-y-0 left-0 z-30'
          }
          w-64 bg-white dark:bg-gray-900
          transition-all duration-300 ease-in-out
          border-r border-gray-200 dark:border-gray-700
          shadow-lg
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <Link
            href={route("dashboard")}
            className="flex items-center space-x-3"
          >
            <div className="relative flex-shrink-0">
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NextGen
            </span>
          </Link>

          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <SidebarAllLinks 
              closeSidebar={isMobile ? closeSidebar : undefined} 
            />
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75"></div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  System Online
                </span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">v1.0.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
