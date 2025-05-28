import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    Filter,
    Grid3X3,
    LayoutGrid,
    Search,
    UserPlus,
    Calendar,
    Gift,
    Truck,
    Clock,
    Sparkles,
    Tag,
    Percent,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area';

const iconMap = {
    'UserPlus': UserPlus,
    'Calendar': Calendar,
    'Gift': Gift,
    'Truck': Truck,
    'Clock': Clock,
    'Sparkles': Sparkles,
    'Tag': Tag,
    'Percent': Percent
};

const CategoryCard = ({ category, isActive, onClick }) => {
    if (!category) return null;

    // If the icon is defined in the iconMap, use it, otherwise fallback to Tag
    const IconComponent = category.icon && iconMap[category.icon]
        ? iconMap[category.icon]
        : Tag;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={() => onClick && onClick(category)}
            className={cn(
                "cursor-pointer rounded-xl overflow-hidden p-1",
                "transition-all duration-300",
                "border-2",
                isActive
                    ? "border-primary shadow-md"
                    : "border-transparent hover:border-primary/20"
            )}
        >
            <div
                className={cn(
                    "h-full rounded-lg p-6 flex flex-col items-center text-center",
                    "bg-white dark:bg-gray-800",
                    category.background || "bg-gradient-to-r from-blue-500 to-indigo-600"
                )}
            >
                <div className="mb-4 bg-white/20 p-3 rounded-full">
                    <IconComponent className="w-6 h-6 text-white" />
                </div>

                <h3 className="font-bold text-xl text-white mb-2">
                    {category.name}
                </h3>

                <p className="text-white/80 text-sm mb-4">
                    {category.description}
                </p>

                <Badge
                    className="bg-white/30 text-white hover:bg-white/40"
                >
                    {category.count} offers
                </Badge>
            </div>
        </motion.div>
    );
};

const MobileScrollableCategories = ({ categories, activeCategory, handleCategoryClick }) => {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // Small buffer
        }
    };

    // Update scroll buttons when component mounts and when categories change
    useEffect(() => {
        updateScrollButtons();
        // Add event listener
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', updateScrollButtons);
        }

        // Check if we can scroll right initially after a short delay
        setTimeout(updateScrollButtons, 100);

        // Cleanup
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', updateScrollButtons);
            }
        };
    }, [categories]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative">
            {/* Left Scroll Button */}
            {canScrollLeft && (
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white dark:bg-gray-800"
                    onClick={scrollLeft}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            )}

            {/* Right Scroll Button */}
            {canScrollRight && (
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md bg-white dark:bg-gray-800"
                    onClick={scrollRight}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex space-x-3 overflow-x-auto pb-4 px-1 hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categories.map((category) => (
                    <div
                        key={category.id || category.slug}
                        className="flex-shrink-0 w-[170px] sm:w-[200px]"
                    >
                        <CategoryCard
                            category={category}
                            isActive={activeCategory?.slug === category.slug}
                            onClick={handleCategoryClick}
                        />
                    </div>
                ))}
            </div>

            {/* Visual indicator for scrolling */}
            {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 dark:from-gray-900/90 to-transparent pointer-events-none" />
            )}
            {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 dark:from-gray-900/90 to-transparent pointer-events-none" />
            )}
        </div>
    );
};

const OfferCategories = ({ categories = [], activeCategory = null, setActiveCategory = () => { } }) => {
    // Safely ensure categories is an array
    const safeCategories = Array.isArray(categories) ? categories : [];
    const isMobile = useMediaQuery('(max-width: 768px)');

    const handleCategoryClick = (category) => {
        if (setActiveCategory) {
            // If the category is already active, deselect it
            if (activeCategory?.slug === category.slug) {
                setActiveCategory(null);
            } else {
                setActiveCategory(category);
            }
        }
    };

    if (safeCategories.length === 0) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Offer Categories
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                            No categories available at the moment.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // Mobile horizontal scrollable categories
    if (isMobile) {
        return (
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                                <LayoutGrid className="w-6 h-6 text-primary" />
                                Browse by Category
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Explore offers by category to find the perfect deal
                            </p>
                        </div>
                    </div>

                    <MobileScrollableCategories
                        categories={safeCategories}
                        activeCategory={activeCategory}
                        handleCategoryClick={handleCategoryClick}
                    />

                    {activeCategory && (
                        <div className="mt-4 flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActiveCategory(null)}
                            >
                                Clear Filter
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Desktop grid layout
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                            <Grid3X3 className="w-8 h-8 text-primary" />
                            Offer Categories
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Browse through our wide range of offer categories
                        </p>
                    </motion.div>

                    {activeCategory && (
                        <Button
                            variant="outline"
                            onClick={() => setActiveCategory(null)}
                            className="mt-4 md:mt-0"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Clear Filter
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {safeCategories.map((category) => (
                        <CategoryCard
                            key={category.id || category.slug}
                            category={category}
                            isActive={activeCategory?.slug === category.slug}
                            onClick={handleCategoryClick}
                        />
                    ))}
                </div>

                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Link
                        href="/offers"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-8 py-4 rounded-full transition-colors group"
                    >
                        <span>Explore All Offers</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default OfferCategories; 