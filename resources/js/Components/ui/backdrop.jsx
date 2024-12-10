import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Backdrop = ({ 
    isOpen, 
    onClose, 
    className, 
    blur = true,
    opacity = 60,
    zIndex = 40
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "fixed inset-0",
                blur && "backdrop-blur-sm",
                `bg-black/${opacity}`,
                `z-${zIndex}`,
                className
            )}
            onClick={onClose}
        />
    );
};

export default Backdrop; 