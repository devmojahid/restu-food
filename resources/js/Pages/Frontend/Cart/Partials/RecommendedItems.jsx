import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Check,
    Star,
    Zap,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { useToast } from '@/Components/ui/use-toast';
import { cn } from '@/lib/utils';

const EmptyState = () => (
    <div className="text-center py-6">
        <p className="text-gray-500 dark:text-gray-400">
            No recommendations available at the moment.
        </p>
    </div>
);

const RecommendedItemCard = ({ item, onAddToCart }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const { toast } = useToast();

    const handleAddToCart = async () => {
        if (isAdding || isAdded) return;

        setIsAdding(true);
        try {
            // In a real app, you would make an API call to add to cart
            await new Promise(resolve => setTimeout(resolve, 800));

            // Call the callback if provided
            if (onAddToCart) {
                await onAddToCart(item);
            }

            setIsAdded(true);

            toast({
                title: "Added to Cart",
                description: `${item.name} has been added to your cart`,
            });

            // Reset after a while to allow adding again
            setTimeout(() => {
                setIsAdded(false);
            }, 3000);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item to cart",
                variant: "destructive",
            });
        } finally {
            setIsAdding(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    // Helper function to safely render category
    const getCategoryDisplay = (category) => {
        if (typeof category === 'string') {
            return category;
        }
        if (typeof category === 'object' && category !== null) {
            return category.name || category.slug || category.id || 'Category';
        }
        return 'Category';
    };

    // Helper function to safely render restaurant
    const getRestaurantDisplay = (restaurant) => {
        if (typeof restaurant === 'string') {
            return restaurant;
        }
        if (typeof restaurant === 'object' && restaurant !== null) {
            return restaurant.name || restaurant.slug || restaurant.id || 'Restaurant';
        }
        return 'Restaurant';
    };

    return (
        <Card className="h-full flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full"
                />
                {item.discount_percent > 0 && (
                    <Badge
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600"
                    >
                        {item.discount_percent}% OFF
                    </Badge>
                )}
            </div>

            <CardHeader className="p-3 pb-1">
                <div className="flex items-center justify-between mb-1">
                    <Badge
                        variant="outline"
                        className="text-xs bg-primary/10 text-primary dark:bg-primary/20"
                    >
                        {getCategoryDisplay(item.category)}
                    </Badge>
                    <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {item.rating || '0'}
                        </span>
                    </div>
                </div>
                <h3 className="font-medium text-sm line-clamp-2 text-gray-900 dark:text-white">
                    {item.name || 'Unnamed Item'}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {getRestaurantDisplay(item.restaurant)}
                </div>
            </CardHeader>

            <CardFooter className="p-3 pt-0 mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(item.price || 0)}
                    </div>
                    {item.original_price > item.price && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(item.original_price)}
                        </div>
                    )}
                </div>

                <Button
                    size="sm"
                    variant={isAdded ? "success" : "default"}
                    className={cn(
                        "rounded-full w-9 h-9 p-0",
                        isAdded && "bg-green-500 hover:bg-green-600"
                    )}
                    onClick={handleAddToCart}
                    disabled={isAdding || isAdded}
                >
                    {isAdding ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : isAdded ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

const RecommendedItems = ({ items = [], onAddToCart }) => {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Ensure items is an array
    const safeItems = Array.isArray(items) ? items : [];

    const checkScrollButtons = () => {
        if (!scrollContainerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    };

    const scroll = (direction) => {
        if (!scrollContainerRef.current) return;

        const scrollAmount = direction === 'left' ? -320 : 320;
        scrollContainerRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });

        // Check buttons after scroll animation completes
        setTimeout(checkScrollButtons, 300);
    };

    if (safeItems.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Recommended for You
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Based on items in your cart
                    </p>
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
                onScroll={checkScrollButtons}
            >
                {safeItems.map((item) => (
                    <div
                        key={item.id}
                        className="w-48 md:w-56 lg:w-64 flex-shrink-0"
                    >
                        <RecommendedItemCard
                            item={item}
                            onAddToCart={onAddToCart}
                        />
                    </div>
                ))}
            </div>

            {/* Side fade effects */}
            {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none bg-gradient-to-r from-white dark:from-gray-900 to-transparent" />
            )}
            {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none bg-gradient-to-l from-white dark:from-gray-900 to-transparent" />
            )}
        </div>
    );
};

export default RecommendedItems;