import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Trophy, Users, Gift, Utensils, Award } from 'lucide-react';

const StatsSection = ({ data = {} }) => {
    const {
        title = 'Our Rewards Program by the Numbers',
        description = 'Join thousands of satisfied customers enjoying exclusive rewards and benefits.',
        stats = []
    } = data;

    // Ensure stats is an array
    const safeStats = Array.isArray(stats) ? stats : [];

    // Default stats if none provided
    const defaultStats = [
        {
            icon: 'Users',
            value: '500K+',
            label: 'Active Members',
            color: 'bg-blue-500'
        },
        {
            icon: 'Trophy',
            value: '10M+',
            label: 'Points Earned',
            color: 'bg-amber-500'
        },
        {
            icon: 'Gift',
            value: '250K+',
            label: 'Rewards Redeemed',
            color: 'bg-green-500'
        },
        {
            icon: 'Utensils',
            value: '750K+',
            label: 'Orders Made',
            color: 'bg-purple-500'
        }
    ];

    // Use provided stats or fallback to defaults
    const displayStats = safeStats.length > 0 ? safeStats : defaultStats;

    // Helper function to get icon component based on icon name
    const getIconComponent = (iconName) => {
        const icons = {
            'Users': Users,
            'Trophy': Trophy,
            'Gift': Gift,
            'Utensils': Utensils,
            'Award': Award
        };

        const IconComponent = icons[iconName] || Trophy;
        return <IconComponent className="h-6 w-6" />;
    };

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-50 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-64 md:h-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-64 md:h-64 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold mb-4"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        {description}
                    </motion.p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayStats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className="relative"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center h-full border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                                <div className="flex justify-center mb-4">
                                    <div className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center text-white",
                                        stat.color || "bg-primary"
                                    )}>
                                        {typeof stat.icon === 'string'
                                            ? getIconComponent(stat.icon)
                                            : stat.icon || <Trophy className="h-6 w-6" />}
                                    </div>
                                </div>
                                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>

                            {/* Decorative Element */}
                            <div className="absolute top-0 right-0 w-12 h-12 -mt-2 -mr-2 bg-primary/10 rounded-full blur-xl hidden lg:block pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection; 