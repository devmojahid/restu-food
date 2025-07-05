import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Star, Award, Clock, MapPin, ArrowRight } from 'lucide-react';

const TopRatedRestaurants = ({ restaurants = [] }) => {
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
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                    <div className="flex items-center">
                        <Award className="text-primary mr-3 h-8 w-8" />
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">Top Rated Restaurants</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Exceptional dining experiences with the highest ratings
                            </p>
                        </div>
                    </div>
                    <Link href="/restaurants?sort=rating_desc" className="mt-4 md:mt-0">
                        <Button variant="outline" className="flex items-center gap-2">
                            See More
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {restaurants.map((restaurant, index) => (
                        <motion.div key={restaurant.id || index} variants={itemVariants}>
                            <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
                                <div className="flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        {restaurant.image ? (
                                            <img
                                                src={restaurant.image}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400">No Image</span>
                                            </div>
                                        )}

                                        {/* Rating Badge */}
                                        <div className="absolute top-3 right-3 rounded-full bg-white dark:bg-gray-800 px-2.5 py-1.5 flex items-center gap-1 shadow-md">
                                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                            <span className="font-bold text-sm">{restaurant.rating}</span>
                                        </div>

                                        {/* Category Badge */}
                                        {restaurant.categories && restaurant.categories[0] && (
                                            <div className="absolute bottom-3 left-3">
                                                <Badge className="bg-primary/90">{restaurant.categories[0]}</Badge>
                                            </div>
                                        )}
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg">{restaurant.name}</h3>
                                            <Badge variant="outline" className="font-normal">
                                                {restaurant.price_range}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2 mt-3">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin size={14} className="mr-1.5" />
                                                <span className="line-clamp-1">{restaurant.location || 'Unknown location'}</span>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock size={14} className="mr-1.5" />
                                                <span>Delivery: {restaurant.delivery_time || '30-45 min'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            {restaurant.offer ? (
                                                <Badge variant="secondary" className="flex-1 justify-center bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-normal">
                                                    {restaurant.offer}
                                                </Badge>
                                            ) : (
                                                <div className="flex-1" />
                                            )}

                                            <Link href={`/restaurants/${restaurant.id}`}>
                                                <Button variant="link" size="sm" className="gap-1">
                                                    Order Now
                                                    <ArrowRight size={14} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TopRatedRestaurants; 