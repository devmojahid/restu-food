import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { Star, Clock, ChevronRight, Store } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const SimilarRestaurants = ({ restaurants }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Similar Restaurants
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Discover more restaurants you might like
                        </p>
                    </div>
                    <Button variant="outline" className="hidden sm:flex items-center gap-2">
                        View All
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Restaurants Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {restaurants.map((restaurant) => (
                        <motion.div
                            key={restaurant.id}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className={cn(
                                "group relative bg-white dark:bg-gray-800 rounded-xl",
                                "overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                                "border border-gray-100 dark:border-gray-700"
                            )}
                        >
                            <Link href={`/restaurants/${restaurant.slug}`}>
                                {/* Restaurant Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    {/* Cuisine Types */}
                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                        {restaurant.cuisine_types.slice(0, 2).map((cuisine, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="bg-white/90 dark:bg-gray-900/90 shadow-sm"
                                            >
                                                {cuisine}
                                            </Badge>
                                        ))}
                                        {restaurant.cuisine_types.length > 2 && (
                                            <Badge
                                                variant="secondary"
                                                className="bg-white/90 dark:bg-gray-900/90 shadow-sm"
                                            >
                                                +{restaurant.cuisine_types.length - 2} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Restaurant Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                        {restaurant.name}
                                    </h3>

                                    {/* Rating & Delivery Time */}
                                    <div className="flex items-center justify-between text-sm mb-3">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {restaurant.rating}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <span>{restaurant.delivery_time} mins</span>
                                        </div>
                                    </div>

                                    {/* Quick Info */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Store className="w-4 h-4" />
                                            <span className="line-clamp-1">
                                                {restaurant.distance} km away
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" className="gap-2">
                                        View Restaurant
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mobile View All Button */}
                <div className="mt-6 sm:hidden">
                    <Button variant="outline" className="w-full">
                        View All Similar Restaurants
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default SimilarRestaurants; 