import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Timer, Truck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = ({ data }) => {
    // If no data provided, use default values
    const {
        title = 'Your Cart',
        subtitle = 'Complete Your Order',
        description = 'Review your cart, select delivery options, and proceed to checkout.',
        image = '/images/hero-cart.jpg',
        stats = []
    } = data || {};

    // Default stats if none provided
    const defaultStats = [
        { label: 'Items in Cart', value: '0', icon: ShoppingBag },
        { label: 'Delivery Time', value: '30-45 min', icon: Timer },
        { label: 'Free Delivery', value: 'Orders $30+', icon: Truck },
        { label: 'Payment Methods', value: '4', icon: CreditCard }
    ];

    // Use provided stats or fallback to defaults
    const displayStats = stats?.length > 0 ? stats : defaultStats;

    return (
        <section className="relative py-20 overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 opacity-30 dark:opacity-20"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />

            {/* Content Container */}
            <div className="relative container">
                <div className="flex flex-col items-center text-center">
                    {/* Small Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                                 bg-primary/10 text-primary text-sm mb-6"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{subtitle}</span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6
                                 bg-clip-text text-transparent bg-gradient-to-r 
                                 from-gray-900 via-gray-800 to-gray-900
                                 dark:from-white dark:via-gray-200 dark:to-white"
                    >
                        {title}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 mb-12"
                    >
                        {description}
                    </motion.p>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
                    >
                        {displayStats.map((stat, index) => {
                            const IconComponent = stat.icon || ShoppingBag;

                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.3 + (index * 0.1) }
                                    }}
                                    whileHover={{ y: -5 }}
                                    className="flex flex-col items-center p-4 rounded-2xl
                                             bg-white dark:bg-gray-800 shadow-xl shadow-gray-200/50
                                             dark:shadow-none border border-gray-100 dark:border-gray-700
                                             hover:border-primary/20 dark:hover:border-primary/20
                                             transition-all duration-300"
                                >
                                    <IconComponent className="w-6 h-6 text-primary mb-2" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            );
                        })}
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