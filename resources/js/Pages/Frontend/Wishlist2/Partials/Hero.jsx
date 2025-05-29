import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    Tag,
    Clock,
    ChevronDown,
    FolderHeart,
    ShoppingBag,
    ExternalLink,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

const Hero = ({ data = {} }) => {
    // Default values if not provided
    const {
        title = 'Your Wishlist Collection',
        subtitle = 'Save, organize and discover your favorite dishes',
        description = 'Keep track of the dishes you love. Create collections, compare prices, and get notified about deals on your saved items.',
        image = '/images/wishlist-hero-bg.jpg',
        background_pattern = 'grid',
        animation_type = 'parallax',
        stats = [],
        cta = {
            primary: {
                text: 'Start Shopping',
                link: '/restaurants'
            },
            secondary: {
                text: 'Browse Collections',
                link: '#collections'
            }
        }
    } = data;

    // Default stats if none provided
    const defaultStats = [
        {
            icon: Heart,
            label: 'Saved Items',
            value: '0',
            color: 'text-red-500'
        },
        {
            icon: Tag,
            label: 'Price Drops',
            value: '0',
            color: 'text-green-500'
        },
        {
            icon: Clock,
            label: 'Limited Offers',
            value: '0',
            color: 'text-blue-500'
        },
        {
            icon: FolderHeart,
            label: 'Collections',
            value: '0',
            color: 'text-purple-500'
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

    // Enhanced scroll functionality
    const handleScrollToContent = useCallback(() => {
        const contentSection = document.querySelector('#wishlist-content');
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

    // Get icon component from string name
    const getIconComponent = (iconName) => {
        const iconMap = {
            'Heart': Heart,
            'Tag': Tag,
            'Clock': Clock,
            'FolderHeart': FolderHeart,
            'ShoppingBag': ShoppingBag
        };

        return iconMap[iconName] || Heart;
    };

    // Process stats to ensure they have valid icon components
    const processedStats = displayStats.map(stat => ({
        ...stat,
        icon: typeof stat.icon === 'string' ? getIconComponent(stat.icon) : stat.icon
    }));

    return (
        <div className="relative min-h-[500px] md:min-h-[600px] overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: animation_type === 'parallax' ? 1 : 1.1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            />

            {/* Background Pattern Overlay */}
            <div
                className={cn(
                    "absolute inset-0 opacity-40 mix-blend-multiply",
                    background_pattern === 'grid' && "bg-grid-white/10",
                    background_pattern === 'dots' && "bg-dots-white/10",
                    background_pattern === 'noise' && "bg-noise"
                )}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/60" />

            {/* Content */}
            <div className="relative container mx-auto px-4 h-full flex flex-col justify-center py-16">
                <div className="max-w-3xl">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm mb-6 border border-white/20"
                    >
                        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span>{subtitle}</span>
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

                    {/* Description with Gradient Text */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl"
                    >
                        {description}
                    </motion.p>

                    {/* CTA Buttons with Enhanced Hover Effects */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap gap-4 mb-12"
                    >
                        <Link
                            href={cta?.primary?.link || '/restaurants'}
                            className="group relative overflow-hidden bg-primary hover:bg-primary/90 
                                     text-white px-6 py-3 rounded-full text-lg font-semibold 
                                     transition-all duration-300 flex items-center space-x-2"
                        >
                            <span className="relative z-10">{cta?.primary?.text || 'Start Shopping'}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 
                                          translate-x-full group-hover:translate-x-0 transition-transform" />
                        </Link>

                        <Link
                            href={cta?.secondary?.link || '#collections'}
                            className="group relative overflow-hidden bg-white/10 backdrop-blur-sm 
                                     hover:bg-white/20 text-white px-6 py-3 rounded-full text-lg 
                                     font-semibold transition-all duration-300"
                        >
                            <span className="relative z-10">{cta?.secondary?.text || 'Browse Collections'}</span>
                            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 
                                          translate-x-full group-hover:translate-x-0 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {processedStats.map((stat, index) => (
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

            {/* Decorative Elements */}
            <div className="absolute top-1/4 right-[10%] w-64 h-64 rounded-full 
                         bg-primary/20 blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 left-[10%] w-48 h-48 rounded-full 
                         bg-purple-500/20 blur-3xl animate-pulse-slow"
                style={{ animationDelay: '1s' }} />
        </div>
    );
};

export default Hero; 