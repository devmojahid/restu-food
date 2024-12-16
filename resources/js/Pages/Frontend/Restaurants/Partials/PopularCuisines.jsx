import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';
import PropTypes from 'prop-types';

const CuisineCard = ({ cuisine }) => {
    if (!cuisine) return null;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                "group relative bg-white dark:bg-gray-800 rounded-xl",
                "overflow-hidden shadow-sm hover:shadow-md transition-all",
                "border border-gray-100 dark:border-gray-700"
            )}
        >
            <Link href={`/restaurants?cuisine=${cuisine.slug}`}>
                <div className="relative aspect-square overflow-hidden">
                    <img
                        src={cuisine.image || 'https://via.placeholder.com/200'}
                        alt={cuisine.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">{cuisine.name}</h3>
                    <p className="text-sm opacity-90">
                        {cuisine.restaurants_count} {cuisine.restaurants_count === 1 ? 'Restaurant' : 'Restaurants'}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
};

const PopularCuisines = ({ cuisines = [] }) => {
    if (!Array.isArray(cuisines)) {
        console.warn('PopularCuisines: cuisines prop must be an array');
        return null;
    }

    if (cuisines.length === 0) {
        return null;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Popular Cuisines
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Explore restaurants by your favorite cuisine
                        </p>
                    </div>
                    <Button 
                        variant="outline" 
                        className="hidden sm:flex items-center gap-2"
                        as={Link}
                        href="/restaurants"
                    >
                        View All
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Cuisines Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                    {cuisines.map((cuisine) => (
                        <CuisineCard 
                            key={cuisine.id} 
                            cuisine={cuisine} 
                        />
                    ))}
                </motion.div>

                {/* Mobile View All Button */}
                <div className="mt-6 sm:hidden">
                    <Button 
                        variant="outline" 
                        className="w-full"
                        as={Link}
                        href="/restaurants"
                    >
                        View All Cuisines
                    </Button>
                </div>
            </div>
        </section>
    );
};

PopularCuisines.propTypes = {
    cuisines: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            image: PropTypes.string,
            restaurants_count: PropTypes.number.isRequired,
        })
    )
};

export default PopularCuisines; 