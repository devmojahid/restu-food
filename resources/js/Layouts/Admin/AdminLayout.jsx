import React, { useState, useEffect } from "react";
import Sidebar from "./Partials/Sidebar/Sidebar";
import Header from "./Partials/Header/Header";
import { Head, usePage } from "@inertiajs/react";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [theme]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="w-16 h-16 relative">
          <div className="w-16 h-16 border-4 border-white border-solid rounded-full animate-spin border-t-transparent"></div>
          <div className="w-16 h-16 border-4 border-white border-dotted rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
      <div
        className={`flex h-screen overflow-hidden bg-gradient-to-br ${
          theme === "light"
            ? "from-blue-50 to-purple-50"
            : "from-gray-900 to-blue-900"
        } transition-colors duration-500`}
      >
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <Sidebar
            sidebarOpen={sidebarOpen}
            closeSidebar={() => setSidebarOpen(false)}
          />
        </aside>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header
            toggleSidebar={toggleSidebar}
            toggleTheme={toggleTheme}
            theme={theme}
          />
          <main
            className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 p-2 transition-colors duration-500"
            style={{ backgroundColor: "#F6F8FB" }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
