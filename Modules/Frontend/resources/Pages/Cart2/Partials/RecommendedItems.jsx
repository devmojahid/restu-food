import React, { useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    ShoppingCart,
    Plus
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const RecommendedItems = ({ title = 'Recommended for You', items = [] }) => {
    const scrollRef = useRef(null);

    if (!items || items.length === 0) {
        return null;
    }

    const handleScrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -300,
                behavior: 'smooth',
            });
        }
    };

    const handleScrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 300,
                behavior: 'smooth',
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={handleScrollLeft}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={handleScrollRight}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item) => (
                    <RecommendedItemCard key={item.id} item={item} />
                ))}
            </div>
        </motion.div>
    );
};

const RecommendedItemCard = ({ item }) => {
    return (
        <div
            className={cn(
                "flex-none w-[250px] snap-start",
                "border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden",
                "hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-md",
                "transition-all duration-300 group"
            )}
        >
            {/* Item Image */}
            <div className="relative h-40 w-full">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {item.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                        {item.discount}% OFF
                    </div>
                )}

                {/* Add to Cart Button - Appears on Hover */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        variant="default"
                        size="icon"
                        className="h-10 w-10 rounded-full shadow-lg"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // In a real app, this would add to cart
                            // For now it's just a UI element
                        }}
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Item Details */}
            <div className="p-4">
                <Link
                    href={`/menu/${item.slug}`}
                    className="font-medium line-clamp-1 hover:text-primary transition-colors"
                >
                    {item.name}
                </Link>

                <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Link
                        href={`/restaurants/${item.restaurant?.slug}`}
                        className="line-clamp-1 hover:text-primary transition-colors"
                    >
                        {item.restaurant?.name || 'Restaurant'}
                    </Link>
                </div>

                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="font-semibold">
                            ${(item.price * (1 - (item.discount || 0) / 100)).toFixed(2)}
                        </span>

                        {item.discount > 0 && (
                            <span className="ml-2 text-xs text-gray-500 line-through">
                                ${item.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {item.rating && (
                        <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 px-2 py-0.5 rounded text-xs">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3 h-3 mr-1"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {item.rating}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendedItems; 