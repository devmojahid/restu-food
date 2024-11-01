import React from "react";
import { Link } from "@inertiajs/react";
import { X } from "lucide-react";
import SidebarAllLinks from "./SidebarAllLinks";

export default function Sidebar({ sidebarOpen, closeSidebar }) {
  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform 
      lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `}
    >
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/admin/dashboard"
            className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            NextGen
          </Link>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <SidebarAllLinks closeSidebar={closeSidebar} />
        </nav>
      </div>
    </aside>
  );
}
