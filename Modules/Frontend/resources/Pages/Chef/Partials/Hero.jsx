import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Search, Utensils, Star, Award, MapPin } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';

const Hero = ({ data }) => {
    // Handle scroll to content section
    const handleScrollToContent = useCallback(() => {
        const contentSection = document.querySelector('#featured-chefs');
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

    // If no data is provided, show default hero
    if (!data) {
        return (
            <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 h-[400px] flex items-center justify-center text-white">
                <div className="text-center px-4">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Talented Chefs</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto mb-8">
                        Meet the culinary artists behind our exceptional dishes
                    </p>
                    <Button className="rounded-full" onClick={handleScrollToContent}>
                        Explore Chefs
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-[600px] lg:h-[700px] w-full overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${data.image || '/images/default-chef-hero.jpg'})`,
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
                            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span>{data.badge || 'Meet Our Expert Chefs'}</span>
                        </motion.div>

                        {/* Title with Enhanced Animation */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight"
                        >
                            {data.title || 'Culinary Masters Behind Every Dish'}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-lg md:text-xl text-transparent bg-clip-text 
                                     bg-gradient-to-r from-white to-white/60 mb-8 max-w-2xl"
                        >
                            {data.description || 'Discover the talented chefs who bring passion, creativity and expertise to our kitchen, creating unforgettable culinary experiences for our guests.'}
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="relative max-w-md mb-8"
                        >
                            <Input
                                type="text"
                                placeholder="Search for a chef..."
                                className="pl-12 pr-4 py-6 rounded-full text-base bg-white/10 backdrop-blur-sm 
                                         text-white border-white/20 focus:border-primary focus:ring-primary"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                            <Button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full px-4 py-2">
                                Search
                            </Button>
                        </motion.div>

                        {/* Stats Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="flex flex-wrap gap-4 md:gap-8"
                        >
                            {[
                                { icon: Utensils, value: data.stats?.chefs || '50+', label: 'Expert Chefs' },
                                { icon: Star, value: data.stats?.experience || '15+', label: 'Years Experience' },
                                { icon: Award, value: data.stats?.awards || '120+', label: 'Culinary Awards' },
                                { icon: MapPin, value: data.stats?.locations || '30+', label: 'Locations' }
                            ].map((stat, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <stat.icon className="w-5 h-5 text-primary" />
                                    <div>
                                        <span className="block text-white font-bold">{stat.value}</span>
                                        <span className="text-xs text-white/70">{stat.label}</span>
                                    </div>
                                </div>
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
                <span className="text-sm font-medium">Scroll Down</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>
        </div>
    );
};

export default Hero; 