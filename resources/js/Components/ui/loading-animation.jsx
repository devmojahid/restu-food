import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const variants = {
  default: "text-primary",
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success-600",
  warning: "text-warning-600",
  danger: "text-danger-600",
  white: "text-white",
};

const sizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
  "2xl": "w-16 h-16"
};

const LoadingAnimation = ({
  variant = "default",
  size = "md",
  className,
  fullScreen = false,
  text,
  showSpinner = true,
  showLogo = false,
  type = "default", // default, button, food
  ...props
}) => {
  const Wrapper = fullScreen ? FullScreenWrapper : React.Fragment;

  const renderLoadingContent = () => {
    switch (type) {
      case "food":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="loading-food-plate">
              <div className="w-16 h-16 relative">
                {/* Plate */}
                <div className="absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700" />
                {/* Food items */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-primary/80" />
              </div>
            </div>
            {text && (
              <div className="text-center">
                <p className={cn("text-base font-medium", variants[variant])}>
                  {text}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please wait while we prepare your request
                </p>
              </div>
            )}
          </div>
        );

      case "button":
        return (
          <div className="flex items-center gap-2">
            <Loader2
              className={cn(
                "animate-spin",
                variants[variant],
                sizes[size],
              )}
            />
            {text && (
              <span className={cn(
                "text-sm font-medium",
                variants[variant]
              )}>
                {text}
              </span>
            )}
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center gap-4">
            {showLogo && (
              <div className="w-16 h-16 mb-4">
                <img 
                  src="/images/logo.png" 
                  alt="Logo"
                  className="w-full h-full object-contain loading-pulse" 
                />
              </div>
            )}
            {showSpinner && (
              <Loader2
                className={cn(
                  "animate-spin",
                  variants[variant],
                  sizes[size],
                )}
              />
            )}
            {text && (
              <div className="text-center">
                <p className={cn(
                  "text-base font-medium",
                  variants[variant]
                )}>
                  {text}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Just a moment...
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <Wrapper>
      <div
        className={cn(
          "flex items-center justify-center",
          fullScreen && "min-h-screen",
          className
        )}
        {...props}
      >
        {renderLoadingContent()}
      </div>
    </Wrapper>
  );
};

const FullScreenWrapper = ({ children }) => (
  <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
    {children}
  </div>
);

export { LoadingAnimation }; 