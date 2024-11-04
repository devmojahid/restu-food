import React, { useState, useEffect } from "react";
import Sidebar from "./Partials/Sidebar/Sidebar";
import Header from "./Partials/Header/Header";
import { Head, usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const { flash } = usePage().props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  // Initialize theme
  useEffect(() => {
    // Check system preference or stored preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme || (isDark ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");

    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle flash messages
  useEffect(() => {
    if (flash.toast) {
      const { type, message } = flash.toast;
      showToast(message, type);
    }

    // Handle direct flash messages
    if (flash.success) showToast(flash.success, "success");
    if (flash.error) showToast(flash.error, "error");
    if (flash.warning) showToast(flash.warning, "warning");
    if (flash.info) showToast(flash.info, "info");
    if (flash.status) showToast(flash.status, "info");
    if (flash.message) showToast(flash.message, "default");
  }, [flash]);

  const showToast = (message, type = "default") => {
    const toastConfig = {
      duration: 5000,
      position: "top-right",
    };

    const getIcon = (type) => {
      switch (type) {
        case "success":
          return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        case "error":
          return <XCircle className="w-5 h-5 text-red-500" />;
        case "warning":
          return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case "info":
          return <Info className="w-5 h-5 text-blue-500" />;
        default:
          return <AlertCircle className="w-5 h-5 text-gray-500" />;
      }
    };

    const getStyle = (type) => {
      switch (type) {
        case "success":
          return {
            background: "#f0fdf4",
            border: "1px solid #86efac",
            color: "#166534",
          };
        case "error":
          return {
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            color: "#991b1b",
          };
        case "warning":
          return {
            background: "#fffbeb",
            border: "1px solid #fcd34d",
            color: "#92400e",
          };
        case "info":
          return {
            background: "#eff6ff",
            border: "1px solid #93c5fd",
            color: "#1e40af",
          };
        default:
          return {
            background: "#f9fafb",
            border: "1px solid #d1d5db",
            color: "#374151",
          };
      }
    };

    toast(message, {
      ...toastConfig,
      icon: getIcon(type),
      style: getStyle(type),
    });
  };

  // Show loading spinner
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
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          className: "dark:bg-gray-800 dark:text-white",
          style: {
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
