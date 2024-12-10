import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SocialLink = ({ href, icon: Icon, label, className }) => {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "w-10 h-10 rounded-full",
                "bg-gray-100 dark:bg-gray-800",
                "hover:bg-primary dark:hover:bg-primary",
                "text-gray-600 dark:text-gray-400",
                "hover:text-white dark:hover:text-white",
                "flex items-center justify-center",
                "transition-all duration-300",
                "focus:outline-none focus:ring-2",
                "focus:ring-primary focus:ring-offset-2",
                "focus:ring-offset-white dark:focus:ring-offset-gray-900",
                className
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={label}
        >
            <Icon className="w-5 h-5" />
        </motion.a>
    );
};

export default SocialLink; 