"use client";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import React from "react";

export const useToast = () => {
  const showToast = ({
    title,
    description,
    type = "default",
    duration = 15000,
  }) => {
    const getIcon = () => {
      switch (type) {
        case "success":
          return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        case "error":
          return <XCircle className="h-5 w-5 text-red-500" />;
        case "warning":
          return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        case "info":
          return <Info className="h-5 w-5 text-blue-500" />;
        default:
          return null;
      }
    };

    const getStyle = () => {
      const baseStyle = {
        padding: "16px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        maxWidth: "400px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        background: "white",
        border: "1px solid",
        cursor: "pointer",
      };

      switch (type) {
        case "success":
          return {
            ...baseStyle,
            background: "#f0fdf4",
            borderColor: "#86efac",
          };
        case "error":
          return {
            ...baseStyle,
            background: "#fef2f2",
            borderColor: "#fca5a5",
          };
        case "warning":
          return {
            ...baseStyle,
            background: "#fffbeb",
            borderColor: "#fcd34d",
          };
        case "info":
          return {
            ...baseStyle,
            background: "#eff6ff",
            borderColor: "#93c5fd",
          };
        default:
          return {
            ...baseStyle,
            background: "#f9fafb",
            borderColor: "#d1d5db",
          };
      }
    };

    return toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"
            } relative`}
          style={getStyle()}
          onClick={() => toast.dismiss(t.id)}
        >
          <div className="flex items-start space-x-3">
            {getIcon()}
            <div className="flex-1">
              {title && (
                <h4
                  className="font-medium text-sm mb-1"
                  style={{ margin: 0, color: "#374151" }}
                >
                  {title}
                </h4>
              )}
              {description && (
                <p
                  className="text-sm text-gray-600 use-toasts-js 2"
                  style={{ margin: 0, color: "#6B7280" }}
                >
                  {description}
                </p>
              )}
            </div>
          </div>
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss(t.id);
            }}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Close toast"
          >
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ),
      {
        duration,
        position: "top-right",
      }
    );
  };

  // Helper methods for common toast types
  const success = (message, options = {}) =>
    showToast({
      title: "Success",
      description: message,
      type: "success",
      ...options,
    });

  const error = (message, options = {}) =>
    showToast({
      title: "Error",
      description: message,
      type: "error",
      ...options,
    });

  const warning = (message, options = {}) =>
    showToast({
      title: "Warning",
      description: message,
      type: "warning",
      ...options,
    });

  const info = (message, options = {}) =>
    showToast({
      title: "Info",
      description: message,
      type: "info",
      ...options,
    });

  // Promise toast helper
  const promise = (promise, messages = {}, options = {}) =>
    toast.promise(
      promise,
      {
        loading: "Loading...",
        success: messages.success || "Success!",
        error: messages.error || "Error occurred",
      },
      {
        ...options,
        style: getStyle(),
      }
    );

  return {
    toast: showToast,
    success,
    error,
    warning,
    info,
    promise,
    dismiss: toast.dismiss,
    // Additional utility methods
    loading: (message) => toast.loading(message),
    custom: toast.custom,
  };
};

// Add these animations to your tailwind.config.js
// animation: {
//   enter: "slideIn 0.2s ease-out",
//   leave: "slideOut 0.2s ease-in forwards",
// },
// keyframes: {
//   slideIn: {
//     "0%": { transform: "translateX(100%)", opacity: 0 },
//     "100%": { transform: "translateX(0)", opacity: 1 },
//   },
//   slideOut: {
//     "0%": { transform: "translateX(0)", opacity: 1 },
//     "100%": { transform: "translateX(100%)", opacity: 0 },
//   },
// },
