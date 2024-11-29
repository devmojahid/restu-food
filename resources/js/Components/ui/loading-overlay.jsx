import React from "react";
import { cn } from "@/lib/utils";
import { LoadingAnimation } from "./loading-animation";

const LoadingOverlay = ({
  loading = false,
  children,
  className,
  spinnerVariant = "primary",
  spinnerSize = "md",
  text,
  blur = true,
}) => {
  if (!loading) return children;

  return (
    <div className="relative">
      {children}
      <div
        className={cn(
          "absolute inset-0 z-50",
          blur && "backdrop-blur-sm",
          "bg-background/80",
          "flex items-center justify-center",
          className
        )}
      >
        <LoadingAnimation
          variant={spinnerVariant}
          size={spinnerSize}
          text={text}
        />
      </div>
    </div>
  );
};

export { LoadingOverlay }; 