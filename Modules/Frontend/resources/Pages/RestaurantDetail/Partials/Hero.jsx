import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ChevronRight, Home, Star, Clock, MapPin, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const Hero = ({ data, restaurant }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll effect for parallax
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative">
            {/* Background Image with Parallax Effect */}
            <div
                className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden"
                style={{ backgroundColor: '#111' }}
            >
                {restaurant?.coverImage && (
                    <motion.div
                        style={{
                            backgroundImage: `url(${restaurant.coverImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                        animate={{ y: isScrolled ? -50 : 0 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                    />
                )}

                {/* Gradient Overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"
                    style={{ backgroundColor: data?.overlayColor || 'rgba(0, 0, 0, 0.4)' }}
                />

                {/* Breadcrumbs */}
                <div className="absolute top-20 left-0 right-0 z-10">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center text-white/80 text-sm">
                            <Link href="/" className="flex items-center hover:text-white transition-colors">
                                <Home className="w-3.5 h-3.5 mr-1" />
                                <span>Home</span>
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 mx-2" />
                            <Link href="/restaurants" className="hover:text-white transition-colors">
                                Restaurants
                            </Link>
                            <ChevronRight className="w-3.5 h-3.5 mx-2" />
                            <span className="text-white">{restaurant?.name || 'Restaurant Detail'}</span>
                        </div>
                    </div>
                </div>

                {/* Restaurant Quick Info */}
                <div className="absolute bottom-0 left-0 right-0 z-10 pb-6">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 text-white">
                            {/* Restaurant Logo */}
                            {restaurant?.logoUrl && (
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-4 border-white">
                                    <img
                                        src={restaurant.logoUrl}
                                        alt={`${restaurant.name} logo`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                {/* Restaurant Name */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-2xl md:text-3xl lg:text-4xl font-bold"
                                >
                                    {restaurant?.name || 'Restaurant Name'}
                                </motion.h1>

                                {/* Quick Details */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:text-base">
                                    {/* Rating */}
                                    {restaurant?.rating && (
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                            <span>{restaurant.rating}</span>
                                            {restaurant?.reviewsCount && (
                                                <span className="ml-1 text-white/70">({restaurant.reviewsCount})</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Price Range */}
                                    {restaurant?.priceRange && (
                                        <div className="flex items-center">
                                            <DollarSign className="w-4 h-4 mr-1" />
                                            <span>{restaurant.priceRange}</span>
                                        </div>
                                    )}

                                    {/* Cuisine Types */}
                                    {restaurant?.cuisineTypes?.length > 0 && (
                                        <div className="flex items-center">
                                            <span>{restaurant.cuisineTypes.join(', ')}</span>
                                        </div>
                                    )}

                                    {/* Distance */}
                                    {restaurant?.distance && (
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span>{restaurant.distance} km</span>
                                        </div>
                                    )}

                                    {/* Open Status */}
                                    <Badge
                                        variant={restaurant?.isOpen ? "success" : "destructive"}
                                        className={cn(
                                            "rounded-full text-xs font-medium",
                                            restaurant?.isOpen
                                                ? "bg-green-500/20 text-green-500 border-green-500/20"
                                                : "bg-red-500/20 text-red-500 border-red-500/20"
                                        )}
                                    >
                                        {restaurant?.isOpen ? "Open Now" : "Closed"}
                                    </Badge>
                                </div>

                                {/* Badges */}
                                {restaurant?.badges?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {restaurant.badges.map((badge, index) => (
                                            <Badge
                                                key={index}
                                                className="bg-white/10 hover:bg-white/20 text-white border-white/10"
                                            >
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 md:mt-0 md:ml-auto flex gap-3">
                                <Button
                                    variant="outline"
                                    className="rounded-full border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50"
                                >
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Directions
                                </Button>
                                <Button
                                    className="rounded-full"
                                >
                                    <Clock className="w-4 h-4 mr-2" />
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero; 