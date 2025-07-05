import React from 'react';
import { motion } from 'framer-motion';
import {
    UserPlus,
    TrendingUp,
    LineChart,
    Gift,
    ArrowRight,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const HowItWorks = ({ data = {} }) => {
    const {
        title = 'How It Works',
        description = 'Our rewards program is easy to use. Follow these simple steps to start earning and redeeming rewards.',
        steps = []
    } = data;

    // Ensure steps is an array
    const safeSteps = Array.isArray(steps) ? steps : [];

    // Default steps if none provided
    const defaultSteps = [
        {
            title: 'Join the Program',
            description: 'Sign up for our rewards program for free. It only takes a minute.',
            icon: 'UserPlus',
            color: 'bg-blue-500'
        },
        {
            title: 'Earn Points',
            description: 'Earn points every time you order. The more you order, the more points you earn.',
            icon: 'TrendingUp',
            color: 'bg-green-500'
        },
        {
            title: 'Track Progress',
            description: 'Monitor your points balance and progress towards the next tier in your account.',
            icon: 'LineChart',
            color: 'bg-purple-500'
        },
        {
            title: 'Redeem Rewards',
            description: 'Use your points to redeem exciting rewards and discounts.',
            icon: 'Gift',
            color: 'bg-red-500'
        }
    ];

    // Use provided steps or fallback to defaults
    const displaySteps = safeSteps.length > 0 ? safeSteps : defaultSteps;

    // Helper function to render the correct icon
    const getIconComponent = (iconName) => {
        const icons = {
            'UserPlus': UserPlus,
            'TrendingUp': TrendingUp,
            'LineChart': LineChart,
            'Gift': Gift
        };

        const IconComponent = icons[iconName] || UserPlus;
        return <IconComponent className="h-6 w-6" />;
    };

    return (
        <section id="rewards-program" className="py-16 relative overflow-hidden">
            {/* Background Patterns */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full" />
                <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-primary/20 rounded-full" />
                <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-primary/20 rounded-full" />
                <div className="absolute top-2/3 left-1/2 w-6 h-6 bg-primary/20 rounded-full" />
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center rounded-full px-4 py-1 mb-4 
                                 bg-primary/10 text-primary text-sm font-medium"
                    >
                        Simple Process
                    </motion.div>
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

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {displaySteps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className="relative"
                        >
                            {/* Connector Line */}
                            {index < displaySteps.length - 1 && (
                                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0">
                                    <ArrowRight className="text-gray-300 dark:text-gray-700 absolute right-0 top-1/2 -translate-y-1/2" />
                                </div>
                            )}

                            {/* Card */}
                            <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg
                                          hover:shadow-xl transition-all duration-300 relative z-10
                                          border border-gray-100 dark:border-gray-700
                                          hover:border-primary/20 dark:hover:border-primary/20">
                                {/* Step Number */}
                                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white dark:bg-gray-800 
                                              border-2 border-primary text-primary flex items-center justify-center 
                                              font-bold text-sm">
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className={cn(
                                    "w-16 h-16 rounded-full mb-6 flex items-center justify-center text-white",
                                    step.color || "bg-primary"
                                )}>
                                    {typeof step.icon === 'string'
                                        ? getIconComponent(step.icon)
                                        : step.icon || <UserPlus className="h-6 w-6" />}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile View Only - Steps Navigation */}
                <div className="flex justify-center mt-8 lg:hidden">
                    <div className="flex space-x-2">
                        {displaySteps.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "w-2 h-2 rounded-full",
                                    index === 0 ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-16"
                >
                    <a href="/rewards/register" className="inline-flex items-center justify-center 
                                                        bg-primary hover:bg-primary/90 text-white 
                                                        font-medium px-6 py-3 rounded-full 
                                                        transition-colors group">
                        <span>Join Rewards Program</span>
                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks; 