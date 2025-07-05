import React, { useRef, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const NearbyRestaurants = ({ restaurants = [] }) => {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Check if we can scroll left/right
    useEffect(() => {
        if (!scrollContainerRef.current) return;

        const checkScrollButtons = () => {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        };

        // Initial check
        checkScrollButtons();

        // Add scroll event listener
        scrollContainerRef.current.addEventListener('scroll', checkScrollButtons);

        // Handle resize
        window.addEventListener('resize', checkScrollButtons);

        return () => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.removeEventListener('scroll', checkScrollButtons);
            }
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [restaurants]);

    // No restaurants to display
    if (!restaurants?.length) {
        return null;
    }

    // Handle scroll
    const scroll = (direction) => {
        if (!scrollContainerRef.current) return;

        const { clientWidth } = scrollContainerRef.current;
        const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;

        scrollContainerRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <MapPin className="mr-3 h-6 w-6 text-primary" />
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">Nearby Restaurants</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Delicious food just minutes away from you
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className={cn(!canScrollLeft && "opacity-50 cursor-not-allowed")}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className={cn(!canScrollRight && "opacity-50 cursor-not-allowed")}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex space-x-5 overflow-x-auto scrollbar-hide pb-6 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none' }}
                >
                    {restaurants.map((restaurant, index) => (
                        <motion.div
                            key={restaurant.id || index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-start"
                        >
                            <Link href={`/restaurants/${restaurant.id}`}>
                                <div className="group relative h-56 rounded-lg overflow-hidden">
                                    {restaurant.image ? (
                                        <img
                                            src={restaurant.image}
                                            alt={restaurant.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No Image</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                        <div className="absolute top-3 right-3 rounded-full bg-white dark:bg-gray-800 px-2.5 py-1 flex items-center gap-1 shadow-md">
                                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                            <span className="font-bold text-xs">{restaurant.rating}</span>
                                        </div>

                                        <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-medium py-1 px-2 rounded">
                                            {restaurant.distance} km away
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <h3 className="font-bold text-lg text-white">{restaurant.name}</h3>
                                            <p className="text-white/80 text-sm line-clamp-1">
                                                {restaurant.categories?.join(', ') || 'Multiple cuisines'}
                                            </p>

                                            <div className="flex items-center text-white/80 text-xs mt-1">
                                                <Clock size={12} className="mr-1" />
                                                <span>{restaurant.delivery_time || '30-45 min'}</span>
                                                <span className="mx-2">•</span>
                                                <span>{restaurant.price_range}</span>
                                            </div>

                                            {restaurant.offer && (
                                                <div className="bg-primary/20 border border-primary/30 text-white text-xs rounded-sm px-2 py-0.5 mt-1.5 inline-block w-fit">
                                                    {restaurant.offer}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-center mt-8">
                    <Link href="/restaurants?sort=distance_asc">
                        <Button variant="outline" className="flex items-center gap-2">
                            View All Nearby Restaurants
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default NearbyRestaurants; 