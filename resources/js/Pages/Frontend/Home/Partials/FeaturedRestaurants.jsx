import React from 'react';
import { Link } from '@inertiajs/react';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedRestaurants = ({ restaurants }) => {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Featured Restaurants
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the best restaurants in your area with amazing food and exceptional service
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {restaurants?.map((restaurant, index) => (
                        <motion.div
                            key={restaurant.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <Link href={`/restaurants/${restaurant.slug}`}>
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        <span>{restaurant.rating}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">
                                        {restaurant.name}
                                    </h3>
                                    <div className="flex items-center space-x-2 text-gray-500 mb-4">
                                        <Clock className="h-4 w-4" />
                                        <span>{restaurant.delivery_time} mins</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {restaurant.categories.map((category, i) => (
                                            <span
                                                key={i}
                                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/restaurants"
                        className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full transition-colors"
                    >
                        <span>View All Restaurants</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedRestaurants; 