import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import { useScrollLock } from '@/hooks/useScrollLock';

const MobileSheet = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    showDragHandle = true,
    fullHeight = false,
    className 
}) => {
    useScrollLock(isOpen);
    const [isDragging, setIsDragging] = useState(false);
    const [dragY, setDragY] = useState(0);
    const sheetRef = useRef(null);
    const dragRef = useRef(null);

    // Enhanced touch gesture handling
    useEffect(() => {
        let startY = 0;
        let currentY = 0;
        const sheet = sheetRef.current;

        const handleTouchStart = (e) => {
            if (!dragRef.current?.contains(e.target)) return;
            startY = e.touches[0].clientY;
            currentY = startY;
            setIsDragging(true);
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            const deltaY = e.touches[0].clientY - startY;
            currentY = e.touches[0].clientY;
            
            if (deltaY < 0) {
                // Pulling up - limit the drag
                setDragY(Math.max(deltaY, -50));
            } else {
                // Pulling down
                setDragY(deltaY);
            }
        };

        const handleTouchEnd = () => {
            if (!isDragging) return;
            setIsDragging(false);

            // If dragged down more than 100px, close the sheet
            if (dragY > 100) {
                onClose();
            } else {
                // Spring back to original position
                setDragY(0);
            }
        };

        if (sheet) {
            sheet.addEventListener('touchstart', handleTouchStart, { passive: true });
            sheet.addEventListener('touchmove', handleTouchMove, { passive: true });
            sheet.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (sheet) {
                sheet.removeEventListener('touchstart', handleTouchStart);
                sheet.removeEventListener('touchmove', handleTouchMove);
                sheet.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [isDragging, onClose, dragY]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        ref={sheetRef}
                        initial={{ y: '100%' }}
                        animate={{ 
                            y: dragY || 0,
                            transition: {
                                type: 'spring',
                                damping: isDragging ? 40 : 25,
                                stiffness: isDragging ? 300 : 500,
                            }
                        }}
                        exit={{ y: '100%' }}
                        className={cn(
                            "fixed bottom-0 left-0 right-0 z-50 md:hidden",
                            "bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden",
                            "shadow-[0_-8px_30px_rgba(0,0,0,0.12)]",
                            isDragging && "transition-none",
                            fullHeight && "h-[85vh]",
                            className
                        )}
                        style={{
                            touchAction: 'none',
                            transform: `translateY(${dragY}px)`,
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Drag Handle Area */}
                        {showDragHandle && (
                            <div 
                                ref={dragRef}
                                className="w-full h-9 cursor-grab active:cursor-grabbing touch-none"
                            >
                                <div className="w-12 h-1 mx-auto mt-3 rounded-full bg-gray-300 dark:bg-gray-700" />
                            </div>
                        )}

                        {/* Content Wrapper */}
                        <div className={cn(
                            "flex flex-col",
                            fullHeight && "h-full",
                            "max-w-[100vw] mx-auto",
                            "overscroll-contain"
                        )}>
                            {/* Header */}
                            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b dark:border-gray-800">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {title}
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={onClose}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Update the content container */}
                            <div className={cn(
                                "flex-1 overflow-y-auto overscroll-contain",
                                "w-full px-4",
                                "pb-safe-area-inset-bottom",
                                isDragging ? "touch-none" : "touch-pan-y"
                            )}
                            style={{
                                maxHeight: fullHeight ? 'calc(85vh - var(--safe-area-inset-top))' : 'calc(100vh - 150px)',
                                WebkitOverflowScrolling: 'touch',
                            }}>
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileSheet; 