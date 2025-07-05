import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { cn } from '@/lib/utils';

const RecommendedItems = ({ items = [] }) => {
    const carouselRef = useRef(null);

    if (!items.length) return null;

    // Scroll the carousel left or right
    const scroll = (direction) => {
        if (carouselRef.current) {
            const { current } = carouselRef;
            const scrollAmount = direction === 'left' ? -280 : 280;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full shadow-md h-9 w-9"
                    onClick={() => scroll('left')}
                >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Scroll left</span>
                </Button>
            </div>

            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full shadow-md h-9 w-9"
                    onClick={() => scroll('right')}
                >
                    <ChevronRight className="h-5 w-5" />
                    <span className="sr-only">Scroll right</span>
                </Button>
            </div>

            {/* Carousel */}
            <div
                ref={carouselRef}
                className="flex overflow-x-auto gap-4 pb-6 pt-2 px-1 no-scrollbar snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none' }}
            >
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        className="min-w-[260px] flex-shrink-0 snap-start"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="overflow-hidden h-full border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors duration-300">
                            {/* Item Image */}
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={item.image || '/images/food-placeholder.jpg'}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />

                                {/* Discount Badge */}
                                {item.discount > 0 && (
                                    <Badge className="absolute top-2 right-2 bg-red-500 text-white border-0">
                                        {item.discount}% OFF
                                    </Badge>
                                )}

                                {/* Ratings Badge */}
                                {item.rating && (
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-3.5 h-3.5 text-yellow-400 mr-1"
                                        >
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                        {item.rating}
                                    </div>
                                )}
                            </div>

                            {/* Item Content */}
                            <CardContent className="p-3">
                                <h3 className="font-medium text-base line-clamp-1 mb-1">{item.name}</h3>

                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-2">
                                    {item.description}
                                </p>

                                {/* Price */}
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">${item.price.toFixed(2)}</span>

                                    {item.original_price && item.original_price > item.price && (
                                        <span className="text-gray-500 line-through text-sm">
                                            ${item.original_price.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </CardContent>

                            {/* Add Button */}
                            <CardFooter className="p-3 pt-0">
                                <Button
                                    className="w-full flex items-center gap-2"
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add to Order
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Mobile navigation indicators */}
            <div className="flex items-center justify-center gap-1 mt-2 md:hidden">
                {Array.from({ length: Math.min(5, Math.ceil(items.length / 2)) }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1 rounded-full bg-gray-300 dark:bg-gray-700",
                            i === 0 ? "w-6 bg-primary" : "w-2"
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

export default RecommendedItems; 