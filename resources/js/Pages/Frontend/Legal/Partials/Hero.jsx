import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Shield, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = ({ data }) => {
    // Handle null data
    if (!data) return null;

    const handleScrollToContent = () => {
        const contentSection = document.querySelector('#legal-content');
        if (contentSection) {
            const offset = 80; // Adjust for fixed header
            const elementPosition = contentSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative min-h-[400px] md:min-h-[500px] bg-gray-900 overflow-hidden pt-20 md:pt-16">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${data.image})`,
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
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-white/90">{data.subtitle}</span>
                        </motion.div>

                        {/* Title with Enhanced Animation */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
                        >
                            {data.title}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
                        >
                            {data.description}
                        </motion.p>

                        {/* Last Updated */}
                        {data.lastUpdated && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="flex items-center space-x-4 text-white/70 text-sm mb-8"
                            >
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>Last Updated: {data.lastUpdated}</span>
                                </div>
                                {data.effectiveDate && (
                                    <div className="flex items-center">
                                        <Shield className="w-4 h-4 mr-2" />
                                        <span>Effective: {data.effectiveDate}</span>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Stats Grid */}
                        {data.stats && data.stats.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-8 md:mt-12 mb-16 md:mb-0">
                                {data.stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                                        className={cn(
                                            "text-center p-3 md:p-4 rounded-xl",
                                            "bg-white/5 dark:bg-gray-900/50",
                                            "backdrop-blur-md border border-white/10 dark:border-gray-700/50",
                                            "hover:bg-white/10 dark:hover:bg-gray-800/50",
                                            "transition-all duration-300",
                                            "group"
                                        )}
                                    >
                                        <div className="text-2xl md:text-4xl font-bold text-white group-hover:text-primary transition-colors">
                                            {stat.value}
                                        </div>
                                        <div className="text-xs md:text-sm text-white/70 group-hover:text-white/90 transition-colors">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
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
                <span className="text-sm font-medium">Read More</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </div>
    );
};

export default Hero; 