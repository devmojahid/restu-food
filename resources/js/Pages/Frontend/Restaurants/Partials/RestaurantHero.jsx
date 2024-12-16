import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Utensils } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const RestaurantHero = ({ restaurant = {} }) => {
    const {
        name = '',
        cover_image = '',
        logo = '',
        cuisine_types = [],
        rating = '0.0',
        reviews_count = 0,
        delivery_info = {},
        address = {},
        badges = []
    } = restaurant || {};

    // Ensure arrays are actually arrays
    const cuisineTypesList = Array.isArray(cuisine_types) ? cuisine_types : [];
    const badgesList = Array.isArray(badges) ? badges : [];

    // Format rating safely
    const displayRating = typeof rating === 'number' 
        ? rating.toFixed(1) 
        : parseFloat(String(rating || '0')).toFixed(1);

    // Ensure nested objects exist with default values
    const formattedAddress = address?.formatted || 'Address not available';
    const deliveryTime = delivery_info?.estimated_time || '30-45';

    return (
        <div className="relative">
            {/* Cover Image */}
            <div className="relative h-[300px] md:h-[400px]">
                <img
                    src={cover_image || '/images/placeholder-cover.jpg'}
                    alt={`${name || 'Restaurant'} cover`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Restaurant Info */}
            <div className="container mx-auto px-4">
                <div className="relative -mt-24 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <img
                                src={logo || '/images/placeholder-logo.jpg'}
                                alt={`${name} logo`}
                                className="w-24 h-24 rounded-xl object-cover border-4 border-white dark:border-gray-700"
                            />
                        </div>

                        {/* Details */}
                        <div className="flex-grow">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {name}
                            </h1>

                            {/* Cuisine Types - with null check */}
                            {cuisineTypesList.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {cuisineTypesList.map((cuisine, index) => (
                                        <span
                                            key={index}
                                            className="text-sm text-gray-600 dark:text-gray-400"
                                        >
                                            {cuisine}
                                            {index < cuisineTypesList.length - 1 && " • "}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                {/* Rating */}
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-medium">{displayRating}</span>
                                    <span>({reviews_count} reviews)</span>
                                </div>

                                {/* Delivery Time */}
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{deliveryTime} mins</span>
                                </div>

                                {/* Address */}
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{formattedAddress}</span>
                                </div>
                            </div>

                            {/* Badges - with null check */}
                            {badgesList.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {badgesList.map((badge, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantHero; 