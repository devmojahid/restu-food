import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Tag, Percent, Users, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = ({ data = {} }) => {
    const handleScrollToContent = () => {
        const contentSection = document.querySelector('#offers-content');
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

    // Ensure we have data with defaults
    const heroData = {
        title: data.title || 'Exclusive Offers & Discounts',
        subtitle: data.subtitle || 'Save Big Today',
        description: data.description || 'Discover amazing deals on your favorite restaurants and dishes. Limited time offers updated daily.',
        image: data.image || '/images/offers-hero.jpg',
        stats: data.stats || [
            { label: 'Active Offers', value: '200+', icon: Tag },
            { label: 'Partner Restaurants', value: '500+', icon: Store },
            { label: 'Average Savings', value: '25%', icon: Percent },
            { label: 'Happy Customers', value: '100K+', icon: Users }
        ]
    };

    return (
        <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] bg-gray-900 overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${heroData.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            />

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-transparent" />

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
                            <span>{heroData.subtitle}</span>
                        </motion.div>

                        {/* Title with Enhanced Animation */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
                        >
                            {heroData.title}
                        </motion.h1>

                        {/* Description with Gradient Text */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl"
                        >
                            {heroData.description}
                        </motion.p>

                        {/* Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
                        >
                            {heroData.stats.map((stat, index) => {
                                const Icon = stat.icon || Tag;
                                return (
                                    <div
                                        key={stat.label}
                                        className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20
                                                hover:bg-white/20 transition duration-300"
                                    >
                                        <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                                        <div className="text-sm text-white/70">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                onClick={handleScrollToContent}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white flex flex-col 
                         items-center space-y-2 cursor-pointer group"
            >
                <span className="text-sm font-medium">Explore Offers</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>

            {/* ID for scroll target */}
            <div id="offers-content" className="absolute bottom-0"></div>
        </div>
    );
};

export default Hero; 