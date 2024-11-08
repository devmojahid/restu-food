import React from "react";
import { Link } from "@inertiajs/react";
import { X } from "lucide-react";
import SidebarAllLinks from "./SidebarAllLinks";

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform 
        lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out
        flex flex-col h-full
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link
          href={route("dashboard")}
          className="flex items-center space-x-2"
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            NextGen
          </span>
        </Link>
        <button
          onClick={closeSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <SidebarAllLinks closeSidebar={closeSidebar} />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              System Status: Online
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
