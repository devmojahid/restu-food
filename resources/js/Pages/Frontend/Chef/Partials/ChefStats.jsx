import React from 'react';
import { motion } from 'framer-motion';
import { 
    Utensils, 
    Award, 
    Users, 
    Clock, 
    Star, 
    Soup, 
    Globe, 
    BarChart,
    Map
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ChefStats = ({ stats = [] }) => {
    // Default stats if none provided
    const defaultStats = [
        { icon: Utensils, label: 'Professional Chefs', value: '50+' },
        { icon: Award, label: 'Culinary Awards', value: '120+' },
        { icon: Star, label: 'Michelin Stars', value: '8' },
        { icon: Users, label: 'Satisfied Customers', value: '15K+' },
        { icon: Clock, label: 'Years of Experience', value: '25+' },
        { icon: Utensils, label: 'Signature Dishes', value: '200+' },
        { icon: Globe, label: 'International Cuisines', value: '30+' },
        { icon: Map, label: 'Cities Served', value: '12' }
    ];

    // Use provided stats or default stats
    const displayStats = stats.length ? stats : defaultStats;

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
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            By The Numbers
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Our team of expert chefs brings years of experience and passion to create exceptional culinary experiences
                        </p>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {displayStats.map((stat, index) => {
                        const Icon = stat.icon;
                        
                        return (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 text-center"
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {stat.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default ChefStats; 