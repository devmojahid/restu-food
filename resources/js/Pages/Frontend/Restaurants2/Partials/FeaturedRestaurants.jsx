import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const FeaturedRestaurants = ({ restaurants = [] }) => {
    const carouselRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(4);

    // Update slides to show based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setSlidesToShow(1);
            } else if (window.innerWidth < 768) {
                setSlidesToShow(2);
            } else if (window.innerWidth < 1024) {
                setSlidesToShow(3);
            } else {
                setSlidesToShow(4);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Check if we can scroll left/right
    useEffect(() => {
        if (!carouselRef.current) return;

        const checkScrollButtons = () => {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        };

        checkScrollButtons();
        carouselRef.current.addEventListener('scroll', checkScrollButtons);
        return () => {
            if (carouselRef.current) {
                carouselRef.current.removeEventListener('scroll', checkScrollButtons);
            }
        };
    }, [restaurants, slidesToShow]);

    // Handle scroll
    const scroll = (direction) => {
        if (!carouselRef.current) return;

        const { clientWidth } = carouselRef.current;
        const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;

        carouselRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });

        // Update active index
        if (direction === 'right' && activeIndex < Math.ceil(restaurants.length / slidesToShow) - 1) {
            setActiveIndex(activeIndex + 1);
        } else if (direction === 'left' && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    // No restaurants to display
    if (!restaurants?.length) {
        return null;
    }

    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold">Featured Restaurants</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Discover our handpicked selection of exceptional dining experiences</p>
                    </div>
                    <Link href="/restaurants">
                        <Button variant="ghost" className="hidden md:flex items-center">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="relative">
                    {/* Left scroll button */}
                    <button
                        onClick={() => scroll('left')}
                        className={cn(
                            "absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-white dark:bg-gray-800 shadow-md",
                            "transition hover:bg-gray-100 dark:hover:bg-gray-700",
                            !canScrollLeft && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={!canScrollLeft}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Carousel */}
                    <div
                        ref={carouselRef}
                        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-1 scroll-smooth"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {restaurants.map((restaurant, index) => (
                            <motion.div
                                key={restaurant.id || index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                            >
                                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                                    <div className="relative h-48">
                                        {restaurant.image ? (
                                            <img
                                                src={restaurant.image}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <Badge className="bg-primary">Featured</Badge>
                                        </div>
                                        {restaurant.offer && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-center py-1 text-sm font-medium">
                                                {restaurant.offer}
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="py-3">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg line-clamp-1">{restaurant.name}</h3>
                                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-900/20 dark:text-green-300">
                                                <Star size={14} fill="currentColor" />
                                                <span className="text-sm font-medium">{restaurant.rating || "4.5"}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                            {restaurant.categories?.join(', ') || 'Multiple cuisines'}
                                        </p>

                                        <div className="mt-3 flex items-center text-sm text-gray-500">
                                            <MapPin size={14} className="mr-1 flex-shrink-0" />
                                            <span className="line-clamp-1">
                                                {restaurant.location || 'Unknown location'}
                                            </span>
                                        </div>
                                        <div className="mt-1 flex items-center text-sm text-gray-500">
                                            <Clock size={14} className="mr-1 flex-shrink-0" />
                                            <span>Delivery: {restaurant.delivery_time || '30-45 min'}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-0 pb-3">
                                        <Link href={`/restaurants/${restaurant.id}`} className="w-full">
                                            <Button variant="default" className="w-full" size="sm">
                                                View Menu
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right scroll button */}
                    <button
                        onClick={() => scroll('right')}
                        className={cn(
                            "absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2 bg-white dark:bg-gray-800 shadow-md",
                            "transition hover:bg-gray-100 dark:hover:bg-gray-700",
                            !canScrollRight && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={!canScrollRight}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Pagination dots */}
                <div className="flex justify-center space-x-2 mt-6">
                    {Array.from({ length: Math.ceil(restaurants.length / slidesToShow) }).map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                "block h-2 w-2 rounded-full transition-all duration-300",
                                activeIndex === i
                                    ? "bg-primary w-6"
                                    : "bg-gray-300 dark:bg-gray-600"
                            )}
                        ></span>
                    ))}
                </div>

                {/* Mobile view all button */}
                <div className="mt-6 flex justify-center md:hidden">
                    <Link href="/restaurants">
                        <Button variant="outline" className="w-full">
                            View All Restaurants
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedRestaurants; 