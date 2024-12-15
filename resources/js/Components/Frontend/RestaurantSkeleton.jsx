import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/Components/ui/skeleton';
import { cn } from '@/lib/utils';

export const RestaurantCardSkeleton = ({ view = 'grid' }) => {
    if (view === 'grid') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
            <div className="flex gap-4">
                <Skeleton className="h-32 w-32 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RestaurantGridSkeleton = ({ count = 6, view = 'grid' }) => {
    return (
        <div className={cn(
            "grid gap-6",
            view === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" 
                : "grid-cols-1"
        )}>
            {Array(count).fill(0).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                    <RestaurantCardSkeleton view={view} />
                </motion.div>
            ))}
        </div>
    );
}; 