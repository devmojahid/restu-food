import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Star, Plus, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/Components/ui/tooltip';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Link } from '@inertiajs/react';

const RecommendedItems = ({ items = [] }) => {
    const isSmallScreen = useMediaQuery('(max-width: 640px)');
    const isMediumScreen = useMediaQuery('(max-width: 1024px)');

    // If no items, don't render
    if (!items.length) return null;

    // Format price
    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    // Handle carousel scrolling
    const scrollCarousel = (direction) => {
        const carousel = document.getElementById('recommended-carousel');
        if (carousel) {
            const scrollAmount = direction === 'left' ? -320 : 320;
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">You Might Also Like</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Popular items other customers added to their order
                    </p>
                </div>

                {/* Carousel Navigation - Only on larger screens */}
                {!isSmallScreen && (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => scrollCarousel('left')}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => scrollCarousel('right')}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Carousel */}
            <div
                id="recommended-carousel"
                className="flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none' }}
            >
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                            "flex-shrink-0 snap-start",
                            "w-[280px] md:w-[320px]",
                            "mr-4"
                        )}
                    >
                        <Card className="h-full">
                            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                />
                                {item.restaurant && (
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-white/90 text-gray-800 hover:bg-white/80 dark:bg-black/70 dark:text-white dark:hover:bg-black/60">
                                            {item.restaurant.name}
                                        </Badge>
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="bg-white/90 dark:bg-black/70 p-1.5 rounded-full">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent side="left">
                                                <p className="text-xs">
                                                    Rating: {item.rating} ({item.ratings_count} reviews)
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <CardHeader className="pb-2 pt-4">
                                <CardTitle className="text-lg truncate">{item.name}</CardTitle>
                                <CardDescription className="truncate">
                                    {item.restaurant?.name || 'Restaurant'}
                                </CardDescription>
                            </CardHeader>

                            <CardFooter className="flex justify-between items-center pt-0">
                                <div className="text-lg font-bold">{formatPrice(item.price)}</div>

                                <div className="flex space-x-2">
                                    <Link href={`/menu/${item.slug}`}>
                                        <Button variant="ghost" size="sm" className="rounded-full">
                                            <Info className="w-4 h-4 mr-1" />
                                            Details
                                        </Button>
                                    </Link>
                                    <Button className="rounded-full" size="sm">
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Mobile Navigation Dots */}
            {isSmallScreen && (
                <div className="flex justify-center mt-4 space-x-1">
                    {items.slice(0, Math.min(5, items.length)).map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-2 h-2 rounded-full",
                                index === 0 ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecommendedItems; 