import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Star, Tag, Clock, Flame } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const FeaturedItems = ({ items = [] }) => {
    const carouselRef = useRef(null);

    // Scroll the carousel left or right
    const handleScroll = (direction) => {
        if (!carouselRef.current) return;

        const { scrollLeft, clientWidth } = carouselRef.current;
        const scrollAmount = clientWidth * 0.8; // Scroll 80% of the visible width

        carouselRef.current.scrollTo({
            left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
            behavior: 'smooth'
        });
    };

    // If no items, don't render anything
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <Badge variant="outline" className="mb-2 text-primary border-primary">
                            <Flame className="w-3 h-3 mr-1" />
                            Featured
                        </Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Chef's Specials</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Handpicked selections from our expert chefs
                        </p>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleScroll('left')}
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleScroll('right')}
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Featured Items Carousel */}
                <div
                    ref={carouselRef}
                    className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex-none w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-16px)]"
                        >
                            <Link
                                href={`/food-menu/${item.slug}`}
                                className={cn(
                                    "block h-full rounded-xl overflow-hidden shadow-lg transition-all duration-300",
                                    "hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-800"
                                )}
                            >
                                {/* Card Image with Badge */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                    />
                                    {/* Featured Badge */}
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-primary/90 text-white backdrop-blur-sm">
                                            {item.featured_badge || "Chef's Special"}
                                        </Badge>
                                    </div>

                                    {/* Discount Tag if applicable */}
                                    {item.discount && (
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-red-500/90 text-white backdrop-blur-sm">
                                                {item.discount}% Off
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Promotion Banner if applicable */}
                                    {item.promotion && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                            <div className="text-white text-sm font-medium flex items-center">
                                                <Tag className="w-3 h-3 mr-1" />
                                                {item.promotion}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Card Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                        {item.name}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                                        {item.featured_description || item.description}
                                    </p>

                                    {/* Dietary & Info Tags */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {item.is_vegetarian && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                                Vegetarian
                                            </span>
                                        )}
                                        {item.is_spicy && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                                                Spicy
                                            </span>
                                        )}
                                    </div>

                                    {/* Price, Rating & Time */}
                                    <div className="flex items-center justify-between">
                                        <div className="font-bold text-xl text-gray-900 dark:text-white">
                                            ${item.price.toFixed(2)}
                                            {item.discount && (
                                                <span className="text-sm text-gray-500 line-through ml-2">
                                                    ${(item.price * (1 + item.discount / 100)).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center mr-3">
                                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                                <span>{item.rating}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{item.preparation_time.split('-')[0]} min</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-8">
                    <Link href="/food-menu">
                        <Button variant="outline" size="lg" className="rounded-full">
                            View All Menu Items
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedItems;