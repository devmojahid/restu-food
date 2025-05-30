import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronDown,
    Search,
    Store,
    Star,
    Clock,
    Users,
    Utensils,
    MapPin,
    ShoppingBag,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';

const Hero = ({ data, stats = [] }) => {
    const [searchValue, setSearchValue] = useState('');
    const [activeSuggestionCategory, setActiveSuggestionCategory] = useState(
        Object.keys(data?.search_suggestions || {})[0] || ''
    );
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

    // Use provided stats or fallback to data.stats or defaults
    const displayStats = stats.length > 0
        ? stats
        : (data?.stats?.length > 0 ? data.stats : [
            { label: 'Restaurants', value: '500+', icon: 'Store' },
            { label: 'Cuisine Types', value: '50+', icon: 'Utensils' },
            { label: 'Cities Covered', value: '20+', icon: 'MapPin' },
            { label: 'Happy Customers', value: '100K+', icon: 'Users' }
        ]);

    // For selecting an icon component based on string
    const getIconByName = (iconName) => {
        const icons = {
            'Store': Store,
            'Star': Star,
            'Clock': Clock,
            'Users': Users,
            'Utensils': Utensils,
            'MapPin': MapPin,
            'ShoppingBag': ShoppingBag
        };
        return icons[iconName] || Store;
    };

    // Handle search suggestions
    const handleFocus = () => {
        setIsSuggestionsVisible(true);
    };

    const handleBlur = () => {
        // Small delay to allow click on suggestions
        setTimeout(() => setIsSuggestionsVisible(false), 200);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchValue(suggestion);
        setIsSuggestionsVisible(false);
    };

    // Enhanced scroll functionality
    const handleScrollToContent = useCallback(() => {
        const contentSection = document.querySelector('#restaurant-content');
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

    // Featured cuisines display
    const renderFeaturedCuisines = () => {
        if (!data?.featured_cuisines?.length) return null;

        return (
            <div className="flex flex-wrap gap-3 mt-4">
                {data.featured_cuisines.slice(0, 6).map((cuisine) => (
                    <Badge
                        key={cuisine.id}
                        variant="secondary"
                        className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 cursor-pointer"
                    >
                        {cuisine.name}
                    </Badge>
                ))}
            </div>
        );
    };

    return (
        <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-gray-900">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${data?.image || '/images/hero/restaurants-hero.jpg'})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            />

            {/* Enhanced Gradient Overlay with Animation */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/75 to-transparent" />

            {/* Animated Particles */}
            <div className="absolute inset-0 z-10 opacity-30">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full"
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                            opacity: Math.random() * 0.5 + 0.25
                        }}
                        animate={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            duration: Math.random() * 20 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <div className="relative container z-20">
                <div className="flex flex-col items-center text-center">
                    {/* Small Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                                 bg-white/10 backdrop-blur-md text-primary/90 text-sm mb-6
                                 border border-white/10"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">{data?.subtitle || 'Discover Local Restaurants'}</span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6
                                 bg-clip-text text-white"
                    >
                        {data?.title || 'Discover the Best Restaurants'}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl text-lg text-white/80 mb-8"
                    >
                        {data?.description || 'Explore the best restaurants in your area, from local favorites to international cuisine. Order now for delivery or takeout.'}
                    </motion.p>

                    {/* Enhanced Search Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-2xl mb-8"
                    >
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search restaurants, cuisines, dishes..."
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className="w-full h-14 px-12 rounded-full bg-white/10 backdrop-blur-md 
                                         border border-white/20 text-white placeholder-white/60
                                         focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                                         transition-all duration-300"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Button className="rounded-full">
                                    Search
                                </Button>
                            </div>

                            {/* Search Suggestions */}
                            {isSuggestionsVisible && data?.search_suggestions && Object.keys(data.search_suggestions).length > 0 && (
                                <motion.div
                                    className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 
                                             rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 
                                             overflow-hidden z-50"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex border-b dark:border-gray-700">
                                        {Object.keys(data.search_suggestions).map((category) => (
                                            <button
                                                key={category}
                                                className={cn(
                                                    "px-4 py-2 text-sm font-medium",
                                                    activeSuggestionCategory === category
                                                        ? "text-primary border-b-2 border-primary"
                                                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                )}
                                                onClick={() => setActiveSuggestionCategory(category)}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-2">
                                        <div className="flex flex-wrap gap-2">
                                            {data.search_suggestions[activeSuggestionCategory]?.map((suggestion) => (
                                                <Badge
                                                    key={suggestion}
                                                    variant="outline"
                                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                >
                                                    {suggestion}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Featured Cuisines */}
                        {renderFeaturedCuisines()}
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl"
                    >
                        {displayStats.map((stat, index) => {
                            const IconComponent = getIconByName(stat.icon);

                            return (
                                <motion.div
                                    key={stat.label}
                                    whileHover={{ y: -5 }}
                                    className="flex flex-col items-center p-4 rounded-2xl
                                             bg-white/10 backdrop-blur-md border border-white/10
                                             hover:bg-white/15 transition-all duration-300"
                                >
                                    <IconComponent className="w-6 h-6 text-primary mb-2" />
                                    <span className="text-2xl md:text-3xl font-bold text-white">
                                        {stat.value}
                                    </span>
                                    <span className="text-sm text-white/70">
                                        {stat.label}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                onClick={handleScrollToContent}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white 
                         flex flex-col items-center space-y-2 cursor-pointer z-20"
            >
                <span className="text-sm font-medium">Explore Restaurants</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </motion.button>

            {/* Bottom Blob */}
            <div className="absolute bottom-0 left-0 w-full h-20 z-0">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="w-full h-full bg-transparent"
                >
                    <path
                        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".25"
                        className="fill-gray-50 dark:fill-gray-900"
                    />
                    <path
                        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        opacity=".5"
                        className="fill-gray-50 dark:fill-gray-900"
                    />
                    <path
                        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                        className="fill-gray-50 dark:fill-gray-900"
                    />
                </svg>
            </div>
        </section>
    );
};

export default Hero; 