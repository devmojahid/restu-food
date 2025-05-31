import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ChevronRight, Utensils, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const ChefCategories = ({ categories = [] }) => {
    if (!categories?.length) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            Chef Categories
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Explore different types of culinary expertise from our talented chefs
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <CategoryCard key={index} category={category} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CategoryCard = ({ category, index }) => {
    if (!category) return null;

    // Animation variants for staggered entries
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                delay: index * 0.1
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="relative group rounded-2xl overflow-hidden h-64 shadow-lg hover:shadow-xl transition-all duration-300"
        >
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center h-full w-full transform group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url(${category.image || '/images/default-category.jpg'})` }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:via-black/50 transition-colors duration-300" />
            
            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                </h3>
                
                <p className="text-white/80 text-sm line-clamp-2 mb-4 max-w-xs">
                    {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                    <Badge className="bg-white/20 backdrop-blur-sm text-white px-3 py-1">
                        {category.chefCount || 0} Chefs
                    </Badge>
                    
                    <Link
                        href={`/chef?category=${category.slug}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/90 text-white transform group-hover:translate-x-1 transition-all duration-300"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ChefCategories; 