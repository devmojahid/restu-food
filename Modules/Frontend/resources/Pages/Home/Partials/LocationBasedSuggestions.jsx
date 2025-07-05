import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Navigation, 
    Clock, 
    Star,
    ChevronRight,
    Filter,
    Search,
    Grid,
    List,
    DollarSign,
    Timer,
    Utensils,
    X,
    AlertCircle,
    Loader2,
    Compass,
    ArrowUpRight,
    Info,
    Building2,
    Bike,
    Clock3,
    Sparkles
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Slider } from "@/Components/ui/slider";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger 
} from "@/Components/ui/tooltip";
import { useToast } from "@/Components/ui/use-toast";
import { GOOGLE_MAPS_CONFIG, mapStyles } from '@/config/maps';
import { loadGoogleMaps } from '@/lib/loadGoogleMaps';
import { useDebounce } from '@/hooks/useDebounce';
import ErrorBoundary from '@/Components/ErrorBoundary';

// Lazy load the map component
const GoogleMapComponent = lazy(() => import('@/Components/Maps/GoogleMapComponent'));

// Add this new component for better loading states
const LoadingState = () => (
    <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500">Loading map and restaurants...</p>
        </div>
    </div>
);

// Replace useJsApiLoader with custom hook
const useGoogleMaps = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        loadGoogleMaps()
            .then(() => setIsLoaded(true))
            .catch(error => setLoadError(error));
    }, []);

    return { isLoaded, loadError };
};

const LocationBasedSuggestions = ({ restaurants }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [viewType, setViewType] = useState('grid');
    const [selectedFilters, setSelectedFilters] = useState({
        cuisine: [],
        priceRange: [],
        rating: 0,
        maxDistance: 5,
        maxDeliveryTime: 60
    });
    const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { toast } = useToast();
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const debouncedMapCenter = useDebounce(mapCenter, 500);
    const [isMapReady, setIsMapReady] = useState(false);

    // Replace useJsApiLoader with our custom hook
    const { isLoaded, loadError } = useGoogleMaps();

    // Enhanced map options
    const mapOptions = {
        ...GOOGLE_MAPS_CONFIG,
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        gestureHandling: 'cooperative'
    };

    // Enhanced getUserLocation with better error handling
    const getUserLocation = useCallback(() => {
        setIsLoadingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            toast({
                title: "Location Error",
                description: "Geolocation is not supported by your browser",
                variant: "destructive"
            });
            setIsLoadingLocation(false);
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setMapCenter({ lat: latitude, lng: longitude });
                setIsLoadingLocation(false);
                
                toast({
                    title: "Location Updated",
                    description: "Successfully retrieved your location",
                    variant: "success"
                });
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location permission denied";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information unavailable";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out";
                        break;
                }

                setLocationError(errorMessage);
                setIsLoadingLocation(false);
                
                toast({
                    title: "Location Error",
                    description: errorMessage,
                    variant: "destructive"
                });
            },
            options
        );
    }, [toast]);

    useEffect(() => {
        getUserLocation();
    }, []);

    // Filter restaurants based on selected filters
    const filteredRestaurants = restaurants?.filter(restaurant => {
        if (selectedFilters.cuisine.length && !selectedFilters.cuisine.includes(restaurant.cuisine)) {
            return false;
        }
        if (selectedFilters.priceRange.length && !selectedFilters.priceRange.includes(restaurant.price_range)) {
            return false;
        }
        if (restaurant.rating < selectedFilters.rating) {
            return false;
        }
        if (restaurant.distance > selectedFilters.maxDistance) {
            return false;
        }
        const [minTime] = restaurant.delivery_time.split('-').map(Number);
        if (minTime > selectedFilters.maxDeliveryTime) {
            return false;
        }
        return true;
    });

    // Enhanced RestaurantCard with better mobile support
    const RestaurantCard = ({ restaurant }) => {
        const isSelected = selectedRestaurant?.id === restaurant.id;
        
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "bg-white dark:bg-gray-800 rounded-2xl shadow-lg",
                    "transition-all duration-300",
                    "border border-gray-100 dark:border-gray-700",
                    "hover:shadow-xl hover:border-primary/20",
                    isSelected && "ring-2 ring-primary",
                    viewType === 'grid' ? 'h-full' : 'flex gap-4'
                )}
                onClick={() => {
                    setSelectedRestaurant(restaurant);
                    setMapCenter(restaurant.coordinates);
                }}
            >
                {/* Restaurant Image */}
                <div className={cn(
                    "relative overflow-hidden",
                    viewType === 'grid' ? 'h-48 rounded-t-2xl' : 'h-32 w-32 rounded-l-2xl'
                )}>
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Badge 
                        className="absolute top-4 right-4 bg-white/90 text-primary"
                        variant="secondary"
                    >
                        {restaurant.price_range}
                    </Badge>
                </div>

                {/* Content */}
                <div className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {restaurant.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {restaurant.cuisine}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">
                                ({restaurant.reviews_count})
                            </span>
                        </div>
                    </div>

                    {/* Enhanced Stats Display */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                                        <Clock3 className="w-4 h-4 mr-1 text-primary" />
                                        <span>{restaurant.delivery_time} mins</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Estimated Delivery Time</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                                        <Bike className="w-4 h-4 mr-1 text-green-500" />
                                        <span>${restaurant.delivery_fee}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Delivery Fee</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                                        <Building2 className="w-4 h-4 mr-1 text-blue-500" />
                                        <span>{restaurant.distance} km</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Distance from your location</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {/* Popular Dishes */}
                    {restaurant.popular_dishes && (
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">Popular Dishes:</p>
                            <div className="flex flex-wrap gap-2">
                                {restaurant.popular_dishes.map((dish, index) => (
                                    <Badge 
                                        key={index}
                                        variant="secondary" 
                                        className="bg-primary/10 text-primary"
                                    >
                                        {dish.name} - ${dish.price}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Enhanced Action Buttons */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
                        <Link
                            href={`/restaurants/${restaurant.slug}`}
                            className="inline-flex items-center text-primary hover:text-primary/90 
                                   text-sm font-medium transition-colors"
                        >
                            View Menu
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                        
                        {restaurant.is_open ? (
                            <Badge variant="success" className="bg-green-500/10 text-green-500">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Open Now
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-gray-500/10 text-gray-500">
                                Closed
                            </Badge>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    // Enhanced MapComponent with error boundaries
    const MapComponent = () => {
        if (loadError) {
            return (
                <div className="rounded-xl bg-red-50 p-4 text-red-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-center">Error loading Google Maps</p>
                </div>
            );
        }

        if (!isLoaded) return <LoadingState />;

        return (
            <div className="relative h-[300px] md:h-[400px] mb-8 rounded-2xl overflow-hidden shadow-lg">
                <Suspense fallback={<LoadingState />}>
                    <ErrorBoundary
                        fallback={
                            <div className="rounded-xl bg-red-50 p-4 text-red-500">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-center">Error loading map component</p>
                            </div>
                        }
                    >
                        <GoogleMapComponent
                            center={debouncedMapCenter}
                            zoom={13}
                            options={mapOptions}
                            onLoad={() => {
                                setIsMapReady(true);
                                setMapLoaded(true);
                            }}
                            userLocation={userLocation}
                            restaurants={filteredRestaurants}
                            selectedRestaurant={selectedRestaurant}
                            onRestaurantSelect={setSelectedRestaurant}
                        />
                    </ErrorBoundary>
                </Suspense>

                {/* Enhanced Map Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full shadow-lg bg-white dark:bg-gray-800"
                                    onClick={() => {
                                        if (userLocation) {
                                            setMapCenter(userLocation);
                                        } else {
                                            getUserLocation();
                                        }
                                    }}
                                >
                                    <Compass className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Center on my location</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Loading Overlay */}
                <AnimatePresence>
                    {!mapLoaded && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-100/80 dark:bg-gray-900/80 
                                    flex items-center justify-center"
                        >
                            <LoadingState />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    // Enhanced mobile responsiveness for filters
    const FiltersMenu = () => {
        const content = (
            <div className="space-y-6">
                {/* Enhanced Cuisine Filter with better mobile support */}
                <div className="space-y-4">
                    <h4 className="font-medium">Cuisine Type</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {['Italian', 'Chinese', 'Indian', 'Mexican'].map((cuisine) => (
                            <Button
                                key={cuisine}
                                variant="outline"
                                className={cn(
                                    "justify-start",
                                    selectedFilters.cuisine.includes(cuisine) && 
                                    "bg-primary/10 text-primary"
                                )}
                                onClick={() => {
                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        cuisine: prev.cuisine.includes(cuisine)
                                            ? prev.cuisine.filter(c => c !== cuisine)
                                            : [...prev.cuisine, cuisine]
                                    }));
                                }}
                            >
                                {cuisine}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Enhanced Price Range Filter */}
                <div className="space-y-4">
                    <h4 className="font-medium">Price Range</h4>
                    <div className="flex flex-wrap gap-2">
                        {['$', '$$', '$$$'].map((price) => (
                            <Button
                                key={price}
                                variant="outline"
                                className={cn(
                                    selectedFilters.priceRange.includes(price) &&
                                    "bg-primary/10 text-primary"
                                )}
                                onClick={() => {
                                    setSelectedFilters(prev => ({
                                        ...prev,
                                        priceRange: prev.priceRange.includes(price)
                                            ? prev.priceRange.filter(p => p !== price)
                                            : [...prev.priceRange, price]
                                    }));
                                }}
                            >
                                {price}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Distance Slider */}
                <div>
                    <h4 className="font-medium mb-2">Maximum Distance</h4>
                    <Slider
                        value={[selectedFilters.maxDistance]}
                        onValueChange={([value]) => 
                            setSelectedFilters(prev => ({ ...prev, maxDistance: value }))
                        }
                        max={10}
                        step={0.5}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Up to {selectedFilters.maxDistance} km
                    </p>
                </div>

                {/* Delivery Time Slider */}
                <div>
                    <h4 className="font-medium mb-2">Maximum Delivery Time</h4>
                    <Slider
                        value={[selectedFilters.maxDeliveryTime]}
                        onValueChange={([value]) => 
                            setSelectedFilters(prev => ({ ...prev, maxDeliveryTime: value }))
                        }
                        max={90}
                        step={5}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Up to {selectedFilters.maxDeliveryTime} minutes
                    </p>
                </div>
            </div>
        );

        // Enhanced mobile sheet with better UX
        if (isMobile) {
            return (
                <Sheet>
                    <SheetTrigger asChild>
                        <Button 
                            variant="outline" 
                            className="w-full rounded-full flex items-center justify-between"
                        >
                            <span className="flex items-center">
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </span>
                            <Badge variant="secondary" className="ml-2">
                                {Object.values(selectedFilters).flat().length}
                            </Badge>
                        </Button>
                    </SheetTrigger>
                    <SheetContent 
                        side="bottom" 
                        className="rounded-t-3xl h-[80vh]"
                    >
                        <ScrollArea className="h-full">
                            <SheetHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 pb-4">
                                <div className="flex items-center justify-between">
                                    <SheetTitle>Filter Options</SheetTitle>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setSelectedFilters({
                                            cuisine: [],
                                            priceRange: [],
                                            rating: 0,
                                            maxDistance: 5,
                                            maxDeliveryTime: 60
                                        })}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </SheetHeader>
                            <div className="px-1 pb-8">
                                {content}
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            );
        }

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-full">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-4">
                    {content}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white 
                                   flex items-center gap-2">
                            <Navigation className="w-8 h-8 text-primary" />
                            Restaurants Near You
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Discover amazing restaurants in your area
                        </p>
                    </div>

                    {/* Location and Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        {/* Location Input/Display */}
                        <div className="relative flex-1 sm:flex-none">
                            <Input
                                type="text"
                                placeholder="Enter your location..."
                                className="pl-10 pr-4 py-2 rounded-full w-full sm:w-[300px]"
                                value={userLocation ? `${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}` : ''}
                                readOnly
                            />
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={getUserLocation}
                            >
                                <Navigation className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* View Toggle and Filters */}
                        <div className="flex items-center gap-2">
                            <FiltersMenu />
                            <div className="border-l h-6 border-gray-200 dark:border-gray-700" />
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-full",
                                    viewType === 'grid' && "text-primary"
                                )}
                                onClick={() => setViewType('grid')}
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "rounded-full",
                                    viewType === 'list' && "text-primary"
                                )}
                                onClick={() => setViewType('list')}
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Map Section */}
                <MapComponent />

                {/* Restaurants Grid/List */}
                {locationError ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{locationError}</h3>
                        <p className="text-gray-500 mb-4">
                            Please enable location services or enter your location manually
                        </p>
                        <Button
                            variant="outline"
                            onClick={getUserLocation}
                            className="rounded-full"
                        >
                            <Navigation className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <div className={cn(
                        viewType === 'grid' 
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "space-y-6"
                    )}>
                        <AnimatePresence>
                            {isLoadingLocation ? (
                                <div className="col-span-full flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                filteredRestaurants?.map(restaurant => (
                                    <RestaurantCard
                                        key={restaurant.id}
                                        restaurant={restaurant}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LocationBasedSuggestions; 