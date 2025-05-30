import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    Store,
    Star,
    Clock,
    Navigation,
    ChevronLeft,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const SimilarRestaurants = ({ similarRestaurants = [] }) => {
    const carouselRef = useRef(null);

    if (!similarRestaurants?.length) {
        return null;
    }

    const scrollPrev = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollNext = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-16">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center mb-4"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Store className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold">Similar Restaurants</h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        You might also like these restaurants with similar cuisines and styles
                    </motion.p>
                </div>

                <div className="hidden md:flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={scrollPrev}
                        className="rounded-full"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={scrollNext}
                        className="rounded-full"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Carousel */}
            <div
                ref={carouselRef}
                className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            >
                {similarRestaurants.map((restaurant, index) => (
                    <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        index={index}
                    />
                ))}
            </div>

            {/* View All Button */}
            <div className="mt-8 text-center">
                <Link href="/restaurants">
                    <Button variant="outline" className="gap-2 group">
                        <span>View All Restaurants</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </section>
    );
};

const RestaurantCard = ({ restaurant, index }) => {
    const {
        id,
        name,
        slug,
        image,
        cuisineTypes = [],
        priceRange,
        rating,
        reviewsCount,
        distance,
        estimatedDeliveryTime,
        isOpen,
    } = restaurant;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[300px] max-w-[300px] snap-start"
        >
            <Link
                href={`/restaurant/${slug}`}
                className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full"
            >
                {/* Restaurant Image */}
                <div className="relative h-44">
                    <img
                        src={image || '/images/restaurants/placeholder.jpg'}
                        alt={name}
                        className="w-full h-full object-cover"
                    />

                    {/* Price Range Badge */}
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-black dark:bg-black/80 dark:text-white">
                            {priceRange}
                        </Badge>
                    </div>

                    {/* Open/Closed Status */}
                    <div className="absolute top-4 right-4">
                        <Badge
                            className={cn(
                                "text-white",
                                isOpen
                                    ? "bg-green-500/90"
                                    : "bg-gray-500/90"
                            )}
                        >
                            {isOpen ? 'Open Now' : 'Closed'}
                        </Badge>
                    </div>

                    {/* Restaurant Name & Rating Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-lg font-bold text-white mb-1 truncate">{name}</h3>

                        <div className="flex items-center">
                            <div className="flex items-center text-yellow-400 mr-2">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-white text-sm ml-1">{rating.toFixed(1)}</span>
                            </div>
                            <span className="text-xs text-gray-300">({reviewsCount} reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Restaurant Details */}
                <div className="p-4">
                    {/* Cuisine Types */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {cuisineTypes.map((cuisine, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className="bg-gray-50 dark:bg-gray-700 text-xs"
                            >
                                {cuisine}
                            </Badge>
                        ))}
                    </div>

                    {/* Restaurant Metrics */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{estimatedDeliveryTime} min</span>
                        </div>

                        <div className="flex items-center">
                            <Navigation className="w-3 h-3 mr-1" />
                            <span>{distance} mi</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default SimilarRestaurants; 