import React from 'react';
import { Link } from '@inertiajs/react';
import { Star, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PopularDishes = ({ dishes }) => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Popular Dishes
                        </h2>
                        <p className="text-gray-600 max-w-2xl">
                            Discover our most ordered dishes loved by thousands of customers
                        </p>
                    </div>
                    <Link 
                        href="/menu" 
                        className="hidden md:flex items-center text-primary hover:text-primary/90 font-semibold"
                    >
                        View All
                        <ChevronRight className="w-5 h-5 ml-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dishes?.map((dish, index) => (
                        <motion.div
                            key={dish.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                        >
                            <Link href={`/menu/${dish.slug}`}>
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={dish.image}
                                        alt={dish.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    {dish.discount && (
                                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {dish.discount}% OFF
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        <span>{dish.rating}</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                                            {dish.name}
                                        </h3>
                                        <span className="text-primary font-bold">
                                            {dish.price}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {dish.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Clock className="h-4 w-4 mr-1" />
                                            <span>{dish.preparation_time}</span>
                                        </div>
                                        <Link 
                                            href={`/restaurants/${dish.restaurant.slug}`}
                                            className="text-sm text-primary hover:text-primary/90"
                                        >
                                            {dish.restaurant.name}
                                        </Link>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-8 md:hidden">
                    <Link
                        href="/menu"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-full transition-colors"
                    >
                        <span>View All Dishes</span>
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PopularDishes; 