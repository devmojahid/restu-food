import React from 'react';
import { motion } from 'framer-motion';
import { 
    Store, 
    Star, 
    Clock, 
    Users,
    ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = ({ stats }) => {
    const handleScrollToContent = () => {
        const contentSection = document.querySelector('#restaurant-grid');
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

    // Add default stats if none provided
    const defaultStats = [
        { label: 'Restaurants', value: '500+' },
        { label: 'Cities', value: '50+' },
        { label: 'Cuisines', value: '30+' },
        { label: 'Happy Customers', value: '100K+' }
    ];

    // Use provided stats or fallback to defaults
    const displayStats = Array.isArray(stats) ? stats : defaultStats;

    return (
        <div className="relative min-h-[400px] lg:min-h-[500px] bg-gray-900 overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <motion.div 
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0"
                style={{
                    backgroundImage: 'url(/images/restaurants/hero-bg.jpg)',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            />
            
            {/* Gradient Overlay */}
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
                            <Store className="w-4 h-4" />
                            <span>Discover Local Restaurants</span>
                        </motion.div>
                        
                        {/* Title */}
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white"
                        >
                            Find Your Perfect Dining Experience
                        </motion.h1>
                        
                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-white/90 mb-8"
                        >
                            Explore the best restaurants in your area, from local favorites to 
                            international cuisine. Order now for delivery or takeout.
                        </motion.p>

                        {/* Stats Grid - Updated to use displayStats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
                        >
                            {displayStats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + (index * 0.1) }}
                                    className="text-center"
                                >
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-white/80">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
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
                <span className="text-sm font-medium">Explore Restaurants</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </div>
    );
};

export default Hero; 