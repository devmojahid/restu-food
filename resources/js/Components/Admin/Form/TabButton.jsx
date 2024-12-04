import React from "react";
import { cn } from "@/lib/utils";

const TabButton = ({ active, icon: Icon, label, onClick, disabled, isCompleted }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onClick?.();
    }}
    disabled={disabled}
    className={cn(
      "relative flex items-center gap-2 p-4 transition-all",
      "w-full sm:w-auto min-w-[120px]",
      "text-sm font-medium rounded-lg",
      "focus:outline-none focus:ring-2 focus:ring-primary/20",
      "border border-gray-200 dark:border-gray-700",
      "hover:scale-105 transition-transform duration-200",
      "flex flex-col sm:flex-row items-center justify-center sm:justify-start",
      active
        ? "bg-primary text-white shadow-lg"
        : isCompleted
        ? "bg-primary/10 text-primary hover:bg-primary/20"
        : "hover:bg-gray-100 dark:hover:bg-gray-800",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    <div className="relative">
      <Icon className="w-5 h-5 mb-1 sm:mb-0 sm:mr-2" />
      {isCompleted && !active && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
    <span className="text-xs sm:text-sm">{label}</span>
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-full" />
    )}
  </button>
);

export default TabButton; 