import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    ChevronRight,
    ChevronLeft,
    Star,
    ShoppingBag,
    Heart,
    ArrowRight,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { useToast } from "@/Components/ui/use-toast";

const RecommendedItems = ({ items = [] }) => {
    const scrollContainerRef = useRef(null);
    const { toast } = useToast();

    // Handler for scrolling the carousel left/right
    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = direction === 'left'
            ? -container.clientWidth / 2
            : container.clientWidth / 2;

        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    // Handle adding to wishlist
    const handleAddToWishlist = (item) => {
        toast({
            title: "Added to Wishlist",
            description: `${item.name} has been added to your wishlist`,
        });
    };

    // Handle adding to cart
    const handleAddToCart = (item) => {
        toast({
            title: "Added to Cart",
            description: `${item.name} has been added to your cart`,
        });
    };

    // If no items, don't render the component
    if (!items?.length) return null;

    return (
        <section>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Recommended For You
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        Based on your wishlist and preferences
                    </p>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Carousel */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide -mx-4 px-4"
            >
                {items.map((item, index) => (
                    <RecommendedItemCard
                        key={item.id}
                        item={item}
                        index={index}
                        onAddToWishlist={() => handleAddToWishlist(item)}
                        onAddToCart={() => handleAddToCart(item)}
                    />
                ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-6">
                <Link
                    href="/menu?recommended=true"
                    className="inline-flex items-center text-primary hover:text-primary/90 font-medium transition-colors"
                >
                    <span>View More Recommendations</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
            </div>
        </section>
    );
};

const RecommendedItemCard = ({ item, index, onAddToWishlist, onAddToCart }) => {
    // Calculate if item has a discount
    const hasDiscount = item.discount_percent > 0;
    const discountedPrice = hasDiscount
        ? item.price * (1 - item.discount_percent / 100)
        : item.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
            {/* Image Container */}
            <div className="relative h-36">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />

                {/* Discount Badge */}
                {hasDiscount && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        {item.discount_percent}% OFF
                    </Badge>
                )}

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToWishlist();
                        }}
                    >
                        <Heart className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart();
                        }}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <Link href={`/menu/${item.slug}`}>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1 hover:text-primary transition-colors">
                        {item.name}
                    </h3>
                </Link>

                {item.restaurant && (
                    <Link
                        href={`/restaurants/${item.restaurant.slug}`}
                        className="text-xs text-gray-500 dark:text-gray-400 mb-2 block hover:text-primary transition-colors"
                    >
                        {item.restaurant.name}
                    </Link>
                )}

                {/* Rating and Info */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-xs font-medium">{item.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">
                            ({item.reviews_count})
                        </span>
                    </div>

                    {item.restaurant?.delivery_time && (
                        <span className="text-xs text-gray-500">
                            {item.restaurant.delivery_time}
                        </span>
                    )}
                </div>

                {/* Price and Add Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="font-semibold text-primary">
                            ${discountedPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-gray-500 line-through ml-1">
                                ${item.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <Button
                        size="sm"
                        variant="ghost"
                        className="p-0 h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart();
                        }}
                    >
                        <ShoppingBag className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default RecommendedItems; 