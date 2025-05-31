import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Link } from '@inertiajs/react';

const ErrorState = ({
    title = 'Something went wrong',
    description = 'We encountered an error while loading this page. Please try again later.',
    className,
    action = null
}) => {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center text-center p-6',
            className
        )}>
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 flex items-center justify-center rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {description}
            </p>

            {action ? (
                action
            ) : (
                <Button asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            )}
        </div>
    );
};

export default ErrorState; 