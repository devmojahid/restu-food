"use client"

import React from 'react';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef(({ 
  value = 0, 
  max = 100, 
  variant = 'default',
  size = 'md',
  showValue = false,
  className,
  ...props 
}, ref) => {
  const percentage = (value / max) * 100;

  const variants = {
    default: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      {showValue && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600 dark:text-gray-400">{value}</span>
          <span className="text-gray-600 dark:text-gray-400">{max}</span>
        </div>
      )}
      <div
        ref={ref}
        className={cn(
          'w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden',
          sizes[size],
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-in-out',
            variants[variant],
            'bg-gradient-to-r from-current to-current/80'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
});

Progress.displayName = 'Progress';

// Export both named and default exports
export { Progress };
export default Progress;
