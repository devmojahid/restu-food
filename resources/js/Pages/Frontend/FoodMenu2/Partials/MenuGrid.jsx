import React from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Flame, Shield, Heart, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';

const MenuGrid = ({
    items = [],
    viewMode = 'grid',
    searchQuery = '',
    isLoading = false
}) => {
    // Show loading indicator
    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                    Loading menu items...
                </p>
            </div>
        );
    }

    // If no items, show empty state
    if (!items || items.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-16 text-center">
                {searchQuery ? (
                    <>
                        <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No results found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md">
                            We couldn't find any menu items matching "{searchQuery}". Try a different search term or browse our categories.
                        </p>
                    </>
                ) : (
                    <>
                        <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No items available
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md">
                            There are no menu items available with the current filters. Try changing your filter settings.
                        </p>
                    </>
                )}
                <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => window.location.reload()}
                >
                    Reset All Filters
                </Button>
            </div>
        );
    }

    // Grid View
    if (viewMode === 'grid') {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={`grid-${items.length}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    layout
                >
                    {items.map((item, index) => (
                        <GridCard key={`${item.id}-${index}`} item={item} index={index} />
                    ))}
                </motion.div>
            </AnimatePresence>
        );
    }

    // List View
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`list-${items.length}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
                layout
            >
                {items.map((item, index) => (
                    <ListCard key={`${item.id}-${index}`} item={item} index={index} />
                ))}
            </motion.div>
        </AnimatePresence>
    );
};

// Grid Card Component
const GridCard = ({ item, index }) => {
    // Prepare variants for allergy/diet tags
    const dietaryTags = [];
    if (item.is_vegetarian) {
        dietaryTags.push({ label: 'Vegetarian', icon: <Shield className="w-3 h-3 mr-1" />, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' });
    }
    if (item.is_spicy) {
        dietaryTags.push({ label: 'Spicy', icon: <Flame className="w-3 h-3 mr-1" />, className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' });
    }
    if (item.is_new) {
        dietaryTags.push({ label: 'New', icon: null, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
        >
            <Link
                href={`/food-menu/${item.slug}`}
                className={cn(
                    "block h-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md",
                    "hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                )}
            >
                {/* Card Image */}
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {/* Discount Tag */}
                    {item.discount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {item.discount}% OFF
                        </div>
                    )}

                    {/* Popular Badge */}
                    {item.is_popular && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            Popular
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.name}</h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {item.description}
                    </p>

                    {/* Dietary Tags */}
                    {dietaryTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {dietaryTags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className={cn(
                                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                        tag.className
                                    )}
                                >
                                    {tag.icon}
                                    {tag.label}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Price and Stats */}
                    <div className="flex justify-between items-center">
                        <div className="font-bold text-gray-900 dark:text-white">
                            ${item.price.toFixed(2)}
                            {item.discount && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                    ${(item.price * (1 + item.discount / 100)).toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                <span>{item.rating}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{item.preparation_time.split('-')[0]} min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

// List Card Component
const ListCard = ({ item, index }) => {
    // Prepare variants for allergy/diet tags
    const dietaryTags = [];
    if (item.is_vegetarian) {
        dietaryTags.push({ label: 'Vegetarian', icon: <Shield className="w-3 h-3 mr-1" />, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' });
    }
    if (item.is_spicy) {
        dietaryTags.push({ label: 'Spicy', icon: <Flame className="w-3 h-3 mr-1" />, className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' });
    }
    if (item.is_new) {
        dietaryTags.push({ label: 'New', icon: null, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
        >
            <Link
                href={`/food-menu/${item.slug}`}
                className={cn(
                    "flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md",
                    "hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                )}
            >
                {/* Card Image */}
                <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {/* Discount Tag */}
                    {item.discount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {item.discount}% OFF
                        </div>
                    )}

                    {/* Popular Badge */}
                    {item.is_popular && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            Popular
                        </div>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.name}</h3>
                            <div className="font-bold text-lg text-gray-900 dark:text-white">
                                ${item.price.toFixed(2)}
                                {item.discount && (
                                    <span className="text-sm text-gray-500 line-through ml-2">
                                        ${(item.price * (1 + item.discount / 100)).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm my-2">
                            {item.description}
                        </p>

                        {/* Dietary Tags */}
                        {dietaryTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 my-2">
                                {dietaryTags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                            tag.className
                                        )}
                                    >
                                        {tag.icon}
                                        {tag.label}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                <span>{item.rating}</span>
                                <span className="text-xs ml-1">({item.reviews_count})</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{item.preparation_time}</span>
                            </div>
                            {item.calories && (
                                <div>
                                    <span>{item.calories} cal</span>
                                </div>
                            )}
                        </div>

                        <Badge variant="outline" className="hover:bg-primary/10">
                            {item.category.name}
                        </Badge>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default MenuGrid; 