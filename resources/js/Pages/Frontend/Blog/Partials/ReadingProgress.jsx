import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ReadingProgress = ({ progress }) => {
    return (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
            <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
            />
        </div>
    );
};

export default ReadingProgress; 