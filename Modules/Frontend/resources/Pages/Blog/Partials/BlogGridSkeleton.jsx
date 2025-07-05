import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/Components/ui/skeleton';

const BlogGridSkeleton = ({ view }) => {
    return (
        <div className={cn(
            "grid gap-6",
            view === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
        )}>
            {[...Array(6)].map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "bg-white dark:bg-gray-800 rounded-2xl overflow-hidden",
                        "border border-gray-200 dark:border-gray-700",
                        view === 'list' && "flex gap-6"
                    )}
                >
                    {/* Image Skeleton */}
                    <Skeleton 
                        className={cn(
                            "bg-gray-200 dark:bg-gray-700",
                            view === 'grid' 
                                ? "aspect-[16/9] w-full" 
                                : "w-1/3 aspect-[4/3]"
                        )} 
                    />

                    {/* Content Skeleton */}
                    <div className={cn(
                        "p-6",
                        view === 'list' && "flex-1"
                    )}>
                        <Skeleton className="h-6 w-24 mb-4" />
                        <Skeleton className="h-8 w-full mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        
                        <div className="flex gap-4 mb-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                        </div>
                        
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlogGridSkeleton; 