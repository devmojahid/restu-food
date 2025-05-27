import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    Clock,
    MapPin,
    ChevronRight,
    Grid,
    LayoutList,
    Heart,
    Utensils,
    Timer,
    BadgeCheck,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ViewToggle = ({ view, onViewChange }) => (
    <div className="relative group">
        <div className="flex items-center p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm 
                    border border-gray-200 dark:border-gray-700">
            {/* Grid View Button */}
            <motion.button
                onClick={() => onViewChange('grid')}
                className={cn(
                    "relative flex items-center justify-center p-2 rounded-md transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    view === 'grid'
                        ? "text-primary bg-primary/10 dark:bg-primary/20"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                )}
                whileTap={{ scale: 0.95 }}
            >
                <Grid className="w-4 h-4" />
                <span className="sr-only">Grid View</span>

                {/* Tooltip - Only show when button is not active */}
                {view !== 'grid' && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
                                 bg-gray-900 text-white text-xs rounded opacity-0 
                                 group-hover:opacity-100 transition-opacity pointer-events-none 
                                 whitespace-nowrap">
                        Grid View
                    </span>
                )}
            </motion.button>

            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* List View Button */}
            <motion.button
                onClick={() => onViewChange('list')}
                className={cn(
                    "relative flex items-center justify-center p-2 rounded-md transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    view === 'list'
                        ? "text-primary bg-primary/10 dark:bg-primary/20"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                )}
                whileTap={{ scale: 0.95 }}
            >
                <LayoutList className="w-4 h-4" />
                <span className="sr-only">List View</span>

                {/* Tooltip - Only show when button is not active */}
                {view !== 'list' && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 
                                 bg-gray-900 text-white text-xs rounded opacity-0 
                                 group-hover:opacity-100 transition-opacity pointer-events-none 
                                 whitespace-nowrap">
                        List View
                    </span>
                )}
            </motion.button>
        </div>
    </div>
);

const ViewTransition = ({ children, view }) => (
    <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

const RestaurantCard = ({ restaurant, view = 'grid', index }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isGrid = view === 'grid';

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1
            }
        }
    };

    const GridView = () => (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl 
                     transition-all duration-300 overflow-hidden"
        >
            <Link href={`/restaurants/${restaurant.slug}`}>
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 
                                 transition-transform duration-500"
                    />
                    {restaurant.is_featured && (
                        <div className="absolute top-4 left-4 bg-primary/90 text-white px-3 py-1 
                                    rounded-full text-sm font-medium backdrop-blur-sm flex items-center space-x-1">
                            <BadgeCheck className="w-4 h-4" />
                            <span>Featured</span>
                        </div>
                    )}
                    <div className="absolute top-4 right-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm 
                                   hover:bg-white/40 text-white transition-colors"
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t 
                                from-black/60 to-transparent" />
                </div>

                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 
                                       group-hover:text-primary transition-colors">
                                {restaurant.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span>2.4 km away</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center space-x-1 text-yellow-400">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-medium">{restaurant.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                ({restaurant.total_reviews} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>{restaurant.delivery_time} mins</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                <Utensils className="w-4 h-4" />
                                <span>{restaurant.price_range}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {restaurant.categories?.slice(0, 2).map((category, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                                           px-2 py-1 rounded-full text-xs"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );

    const ListView = () => (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg 
                     transition-all duration-300 overflow-hidden"
        >
            <Link
                href={`/restaurants/${restaurant.slug}`}
                className="flex items-center space-x-4 p-4"
            >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="h-full w-full object-cover transform group-hover:scale-105 
                                 transition-transform duration-500"
                    />
                    {restaurant.is_featured && (
                        <div className="absolute top-2 left-2 bg-primary/90 text-white px-2 py-0.5 
                                    rounded-full text-xs font-medium backdrop-blur-sm">
                            Featured
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white 
                                   group-hover:text-primary transition-colors truncate">
                            {restaurant.name}
                        </h3>
                        <div className="flex items-center space-x-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{restaurant.rating}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{restaurant.delivery_time} mins</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>2.4 km</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Utensils className="w-4 h-4" />
                            <span>{restaurant.price_range}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {restaurant.categories?.slice(0, 2).map((category, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                                           px-2 py-0.5 rounded-full text-xs"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary 
                                             group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );

    return isGrid ? <GridView /> : <ListView />;
};

const EmptyState = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 px-4 max-w-2xl mx-auto"
    >
        <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="w-32 h-32 bg-primary/5 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>
            <Utensils className="w-16 h-16 mx-auto text-primary relative z-10" />
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Restaurants Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            We're currently expanding our restaurant network in your area.
            Check back soon for exciting dining options!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
                href="/restaurants"
                className="inline-flex items-center space-x-2 bg-primary text-white 
                       px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
                <span>Browse All Areas</span>
                <MapPin className="w-4 h-4" />
            </Link>
            <Button
                variant="outline"
                className="rounded-full"
                onClick={() => window.location.reload()}
            >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
            </Button>
        </div>
    </motion.div>
);

const FeaturedRestaurants = ({ data }) => {
    const { title, layout, columns, restaurants } = data;
    const [view, setView] = useState(layout);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isViewChanging, setIsViewChanging] = useState(false);

    const handleViewChange = (newView) => {
        setIsViewChanging(true);
        setView(newView);
        setTimeout(() => setIsViewChanging(false), 300);
    };

    if (!restaurants?.length) {
        return <EmptyState />;
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                                Discover the best restaurants in your area with amazing food and exceptional service
                            </p>
                        </motion.div>
                    </div>

                    <div className="flex items-center space-x-4 mt-6 md:mt-0">
                        {!isMobile && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative group"
                            >
                                <ViewToggle view={view} onViewChange={handleViewChange} />
                            </motion.div>
                        )}
                        <Link
                            href="/restaurants"
                            className="inline-flex items-center space-x-2 text-primary hover:text-primary/90 
                                   font-semibold transition-colors group"
                        >
                            <span>View All</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <ViewTransition view={view}>
                        <div className={cn(
                            "min-h-[200px]",
                            view === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                : "space-y-6",
                            isViewChanging && "opacity-0"
                        )}>
                            {restaurants.map((restaurant, index) => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                    view={view}
                                    index={index}
                                />
                            ))}
                        </div>
                    </ViewTransition>
                </AnimatePresence>

                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/restaurants"
                        className="inline-flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 
                               text-primary px-8 py-4 rounded-full transition-colors group"
                    >
                        <span>Explore All Restaurants</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedRestaurants; 