"use client";
import * as React from "react";
import { Toaster as Sonner } from "sonner";
import { createContext } from "react";

export const ToastContext = createContext({
  toast: () => {},
});

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const toast = React.useCallback(
    ({ title, description, variant = "default", duration = 5000 }) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = {
        id,
        title,
        description,
        variant,
        duration,
      };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Sonner
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          },
        }}
      />
    </ToastContext.Provider>
  );
};

export { ToastProvider };
