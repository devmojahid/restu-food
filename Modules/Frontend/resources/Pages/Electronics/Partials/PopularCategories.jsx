import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronRight, Laptop, Smartphone, Headphones, Camera, Watch, Tv, Speaker, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

// Icons mapping for different categories
const categoryIcons = {
    'Laptops': Laptop,
    'Smartphones': Smartphone,
    'Headphones': Headphones,
    'Cameras': Camera,
    'Smartwatches': Watch,
    'Televisions': Tv,
    'Speakers': Speaker,
    'Computer Components': Cpu,
    // Add more mappings as needed
};

// Gradients for categories
const categoryGradients = {
    'Laptops': 'from-blue-500 to-indigo-600',
    'Smartphones': 'from-pink-500 to-purple-600',
    'Headphones': 'from-green-500 to-teal-600',
    'Cameras': 'from-yellow-500 to-amber-600',
    'Smartwatches': 'from-red-500 to-rose-600',
    'Televisions': 'from-cyan-500 to-blue-600',
    'Speakers': 'from-violet-500 to-purple-600',
    'Computer Components': 'from-gray-700 to-gray-900',
    // Default gradient
    'default': 'from-primary to-primary/80'
};

const CategoryCard = ({ category, index }) => {
    const IconComponent = categoryIcons[category.name] || Cpu;
    const gradientClass = categoryGradients[category.name] || categoryGradients.default;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group overflow-hidden relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
        >
            <Link href={`/products?category=${category.slug}`} className="block">
                <div className={cn(
                    "h-40 md:h-44 flex flex-col items-center justify-center p-4 bg-gradient-to-r",
                    gradientClass
                )}>
                    <div className="bg-white/20 rounded-full p-4 mb-4 backdrop-blur-sm">
                        <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white text-center">{category.name}</h3>
                    {category.product_count && (
                        <p className="text-sm text-white/80 mt-1">
                            {category.product_count} Products
                        </p>
                    )}
                    
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300">
                        <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center 
                                     text-primary shadow-md">
                            <ChevronRight className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const CategoryGrid = ({ categories }) => {
    // Handle different grid layouts depending on number of categories
    const gridLayoutClass = cn(
        "grid gap-4 md:gap-6",
        categories.length <= 4 ? "grid-cols-2 md:grid-cols-4" :
        categories.length <= 6 ? "grid-cols-2 md:grid-cols-3" :
        "grid-cols-2 md:grid-cols-4"
    );
    
    return (
        <div className={gridLayoutClass}>
            {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
            ))}
        </div>
    );
};

const EmptyState = () => (
    <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Laptop className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Categories Found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            We're currently organizing our categories. Please check back soon!
        </p>
    </div>
);

const PopularCategories = ({ data = {} }) => {
    const { title = "Popular Categories", subtitle, categories = [] } = data;
    
    if (!categories.length) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    <EmptyState />
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                    >
                        {title}
                    </motion.h2>
                    
                    {subtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>

                {/* Categories Grid */}
                <CategoryGrid categories={categories} />

                {/* Browse All Link */}
                <div className="text-center mt-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-6 py-3 rounded-full transition-colors group"
                    >
                        <span>Browse All Categories</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PopularCategories; 