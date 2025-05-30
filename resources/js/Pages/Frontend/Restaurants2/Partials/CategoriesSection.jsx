import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { GripHorizontal, ArrowRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const CategoriesSection = ({ categories = [] }) => {
    // No categories to display
    if (!categories?.length) {
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

    // Get either 6 or 8 categories based on array length
    const displayCategories = categories.slice(0, categories.length >= 8 ? 8 : 6);

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                    <div className="flex items-center">
                        <GripHorizontal className="text-primary mr-3 h-6 w-6" />
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">Restaurant Categories</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Browse restaurants by category
                            </p>
                        </div>
                    </div>
                    <Link href="/categories" className="mt-4 md:mt-0">
                        <Button variant="outline" className="flex items-center gap-2">
                            View All Categories
                            <ArrowRight size={16} />
                        </Button>
                    </Link>
                </div>

                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {displayCategories.map((category, index) => (
                        <motion.div
                            key={category.id || index}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Link href={`/categories/${category.id}`} className="block h-full">
                                <div className="group relative h-36 md:h-44 rounded-lg overflow-hidden">
                                    {/* Background Image */}
                                    {category.image ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No Image</span>
                                        </div>
                                    )}

                                    {/* Overlay with Info */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 flex items-center justify-center p-4">
                                        <div className="text-center">
                                            <h3 className="font-bold text-xl text-white mb-1 group-hover:scale-110 transition-transform">
                                                {category.name}
                                            </h3>
                                            <p className="text-white/70 text-sm">
                                                {category.count} {category.count === 1 ? 'restaurant' : 'restaurants'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mobile View More Button */}
                <div className="md:hidden flex justify-center mt-8">
                    <Link href="/categories">
                        <Button variant="outline" className="w-full">View All Categories</Button>
                    </Link>
                </div>

                {/* Description Block */}
                <div className="mt-12 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">Explore by Restaurant Type</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Find the perfect dining experience by browsing our curated categories. Whether you're looking for fine dining, casual eateries,
                        quick bites, or specialty cuisines, our categories help you discover restaurants that match your preferences.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category, index) => (
                            <Link
                                key={category.id || index}
                                href={`/categories/${category.id}`}
                                className="text-sm text-primary hover:text-primary/80 hover:underline"
                            >
                                {category.name}
                                {index < categories.length - 1 && <span className="text-gray-400 ml-3">•</span>}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection; 