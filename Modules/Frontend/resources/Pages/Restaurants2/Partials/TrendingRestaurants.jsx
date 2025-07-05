import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';

const TrendingRestaurants = ({ restaurants = [] }) => {
    // No restaurants to display
    if (!restaurants?.length) {
        return null;
    }

    // Animation variants
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
        <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                    <div className="flex items-center">
                        <TrendingUp className="text-primary mr-3 h-7 w-7" />
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">Trending This Week</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Restaurants everyone is loving right now
                            </p>
                        </div>
                    </div>
                    <Link href="/restaurants?sort=trending" className="mt-4 md:mt-0">
                        <Button variant="outline" className="flex items-center gap-2">
                            See More Trending
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {restaurants.slice(0, 3).map((restaurant, index) => (
                        <motion.div
                            key={restaurant.id || index}
                            variants={itemVariants}
                            className="group relative h-[280px] rounded-xl overflow-hidden"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                {restaurant.image ? (
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No Image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30"></div>
                            </div>

                            {/* Trending Badge */}
                            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-semibold py-1.5 px-3 rounded-full flex items-center gap-1">
                                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                                <span>Trending</span>
                            </div>

                            {/* Rating Badge */}
                            <div className="absolute top-4 right-4 rounded-full bg-white/90 dark:bg-gray-800 px-2.5 py-1 flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                <span className="font-bold text-xs">{restaurant.rating}</span>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col">
                                <h3 className="font-bold text-xl text-white mb-1">
                                    {restaurant.name}
                                </h3>
                                <p className="text-white/80 text-sm mb-3">
                                    {restaurant.categories?.join(', ') || 'Multiple cuisines'}
                                </p>

                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="flex items-center text-white/70 text-xs">
                                        <MapPin size={12} className="mr-1.5" />
                                        <span>{restaurant.location || 'Unknown location'}</span>
                                    </div>
                                    <div className="flex items-center text-white/70 text-xs">
                                        <Clock size={12} className="mr-1.5" />
                                        <span>{restaurant.delivery_time || '30-45 min'}</span>
                                        <div className="mx-2 h-1 w-1 rounded-full bg-white/40"></div>
                                        <span>{restaurant.price_range}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    {restaurant.offer ? (
                                        <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                                            {restaurant.offer}
                                        </Badge>
                                    ) : (
                                        <div></div>
                                    )}

                                    <Link href={`/restaurants/${restaurant.id}`} className="group-hover:translate-x-1 transition-transform">
                                        <Button size="sm" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                                            Order Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Overlay for hover effect */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mobile View More Button */}
                <div className="md:hidden flex justify-center mt-8">
                    <Link href="/restaurants?sort=trending">
                        <Button variant="outline" className="w-full">See All Trending</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TrendingRestaurants; 