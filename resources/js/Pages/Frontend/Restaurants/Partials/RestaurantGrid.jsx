import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    Clock, 
    MapPin, 
    Heart,
    DollarSign,
    Utensils,
    BadgeCheck,
    Timer,
    ChevronRight,
    Plus,
    Info
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { useToast } from "@/Components/ui/use-toast";
import { RestaurantGridSkeleton } from '@/Components/Frontend/RestaurantSkeleton';

const RestaurantCard = ({ restaurant, view = 'grid', index }) => {
    const { toast } = useToast();
    const isGrid = view === 'grid';

    const handleFavorite = (e) => {
        e.preventDefault();
        // Add favorite functionality
        toast({
            title: "Added to favorites",
            description: `${restaurant.name} has been added to your favorites.`
        });
    };

    const GridView = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
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
                                    rounded-full text-sm font-medium backdrop-blur-sm 
                                    flex items-center space-x-1">
                            <BadgeCheck className="w-4 h-4" />
                            <span>Featured</span>
                        </div>
                    )}
                    <div className="absolute top-4 right-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm 
                                               hover:bg-white/40 text-white transition-colors"
                                        onClick={handleFavorite}
                                    >
                                        <Heart className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add to favorites</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                            <div className="flex items-center space-x-2 text-sm text-gray-500 
                                        dark:text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span>{restaurant.distance} km away</span>
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
                                <DollarSign className="w-4 h-4" />
                                <span>{restaurant.price_range}</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {restaurant.categories?.slice(0, 2).map((category, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 
                                           dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <Badge variant={restaurant.is_open ? "success" : "destructive"}>
                                    {restaurant.is_open ? "Open Now" : "Closed"}
                                </Badge>
                                <span className="text-gray-500">
                                    Min. ${restaurant.min_order}
                                </span>
                            </div>
                            <span className="text-primary font-medium">
                                View Menu
                                <ChevronRight className="w-4 h-4 inline-block ml-1" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );

    const ListView = () => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg 
                     transition-all duration-300 overflow-hidden"
        >
            <Link 
                href={`/restaurants/${restaurant.slug}`}
                className="flex items-start space-x-4 p-4"
            >
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
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
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white 
                                       group-hover:text-primary transition-colors">
                                {restaurant.name}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1">
                                <div className="flex items-center text-yellow-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="ml-1 font-medium">{restaurant.rating}</span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                                        ({restaurant.total_reviews})
                                    </span>
                                </div>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-500">{restaurant.price_range}</span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={handleFavorite}
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{restaurant.delivery_time} mins</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{restaurant.distance} km</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>Min. ${restaurant.min_order}</span>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {restaurant.categories?.map((category, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 
                                           dark:text-gray-300 px-2 py-0.5 rounded-full text-xs"
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
    >
        <Utensils className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Restaurants Found</h3>
        <p className="text-gray-500 mb-4">
            Try adjusting your filters or search criteria
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
            Reset Filters
        </Button>
    </motion.div>
);

const RestaurantGrid = ({ restaurants, view, searchQuery, activeFilters }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        
        // Simulate API delay
        const timer = setTimeout(() => {
            const filtered = restaurants?.filter(restaurant => {
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    if (!restaurant.name.toLowerCase().includes(query) && 
                        !restaurant.categories.some(cat => cat.toLowerCase().includes(query))) {
                        return false;
                    }
                }

                if (activeFilters.cuisine.length > 0) {
                    if (!restaurant.categories.some(cat => activeFilters.cuisine.includes(cat))) {
                        return false;
                    }
                }

                if (activeFilters.price.length > 0) {
                    if (!activeFilters.price.includes(restaurant.price_range)) {
                        return false;
                    }
                }

                return true;
            });

            // Sort restaurants
            const sorted = [...(filtered || [])].sort((a, b) => {
                switch (activeFilters.sort) {
                    case 'rating':
                        return b.rating - a.rating;
                    case 'delivery_time':
                        return parseInt(a.delivery_time) - parseInt(b.delivery_time);
                    case 'distance':
                        return a.distance - b.distance;
                    case 'price_low':
                        return a.min_order - b.min_order;
                    case 'price_high':
                        return b.min_order - a.min_order;
                    default:
                        return 0;
                }
            });

            setFilteredRestaurants(sorted);
            setIsLoading(false);
        }, 500); // Add a small delay to show loading state

        return () => clearTimeout(timer);
    }, [restaurants, searchQuery, activeFilters]);

    if (isLoading) {
        return <RestaurantGridSkeleton count={6} view={view} />;
    }

    if (!filteredRestaurants?.length) {
        return <EmptyState />;
    }

    return (
        <div id="restaurant-grid">
            <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400">
                    Showing {filteredRestaurants.length} restaurants
                </p>
            </div>

            <div className={cn(
                "grid gap-6",
                view === 'grid' 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" 
                    : "grid-cols-1"
            )}>
                <AnimatePresence mode="wait">
                    {filteredRestaurants.map((restaurant, index) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            view={view}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RestaurantGrid; 