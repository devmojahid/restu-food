import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Store,
    Star,
    MapPin,
    ChevronRight,
    Clock,
    Utensils,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const SimilarRestaurants = ({ similarRestaurants = null }) => {
    // If similarRestaurants is null or empty, display placeholder message
    if (!similarRestaurants || similarRestaurants.length === 0) {
        return (
            <section id="similar-restaurants" className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Similar Restaurants</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                        <Store className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Suggestions Available</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            We couldn't find any similar restaurants to recommend at this time.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="similar-restaurants" className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                            <Store className="w-6 h-6 text-primary" />
                            You Might Also Like
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Discover more restaurants similar to this one that you might enjoy
                        </p>
                    </div>

                    {similarRestaurants.viewAllLink && (
                        <a
                            href={similarRestaurants.viewAllLink}
                            className="inline-flex items-center gap-2 mt-4 md:mt-0 text-primary hover:text-primary/90 font-medium transition-colors"
                        >
                            <span>View All Similar Restaurants</span>
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {similarRestaurants.map((restaurant, index) => (
                        <RestaurantCard
                            key={index}
                            restaurant={restaurant}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const RestaurantCard = ({ restaurant, index }) => {
    if (!restaurant) return null;

    // Format rating to display stars
    const renderRating = (rating) => {
        if (!rating && rating !== 0) return null;

        return (
            <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{rating.toFixed(1)}</span>
                {restaurant.reviewCount && (
                    <span className="text-gray-500 text-sm">({restaurant.reviewCount})</span>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md h-full flex flex-col group"
        >
            {/* Restaurant Image */}
            <div className="relative h-48 overflow-hidden">
                {restaurant.image ? (
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <AlertCircle className="w-12 h-12 text-gray-400" />
                    </div>
                )}

                {/* Promotion Badge */}
                {restaurant.promotionBadge && (
                    <div className="absolute top-4 left-0">
                        <Badge className="bg-primary text-white rounded-l-none px-3">
                            {restaurant.promotionBadge}
                        </Badge>
                    </div>
                )}

                {/* Quick Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex flex-wrap gap-2">
                        {restaurant.categories?.map((category, idx) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className="bg-black/30 text-white border-none"
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            {/* Restaurant Info */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-auto">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold line-clamp-1">{restaurant.name}</h3>
                        {renderRating(restaurant.rating)}
                    </div>

                    {/* Location */}
                    {restaurant.location && (
                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{restaurant.location}</span>
                        </div>
                    )}

                    {/* Cuisine */}
                    {restaurant.cuisine && (
                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                            <Utensils className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">{restaurant.cuisine}</span>
                        </div>
                    )}

                    {/* Hours */}
                    {restaurant.hours && (
                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm mb-4">
                            <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span>{restaurant.hours}</span>
                        </div>
                    )}

                    {/* Description */}
                    {restaurant.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {restaurant.description}
                        </p>
                    )}
                </div>

                {/* Action Button */}
                <Link
                    href={restaurant.url || '#'}
                    className="w-full inline-flex items-center justify-center rounded-md bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2 mt-2"
                >
                    View Restaurant
                </Link>
            </div>
        </motion.div>
    );
};

export default SimilarRestaurants; 