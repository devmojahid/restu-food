import React from 'react';
import { cn } from '@/lib/utils';

export const EmptyState = ({ 
    icon, 
    title, 
    description, 
    action,
    className 
}) => {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-8 text-center",
            "rounded-lg border border-dashed bg-muted/30",
            className
        )}>
            {icon && (
                <div className="rounded-full bg-muted p-3 mb-4">
                    {React.cloneElement(icon, {
                        className: cn(
                            "w-6 h-6 text-muted-foreground",
                            icon.props.className
                        )
                    })}
                </div>
            )}
            {title && (
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
            )}
            {description && (
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
            )}
            {action && (
                <div className="mt-2">{action}</div>
            )}
        </div>
    );
}; 