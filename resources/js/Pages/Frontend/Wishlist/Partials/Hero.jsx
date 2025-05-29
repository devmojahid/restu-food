import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronDown, ShoppingBag, Tag, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = ({ data = {} }) => {
    // Safely extract data with defaults
    const {
        title = 'Your Wishlist',
        subtitle = 'Saved for Later',
        description = 'Discover all your favorite dishes and restaurants that you\'ve saved for later.',
        image = '/images/wishlist-hero.jpg',
        stats = []
    } = data || {};

    const handleScrollToContent = () => {
        const contentSection = document.getElementById('wishlist-content');
        if (contentSection) {
            const offset = 80; // Header height offset
            const elementPosition = contentSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Default stats if not provided
    const defaultStats = [
        {
            icon: Heart,
            value: '0',
            label: 'Saved Items',
            color: 'text-pink-500'
        },
        {
            icon: ShoppingBag,
            value: '0',
            label: 'Moved to Cart',
            color: 'text-blue-500'
        },
        {
            icon: Tag,
            value: '0',
            label: 'Price Drops',
            color: 'text-green-500'
        },
        {
            icon: Clock,
            value: '0',
            label: 'Days Saved',
            color: 'text-orange-500'
        }
    ];

    // Use provided stats or fallback to defaults
    const displayStats = stats?.length > 0 ? stats : defaultStats;

    // Helper function to safely render icon
    const renderIcon = (IconComponent, className) => {
        if (!IconComponent || typeof IconComponent !== 'function') {
            // Fallback to Heart icon if the icon is invalid
            return <Heart className={className} />;
        }
        return <IconComponent className={className} />;
    };

    return (
        <div className="relative overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${image})`,
                    transform: 'translateZ(0)'
                }}
            >
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900/90" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 py-24 md:py-32">
                <div className="max-w-3xl">
                    {/* Subtitle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-primary/30 backdrop-blur-sm rounded-full mb-4">
                            {subtitle}
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {title}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        className="text-lg text-gray-200 mb-8 max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {description}
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {displayStats.map((stat, index) => (
                            <div
                                key={`${stat.label}-${index}`}
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
                            >
                                {renderIcon(stat.icon, cn("w-6 h-6 mx-auto mb-2", stat.color))}
                                <div className="text-2xl font-bold text-white mb-1">
                                    {stat.value || '0'}
                                </div>
                                <div className="text-sm text-gray-300">
                                    {stat.label || 'Label'}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll Down Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    onClick={handleScrollToContent}
                >
                    <div className="flex flex-col items-center">
                        <span className="text-white text-sm mb-1">Scroll Down</span>
                        <ChevronDown className="w-5 h-5 text-white" />
                    </div>
                </motion.div>
            </div>

            {/* Curved Shape Divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 120"
                    className="w-full h-auto fill-current text-white dark:text-gray-900"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
                    />
                </svg>
            </div>
        </div>
    );
};

export default Hero;