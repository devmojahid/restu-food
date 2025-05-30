import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const StatsSection = ({ data }) => {
    // Handle null data
    if (!data || !data.stats || data.stats.length === 0) {
        return null;
    }

    // Get the correct icon component
    const getIconComponent = (iconName) => {
        if (!iconName || typeof iconName !== 'string') return LucideIcons.BarChart;

        return LucideIcons[iconName] || LucideIcons.BarChart;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4">
                {data.title || 'Our Commitments'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {data.stats.map((stat, index) => {
                    const Icon = getIconComponent(stat.icon);
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={cn(
                                "p-4 rounded-lg text-center group",
                                "border border-gray-100 dark:border-gray-700",
                                "hover:border-primary/30 dark:hover:border-primary/30 transition-all"
                            )}
                        >
                            <div className="inline-flex p-2 rounded-full bg-primary/10 text-primary mb-3">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                {stat.value}
                            </div>
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {stat.label}
                            </div>
                            {stat.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {stat.description}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default StatsSection; 