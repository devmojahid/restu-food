import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Package, Clock, Truck, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = ({ data = {} }) => {
    const {
        title = 'Track Your Order',
        subtitle = 'Real-time updates',
        description = 'Stay updated with your food delivery status in real-time.',
        image = '/images/hero-tracking.jpg',
        stats = []
    } = data || {};

    const handleScrollToContent = () => {
        const contentSection = document.querySelector('#tracking-content');
        if (contentSection) {
            const offset = 80;
            const elementPosition = contentSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Default stats if none provided
    const defaultStats = [
        { icon: Package, label: 'Orders Delivered', value: '10K+' },
        { icon: Clock, label: 'Avg. Delivery Time', value: '25min' },
        { icon: CheckCircle, label: 'Satisfaction Rate', value: '99%' },
        { icon: Truck, label: 'Active Drivers', value: '500+' }
    ];

    // Use provided stats or fallback to defaults
    const displayStats = stats?.length > 0 ? stats : defaultStats;

    return (
        <div className="relative min-h-[500px] md:min-h-[600px] bg-gray-900 overflow-hidden pt-20 md:pt-16">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            />

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-transparent dark:from-black/95 dark:via-black/85 dark:to-black/50 backdrop-blur-sm" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 py-12 md:py-0">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={cn(
                                "inline-flex items-center space-x-2",
                                "bg-white/10 dark:bg-gray-900/50",
                                "backdrop-blur-md border border-white/20 dark:border-gray-700/50",
                                "text-white px-4 py-2 rounded-full text-sm mb-6",
                                "shadow-lg"
                            )}
                        >
                            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-white/90">{subtitle}</span>
                        </motion.div>

                        {/* Title with Enhanced Animation */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
                        >
                            {title}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
                        >
                            {description}
                        </motion.p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-8 md:mt-12">
                            {displayStats.map((stat, index) => {
                                const StatIcon = stat.icon || defaultStats[index % defaultStats.length].icon;

                                return (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + (index * 0.1) }}
                                        className={cn(
                                            "text-center p-3 md:p-4 rounded-xl",
                                            "bg-white/5 dark:bg-gray-900/50",
                                            "backdrop-blur-md border border-white/10 dark:border-gray-700/50",
                                            "hover:bg-white/10 dark:hover:bg-gray-800/50",
                                            "transition-all duration-300",
                                            "group"
                                        )}
                                    >
                                        <div className="text-primary/80 mb-2">
                                            <StatIcon className="w-6 h-6 mx-auto" />
                                        </div>
                                        <div className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs md:text-sm text-white/70 group-hover:text-white/90 transition-colors">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                onClick={handleScrollToContent}
                className={cn(
                    "absolute left-1/2 -translate-x-1/2 text-white",
                    "flex flex-col items-center space-y-2 cursor-pointer group",
                    "bottom-4 md:bottom-8",
                    "z-10"
                )}
            >
                <span className="text-sm font-medium">Track Order</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </div>
    );
};

export default Hero; 