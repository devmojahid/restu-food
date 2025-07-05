import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

const CategoryNavigation = ({
    categories = [],
    activeCategory = 'all',
    setActiveCategory
}) => {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Check if scrolling arrows should be shown
    const checkScrollArrows = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    };

    // Handle scroll events
    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', checkScrollArrows);
            // Initial check
            checkScrollArrows();

            return () => scrollElement.removeEventListener('scroll', checkScrollArrows);
        }
    }, []);

    // Handle window resize
    useEffect(() => {
        window.addEventListener('resize', checkScrollArrows);
        return () => window.removeEventListener('resize', checkScrollArrows);
    }, []);

    // Scroll left or right
    const handleScroll = (direction) => {
        if (!scrollRef.current) return;

        const scrollAmount = 300; // pixels to scroll
        const currentScroll = scrollRef.current.scrollLeft;

        scrollRef.current.scrollTo({
            left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
            behavior: 'smooth'
        });
    };

    // Get dynamic icon component
    const DynamicIcon = (iconName) => {
        if (!iconName) return Icons.Utensils;
        return Icons[iconName] || Icons.Utensils;
    };

    return (
        <div className="bg-white dark:bg-gray-900 sticky top-16 z-10 border-b border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="container mx-auto px-4 relative">
                {/* Left Scroll Arrow */}
                {showLeftArrow && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-md"
                            onClick={() => handleScroll('left')}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Scrollable Categories */}
                <div
                    ref={scrollRef}
                    className="flex items-center space-x-1 overflow-x-auto py-4 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* All Categories Option */}
                    <Button
                        variant={activeCategory === 'all' ? 'default' : 'outline'}
                        className={cn(
                            "rounded-full min-w-max",
                            activeCategory === 'all' && "bg-primary text-white"
                        )}
                        onClick={() => setActiveCategory('all')}
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span>All Categories</span>
                    </Button>

                    {/* Individual Categories */}
                    {categories.map((category) => {
                        const IconComponent = DynamicIcon(category.icon);
                        return (
                            <Button
                                key={category.id}
                                variant={activeCategory === category.slug ? 'default' : 'outline'}
                                className={cn(
                                    "rounded-full min-w-max",
                                    activeCategory === category.slug && "bg-primary text-white"
                                )}
                                onClick={() => setActiveCategory(category.slug)}
                            >
                                <IconComponent className="w-4 h-4 mr-2" />
                                <span>{category.name}</span>
                                {category.items_count > 0 && (
                                    <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                                        {category.items_count}
                                    </span>
                                )}
                            </Button>
                        );
                    })}
                </div>

                {/* Right Scroll Arrow */}
                {showRightArrow && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block z-10">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-md"
                            onClick={() => handleScroll('right')}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryNavigation; 