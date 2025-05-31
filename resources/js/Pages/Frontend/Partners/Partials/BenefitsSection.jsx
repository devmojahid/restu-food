import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const BenefitsSection = ({ data }) => {
    // Ensure data has all required properties with fallbacks
    const title = data?.title || 'Benefits';
    const subtitle = data?.subtitle || 'Why Choose Us';
    const description = data?.description || 'Discover the advantages of partnering with us.';
    const benefits = data?.benefits || [];

    // Dynamically get Lucide icons by name
    const getIconComponent = (iconName) => {
        const Icon = LucideIcons[iconName] || LucideIcons.Star;
        return <Icon className="w-10 h-10 text-primary" />;
    };

    return (
        <section className="py-20 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
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
                        className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                    >
                        {title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        {description}
                    </motion.p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                            className={cn(
                                "p-6 rounded-2xl transition-all duration-300",
                                "bg-white dark:bg-gray-800",
                                "border border-gray-100 dark:border-gray-700",
                                "hover:shadow-xl hover:border-primary/20",
                                "group"
                            )}
                        >
                            <div className="mb-4 p-3 bg-primary/10 rounded-xl inline-block">
                                {getIconComponent(benefit.icon)}
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                {benefit.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400">
                                {benefit.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection; 