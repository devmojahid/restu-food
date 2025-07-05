import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const HowItWorksSection = ({ data }) => {
    // Ensure data has all required properties with fallbacks
    const title = data?.title || 'How It Works';
    const subtitle = data?.subtitle || 'Simple Process';
    const description = data?.description || 'Follow these simple steps to get started.';
    const steps = data?.steps || [];

    // Dynamically get Lucide icons by name
    const getIconComponent = (iconName) => {
        const Icon = LucideIcons[iconName] || LucideIcons.CheckCircle;
        return <Icon className="w-6 h-6" />;
    };

    return (
        <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900/50">
            <h1>How It Works</h1>
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

                {/* Steps */}
                <div className="relative">
                    {/* Timeline connector for desktop */}
                    <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-1 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 z-0" />

                    <div className="space-y-12 md:space-y-0 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                                className={cn(
                                    "md:flex md:items-center",
                                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                )}
                            >
                                {/* Step Number */}
                                <div className={cn(
                                    "relative md:w-1/2 md:px-12",
                                    index % 2 === 0 ? "md:text-right" : "md:text-left",
                                )}>
                                    <div className="hidden md:flex absolute top-0 items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="md:hidden flex items-center mb-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white text-lg font-bold mr-4">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {step.title}
                                        </h3>
                                    </div>
                                    <h3 className="hidden md:block text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Center Icon (visible only on desktop) */}
                                <div className="hidden md:flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary z-10">
                                        {getIconComponent(step.icon)}
                                    </div>
                                </div>

                                {/* Empty Space for Layout */}
                                <div className="md:w-1/2" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection; 