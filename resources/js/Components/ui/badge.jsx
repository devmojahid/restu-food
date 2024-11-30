import React from 'react';
import { cn } from '@/lib/utils';

const Badge = React.forwardRef(({ 
  children, 
  variant = 'default', 
  size = 'md',
  className, 
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    outline: 'border border-primary/20 text-primary/80',
    ghost: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

// Export both named and default exports
export { Badge };
export default Badge;
