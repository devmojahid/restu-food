import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const StatsSection = ({ data }) => {
    // Ensure data has all required properties with fallbacks
    const title = data?.title || 'Our Numbers';
    const subtitle = data?.subtitle || 'Key Statistics';
    const stats = data?.stats || [];

    // Dynamically get Lucide icons by name
    const getIconComponent = (iconName) => {
        const Icon = LucideIcons[iconName] || LucideIcons.BarChart;
        return <Icon className="w-8 h-8 text-primary" />;
    };

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-4"
                    >
                        <span>{subtitle}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
                    >
                        {title}
                    </motion.h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                            className={cn(
                                "p-6 rounded-2xl text-center",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-100 dark:border-gray-700",
                                "shadow-lg hover:shadow-xl hover:border-primary/20",
                                "transition-all duration-300",
                                "group"
                            )}
                        >
                            <div className="flex justify-center mb-4">
                                {getIconComponent(stat.icon)}
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection; 