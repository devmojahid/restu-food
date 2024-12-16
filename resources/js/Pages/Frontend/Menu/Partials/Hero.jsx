import React from 'react';
import { motion } from 'framer-motion';
import { Pizza, Clock, Star, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = ({ stats }) => {
    const defaultStats = [
        { icon: Pizza, label: 'Menu Items', value: '500+' },
        { icon: Clock, label: 'Prep Time', value: '15-30min' },
        { icon: Star, label: 'Rating', value: '4.8/5' },
        { icon: Tag, label: 'Special Offers', value: '20+' }
    ];

    const displayStats = Array.isArray(stats) ? stats : defaultStats;

    return (
        <section className="relative py-20 overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900/50" />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900" />

            {/* Content Container */}
            <div className="relative container mx-auto px-4">
                <div className="flex flex-col items-center text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full 
                                 bg-primary/10 text-primary text-sm mb-6"
                    >
                        <Pizza className="w-4 h-4" />
                        <span>Explore Our Menu</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6
                                 bg-clip-text text-transparent bg-gradient-to-r 
                                 from-gray-900 via-gray-800 to-gray-900
                                 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100"
                    >
                        Discover Our Delicious Menu
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 mb-12"
                    >
                        From signature dishes to daily specials, explore our carefully curated menu 
                        featuring fresh ingredients and authentic flavors.
                    </motion.p>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {displayStats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className={cn(
                                    "flex flex-col items-center p-4 rounded-2xl",
                                    "bg-white dark:bg-gray-800",
                                    "shadow-xl shadow-gray-200/50 dark:shadow-none",
                                    "border border-gray-100 dark:border-gray-700"
                                )}
                            >
                                <stat.icon className="w-5 h-5 text-primary mb-2" />
                                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {stat.value}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-64 h-64 
                         bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-64 h-64 
                         bg-secondary/10 rounded-full blur-3xl" />
        </section>
    );
};

export default Hero; 