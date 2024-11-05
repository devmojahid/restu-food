"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/Components/ui/label";

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef(({ error, ...props }, ref) => {
  return <div ref={ref} aria-invalid={!!error} {...props} />;
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef(
  ({ className, children, error, ...props }, ref) => {
    if (!error && !children) {
      return null;
    }

    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {error || children}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

export { FormItem, FormLabel, FormControl, FormDescription, FormMessage };
