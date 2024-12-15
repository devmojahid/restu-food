import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { 
    ChevronRight,
    Utensils,
    TrendingUp,
    Store,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const CuisineCard = ({ cuisine, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg 
                     hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            <Link href={`/restaurants?cuisine=${cuisine.slug}`}>
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={cuisine.image}
                        alt={cuisine.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 
                               transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 
                                via-black/30 to-transparent" />
                    
                    {/* Restaurant Count Badge */}
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-primary backdrop-blur-sm">
                            <Store className="w-3 h-3 mr-1" />
                            {cuisine.restaurant_count} Places
                        </Badge>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 
                               group-hover:text-primary transition-colors">
                        {cuisine.name}
                    </h3>

                    {/* Popular Dishes */}
                    <div className="space-y-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Popular Dishes:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {cuisine.popular_dishes.map((dish, i) => (
                                <Badge
                                    key={i}
                                    variant="secondary"
                                    className="bg-gray-100 dark:bg-gray-700"
                                >
                                    {dish}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* View Restaurants Button */}
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                        <Button
                            variant="ghost"
                            className="w-full justify-between text-primary hover:text-primary/90"
                        >
                            <span>View Restaurants</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const PopularCuisines = ({ cuisines }) => {
    if (!cuisines?.length) return null;

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center space-x-2 mb-4">
                            <Utensils className="w-6 h-6 text-primary" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Popular Cuisines
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Explore restaurants by your favorite cuisine type
                        </p>
                    </motion.div>

                    <Link 
                        href="/restaurants"
                        className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                               font-semibold transition-colors group mt-4 md:mt-0"
                    >
                        <span>View All Cuisines</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Cuisine Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cuisines.map((cuisine, index) => (
                        <CuisineCard key={cuisine.id} cuisine={cuisine} index={index} />
                    ))}
                </div>

                {/* View All Button (Mobile) */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/restaurants"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-8 py-4 rounded-full transition-colors group"
                    >
                        <span>Explore All Cuisines</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PopularCuisines; 