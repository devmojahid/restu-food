import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const Backdrop = ({ isOpen, onClose, className }) => {
    // Lock body scroll when backdrop is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Add padding right to prevent layout shift when scrollbar disappears
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "fixed inset-0 bg-black/50 backdrop-blur-sm z-50",
                "touch-none", // Prevent touch events on backdrop
                className
            )}
            onClick={onClose}
            style={{
                willChange: 'opacity', // Optimize for animations
                backfaceVisibility: 'hidden', // Prevent flickering
            }}
        />
    );
};

export default Backdrop; 