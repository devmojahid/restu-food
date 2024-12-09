import React from 'react';
import { cn } from '@/lib/utils';

const DropdownContent = ({ children, className, isMobile }) => {
    return (
        <div className={cn(
            "flex flex-col",
            "bg-white dark:bg-gray-900",
            "border dark:border-gray-800",
            "shadow-lg",
            isMobile ? [
                "h-full w-full max-w-lg mx-auto",
                "safe-spacing",
                "no-scrollbar"
            ] : [
                "rounded-lg",
                "w-[380px] max-w-[calc(100vw-2rem)]",
                "absolute right-0 mt-2",
                "mx-4 sm:mx-0"
            ],
            className
        )}>
            {children}
        </div>
    );
};

export default DropdownContent; 