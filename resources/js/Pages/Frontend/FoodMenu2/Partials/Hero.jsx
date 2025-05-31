import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/Components/ui/tooltip';

const Hero = ({ data = {} }) => {
    // Extract data with fallbacks
    const {
        title = 'Explore Our Menu',
        subtitle = 'Fresh & Delicious',
        description = 'Discover our wide variety of dishes crafted with fresh ingredients and passion.',
        image = '/images/food-menu/hero-banner.jpg',
        cta = { text: 'Browse Menu', link: '#category-navigation' },
        stats = []
    } = data;

    // Function to smooth scroll to content
    const handleScrollToContent = useCallback(() => {
        const contentSection = document.querySelector('#category-navigation');
        if (contentSection) {
            const offset = 80; // Adjust for fixed header
            const elementPosition = contentSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    return (
        <div className="relative h-[600px] lg:h-[700px] w-full overflow-hidden">
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

            {/* Gradient Overlay with Enhanced Design */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md 
                                     text-white px-4 py-2 rounded-full text-sm mb-6"
                        >
                            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span>{subtitle}</span>
                        </motion.div>

                        {/* Title with Enhanced Animation */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight"
                        >
                            {title}
                        </motion.h1>

                        {/* Description with Gradient Text */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-transparent bg-clip-text 
                                     bg-gradient-to-r from-white to-white/60 mb-8 max-w-2xl"
                        >
                            {description}
                        </motion.p>

                        {/* CTA Buttons with Enhanced Hover Effects */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <a
                                href={cta.link}
                                className="group relative overflow-hidden bg-primary hover:bg-primary/90 
                                         text-white px-8 py-4 rounded-full text-lg font-semibold 
                                         transition-all duration-300 flex items-center space-x-2"
                                onClick={(e) => {
                                    if (cta.link.startsWith('#')) {
                                        e.preventDefault();
                                        handleScrollToContent();
                                    }
                                }}
                            >
                                <span className="relative z-10">{cta.text}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 
                                              translate-x-full group-hover:translate-x-0 transition-transform" />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section at Bottom */}
            {stats?.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t 
                              from-black/80 to-transparent py-6">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-white">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + (index * 0.1) }}
                                    className="text-center"
                                >
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex flex-col items-center cursor-help">
                                                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                                    <div className="text-sm text-gray-300 flex items-center">
                                                        {stat.label}
                                                        <Info className="w-3 h-3 ml-1 text-gray-400" />
                                                    </div>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Statistics based on our latest data</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                onClick={handleScrollToContent}
                className="absolute bottom-32 md:bottom-24 left-1/2 -translate-x-1/2 text-white flex flex-col 
                         items-center space-y-2 cursor-pointer group"
            >
                <span className="text-sm font-medium">Scroll Down</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </div>
    );
};

export default Hero; 