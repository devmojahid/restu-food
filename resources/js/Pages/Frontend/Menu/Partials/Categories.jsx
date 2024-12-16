import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    ChevronRight,
    Filter,
    X,
    Sparkles
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const Categories = ({ 
    categories, 
    selectedCategory, 
    onSelectCategory,
    className 
}) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);
    const [showGradient, setShowGradient] = useState({ left: false, right: true });
    const isMobile = useMediaQuery('(max-width: 768px)');
    const scrollRef = React.useRef(null);

    // Handle scroll shadows
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setScrollPosition(scrollLeft);
            setMaxScroll(scrollWidth - clientWidth);
            setShowGradient({
                left: scrollLeft > 0,
                right: scrollLeft < scrollWidth - clientWidth - 10
            });
        }
    };

    // Scroll buttons handlers
    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial check
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <div className={cn("relative", className)}>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4 px-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Categories
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Browse by food category
                    </p>
                </div>
                {selectedCategory && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectCategory(null)}
                        className="gap-2"
                    >
                        <X className="w-4 h-4" />
                        Clear Filter
                    </Button>
                )}
            </div>

            {/* Categories Scroll Container */}
            <div className="relative">
                {/* Left Gradient */}
                {showGradient.left && !isMobile && (
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
                )}

                {/* Right Gradient */}
                {showGradient.right && !isMobile && (
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />
                )}

                {/* Scroll Buttons (Desktop) */}
                {!isMobile && (
                    <>
                        {showGradient.left && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full shadow-lg"
                                onClick={() => scroll('left')}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        )}
                        {showGradient.right && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full shadow-lg"
                                onClick={() => scroll('right')}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        )}
                    </>
                )}

                {/* Categories List */}
                <ScrollArea 
                    ref={scrollRef}
                    className="pb-4" 
                    orientation={isMobile ? "horizontal" : undefined}
                >
                    <div className={cn(
                        "flex gap-4 px-4",
                        isMobile ? "snap-x snap-mandatory" : "flex-wrap"
                    )}>
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                    "flex-shrink-0",
                                    isMobile ? "w-[150px] snap-center" : "w-[180px]"
                                )}
                            >
                                <Button
                                    variant={selectedCategory === category.id ? "default" : "outline"}
                                    className={cn(
                                        "w-full h-auto p-4",
                                        "flex flex-col items-center gap-2",
                                        "group relative overflow-hidden",
                                        "transition-all duration-300",
                                        selectedCategory === category.id ? [
                                            "border-primary/50",
                                            "shadow-lg shadow-primary/10"
                                        ] : [
                                            "hover:border-primary/30",
                                            "hover:shadow-md"
                                        ]
                                    )}
                                    onClick={() => onSelectCategory(category.id)}
                                >
                                    {/* Category Icon/Image */}
                                    <div className={cn(
                                        "w-16 h-16 rounded-full",
                                        "flex items-center justify-center",
                                        "bg-primary/5 dark:bg-primary/10",
                                        "group-hover:scale-110 transition-transform duration-300"
                                    )}>
                                        <span className="text-3xl">{category.icon}</span>
                                    </div>

                                    {/* Category Info */}
                                    <div className="text-center">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {category.items_count} items
                                        </p>
                                    </div>

                                    {/* Discount Badge */}
                                    {category.discount && (
                                        <Badge 
                                            variant="destructive"
                                            className="absolute top-2 right-2 animate-pulse"
                                        >
                                            {category.discount}% OFF
                                        </Badge>
                                    )}

                                    {/* Popular Badge */}
                                    {category.is_popular && (
                                        <div className="absolute top-2 left-2">
                                            <Badge 
                                                variant="secondary"
                                                className="gap-1"
                                            >
                                                <Sparkles className="w-3 h-3" />
                                                Popular
                                            </Badge>
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default Categories; 