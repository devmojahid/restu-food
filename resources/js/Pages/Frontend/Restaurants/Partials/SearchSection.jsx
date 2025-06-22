import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Grid,
    LayoutList,
    MapPin,
    X,
    Filter,
    ChevronDown,
    Clock,
    Utensils,
    DollarSign,
    Star,
    TrendingUp,
    History,
    Bookmark,
    Pizza,
    Store,
    Beef,
    Coffee,
    Heart,
    Sparkles,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { Badge } from '@/Components/ui/badge';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { useMediaQuery } from '@/hooks/useMediaQuery';

const SearchSection = ({ searchQuery, setSearchQuery, view, setView }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([
        "Pizza", "Burger", "Sushi", "Italian"
    ]);
    const [popularSearches] = useState([
        "Best Rated", "Fast Delivery", "New Restaurants", "Trending Now"
    ]);
    const [location, setLocation] = useState("New York, NY");
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const debouncedSearch = useDebounce(searchQuery, 300);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Quick filters data
    const quickFilters = [
        { icon: Star, label: "Top Rated", color: "text-yellow-500" },
        { icon: Clock, label: "Fast Delivery", color: "text-green-500" },
        { icon: DollarSign, label: "Budget Friendly", color: "text-blue-500" },
        { icon: TrendingUp, label: "Trending", color: "text-orange-500" },
        { icon: Heart, label: "Most Loved", color: "text-red-500" },
        { icon: Sparkles, label: "New", color: "text-purple-500" }
    ];

    // Popular cuisines for quick access
    const popularCuisines = [
        { icon: Pizza, name: "Pizza", color: "bg-orange-100 text-orange-600" },
        { icon: Beef, name: "Burgers", color: "bg-red-100 text-red-600" },
        { icon: Coffee, name: "Sushi", color: "bg-green-100 text-green-600" },
        { icon: Utensils, name: "Italian", color: "bg-blue-100 text-blue-600" }
    ];

    // Add new states for better functionality
    const [isMounted, setIsMounted] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const popoverRef = useRef(null);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current &&
                !searchRef.current.contains(event.target) &&
                !popoverRef.current?.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        setIsMounted(true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle search input focus
    const handleSearchFocus = () => {
        setSearchFocused(true);
        setIsSearchOpen(false);
    };

    // Handle search selection
    const handleSearchSelect = (value) => {
        setSearchQuery(value);
        if (!recentSearches.includes(value)) {
            setRecentSearches(prev => [value, ...prev.slice(0, 4)]);
        }
        setIsSearchOpen(false);
    };

    // Enhanced search suggestions based on input
    useEffect(() => {
        if (debouncedSearch) {
            // Simulate API call for suggestions
            const results = popularCuisines
                .filter(cuisine =>
                    cuisine.name.toLowerCase().includes(debouncedSearch.toLowerCase())
                )
                .map(cuisine => ({
                    type: 'cuisine',
                    ...cuisine
                }));
            setSuggestions(results);
        }
    }, [debouncedSearch]);

    // Enhanced LocationContent with exact mobile UI match
    const LocationContent = () => (
        <div className="flex flex-col h-full bg-white">
            {/* Search Input */}
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search for area, street name..."
                        className="w-full h-11 pl-10 pr-4 rounded-full border border-gray-200 
                                 bg-gray-50/50 text-sm"
                    />
                </div>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto">
                {/* Use Current Location */}
                <div className="p-4">
                    <Button
                        variant="outline"
                        className="w-full flex items-center gap-3 p-3 rounded-xl
                               bg-blue-50 border-none group"
                        onClick={() => {
                            setLocation("Current Location");
                            setIsLocationOpen(false);
                        }}
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center 
                                    bg-blue-100 group-hover:bg-blue-200 transition-colors">
                            <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-blue-600 text-sm font-medium">
                                Use my current location
                            </span>
                            <span className="text-xs text-gray-500">
                                Get restaurants near you
                            </span>
                        </div>
                    </Button>
                </div>

                {/* Popular Areas - Simplified and Enhanced */}
                <div className="px-4 pb-3">
                    <h3 className="text-sm font-medium mb-3">Popular Areas</h3>
                    <div className="space-y-2">
                        {[
                            {
                                name: 'Manhattan, NY',
                                area: 'New York City',
                                restaurants: '234',
                                distance: '2.5 km',
                                time: '15-25 min',
                                badge: 'Popular',
                                badgeColor: 'text-orange-600 bg-orange-50'
                            },
                            {
                                name: 'Brooklyn, NY',
                                area: 'New York City',
                                restaurants: '156',
                                distance: '3.8 km',
                                time: '20-30 min',
                                badge: 'New',
                                badgeColor: 'text-green-600 bg-green-50'
                            }
                        ].map((item) => (
                            <motion.div
                                key={item.name}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                className="overflow-hidden"
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full px-4 py-3 hover:bg-gray-50 rounded-xl 
                                           transition-all duration-200 h-auto"
                                    onClick={() => {
                                        setLocation(item.name);
                                        setIsLocationOpen(false);
                                    }}
                                >
                                    <div className="flex items-center w-full gap-3">
                                        {/* Location Icon */}
                                        <div className="w-10 h-10 rounded-full bg-gray-100/80 
                                                    flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-gray-500" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {item.name}
                                                    </span>
                                                    {item.badge && (
                                                        <span className={cn(
                                                            "text-xs px-2 py-0.5 rounded-full",
                                                            item.badgeColor
                                                        )}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                <span>{item.restaurants} restaurants</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span>{item.distance}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span>{item.time}</span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    </div>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recent Locations */}
                <div className="px-4 pt-2 border-t">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Recent Locations</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary h-6 px-2 hover:bg-primary/5"
                        >
                            Clear All
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { name: 'Bronx, NY', color: 'text-emerald-500' },
                            { name: 'Long Island City, NY', color: 'text-emerald-500' }
                        ].map((place) => (
                            <Button
                                key={place.name}
                                variant="ghost"
                                className="h-8 rounded-full bg-gray-50 hover:bg-gray-100 px-3"
                                onClick={() => {
                                    setLocation(place.name);
                                    setIsLocationOpen(false);
                                }}
                            >
                                <MapPin className={cn("w-3 h-3 mr-1.5", place.color)} />
                                <span className="text-sm">{place.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );

    // Enhanced Location Selector Component
    const LocationSelector = () => {
        if (isMobile) {
            return (
                <Sheet open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full flex items-center gap-3 h-[52px] rounded-full
                                   border border-gray-200 dark:border-gray-700
                                   bg-white dark:bg-gray-800 px-4"
                        >
                            <MapPin className="w-5 h-5 text-gray-500" />
                            <div className="flex-1 text-left">
                                <span className="text-xs text-gray-500">Deliver to</span>
                                <span className="font-medium block truncate text-sm">{location}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="bottom"
                        className="h-[85vh] p-0 rounded-t-[1.5rem]"
                    >
                        <LocationContent />
                    </SheetContent>
                </Sheet>
            );
        }

        return (
            <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full md:w-auto flex items-center space-x-2 py-6 rounded-xl border-2",
                            "hover:border-primary/50 transition-all duration-300",
                            "bg-white dark:bg-gray-800",
                            isLocationOpen && "border-primary ring-2 ring-primary/20"
                        )}
                        role="combobox"
                    >
                        <div className="flex items-center space-x-2 flex-1">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                "bg-primary/10 text-primary"
                            )}>
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Deliver to</span>
                                <span className="font-medium truncate max-w-[150px]">{location}</span>
                            </div>
                        </div>
                        <ChevronDown className={cn(
                            "w-4 h-4 transition-transform duration-200",
                            isLocationOpen && "transform rotate-180"
                        )} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[400px] p-0"
                    align="start"
                    sideOffset={5}
                >
                    <LocationContent />
                </PopoverContent>
            </Popover>
        );
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="top-20 z-40 bg-white dark:bg-gray-900 shadow-sm"
        >
            <div className="container mx-auto">
                <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Enhanced Search Bar with Better Mobile Support */}
                        <div className="relative flex-1" ref={searchRef}>
                            <div className={cn(
                                "relative rounded-xl transition-all duration-300",
                                searchFocused && "ring-2 ring-primary ring-offset-2"
                            )}>
                                <Input
                                    type="text"
                                    placeholder="Search restaurants, cuisines, or dishes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={handleSearchFocus}
                                    className="pl-10 pr-10 py-6 w-full rounded-xl border-2 
                                           focus:border-primary transition-all duration-300
                                           text-base md:text-lg"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 
                                               w-5 h-5 text-gray-400" />
                                {searchQuery && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 
                                               h-8 w-8 hover:bg-transparent"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setIsSearchOpen(false);
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            {/* Enhanced Search Dropdown */}
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        ref={popoverRef}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 right-0 mt-2 
                                               bg-white dark:bg-gray-800 rounded-xl shadow-xl 
                                               border dark:border-gray-700 overflow-hidden"
                                    >
                                        <div className="max-h-[60vh] overflow-y-auto">
                                            {/* Popular Cuisines Grid */}
                                            <div className="p-4 border-b dark:border-gray-700">
                                                <h3 className="text-sm font-medium mb-3">
                                                    Popular Cuisines
                                                </h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                    {popularCuisines.map((cuisine) => (
                                                        <Button
                                                            key={cuisine.name}
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start h-auto py-3",
                                                                cuisine.color
                                                            )}
                                                            onClick={() => handleSearchSelect(cuisine.name)}
                                                        >
                                                            <cuisine.icon className="w-4 h-4 mr-2" />
                                                            <span className="truncate">{cuisine.name}</span>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Recent & Trending Searches */}
                                            <div className="p-4">
                                                {recentSearches.length > 0 && (
                                                    <div className="mb-6">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h3 className="text-sm font-medium">
                                                                Recent Searches
                                                            </h3>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setRecentSearches([])}
                                                            >
                                                                Clear All
                                                            </Button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {recentSearches.map((search) => (
                                                                <Badge
                                                                    key={search}
                                                                    variant="secondary"
                                                                    className="cursor-pointer"
                                                                    onClick={() => handleSearchSelect(search)}
                                                                >
                                                                    <History className="w-3 h-3 mr-1" />
                                                                    {search}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <h3 className="text-sm font-medium mb-3">
                                                        Trending Now
                                                    </h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {popularSearches.map((search) => (
                                                            <Button
                                                                key={search}
                                                                variant="ghost"
                                                                className="w-full justify-start"
                                                                onClick={() => handleSearchSelect(search)}
                                                            >
                                                                <TrendingUp className="w-4 h-4 mr-2 
                                                                              text-orange-500" />
                                                                {search}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Enhanced Location Selector */}
                        {/* <LocationSelector /> */}

                        {/* View Toggle */}
                        <div className="hidden md:flex items-center p-1 bg-gray-100 
                                    dark:bg-gray-800 rounded-lg">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-10 w-10 rounded-lg transition-all duration-300",
                                    view === 'grid' && "bg-white dark:bg-gray-700 shadow-sm"
                                )}
                                onClick={() => setView('grid')}
                            >
                                <Grid className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-10 w-10 rounded-lg transition-all duration-300",
                                    view === 'list' && "bg-white dark:bg-gray-700 shadow-sm"
                                )}
                                onClick={() => setView('list')}
                            >
                                <LayoutList className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Quick Filters with Better Mobile Support */}
                <div className="px-4 pb-4 overflow-x-auto scrollbar-hide hidden">
                    <div className="flex items-center gap-2 min-w-max">
                        {quickFilters.map((filter) => (
                            <motion.div
                                key={filter.label}
                            >
                                <Button
                                    variant="outline"
                                    className="rounded-full border-2 hover:border-primary 
                                           transition-all duration-300 whitespace-nowrap"
                                >
                                    <filter.icon className={cn("w-4 h-4 mr-2", filter.color)} />
                                    {filter.label}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SearchSection; 