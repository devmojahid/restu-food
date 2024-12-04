import React from "react";
import { cn } from "@/lib/utils";

export const FormSection = ({ title, description, children, className }) => (
  <div className={cn("space-y-6", className)}>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
      {children}
    </div>
  </div>
);

export const FormField = ({ label, required, error, className, children }) => (
  <div className={cn("space-y-2 w-full", className)}>
    {label && (
      <label className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="mt-1">{children}</div>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
); 