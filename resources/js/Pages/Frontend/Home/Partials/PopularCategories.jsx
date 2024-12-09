import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronRight, 
    Search,
    Pizza,
    Beef,
    Coffee,
    IceCream,
    Soup,
    Salad,
    Sandwich,
    Wine,
    Clock,
    MapPin,
    TrendingUp,
    Utensils,
    ArrowRight,
    Filter,
    RefreshCw,
    Sparkles,
    Flame,
    Star,
    Award,
    Zap,
    Bookmark,
    Heart,
    ThumbsUp,
    Loader2,
    ChevronDown,
    ChevronUp,
    Percent,
    Timer,
    Users,
    X
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet";

const PopularCategories = ({ categories }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [sortBy, setSortBy] = useState('popular');
    const [showAll, setShowAll] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Number of categories to show initially
    const INITIAL_DISPLAY_COUNT = 8;

    // Enhanced category icons with better gradients and animations
    const categoryIcons = {
        'Pizza': {
            icon: Pizza,
            gradient: 'from-orange-400 via-red-500 to-pink-500',
            bgLight: 'bg-orange-50',
            bgDark: 'dark:bg-orange-950/30'
        },
        'Burger': {
            icon: Beef,
            gradient: 'from-red-400 via-red-500 to-rose-600',
            bgLight: 'bg-red-50',
            bgDark: 'dark:bg-red-950/30'
        },
        'Coffee': {
            icon: Coffee,
            gradient: 'from-amber-400 via-amber-500 to-yellow-500',
            bgLight: 'bg-amber-50',
            bgDark: 'dark:bg-amber-950/30'
        },
        'Desserts': {
            icon: IceCream,
            gradient: 'from-pink-400 via-pink-500 to-purple-500',
            bgLight: 'bg-pink-50',
            bgDark: 'dark:bg-pink-950/30'
        },
        'Sushi': {
            icon: Soup,
            gradient: 'from-emerald-400 via-emerald-500 to-teal-500',
            bgLight: 'bg-emerald-50',
            bgDark: 'dark:bg-emerald-950/30'
        },
        'Salads': {
            icon: Salad,
            gradient: 'from-green-400 via-green-500 to-teal-500',
            bgLight: 'bg-green-50',
            bgDark: 'dark:bg-green-950/30'
        },
        'Sandwiches': {
            icon: Sandwich,
            gradient: 'from-yellow-400 via-yellow-500 to-orange-500',
            bgLight: 'bg-yellow-50',
            bgDark: 'dark:bg-yellow-950/30'
        },
        'Drinks': {
            icon: Wine,
            gradient: 'from-blue-400 via-blue-500 to-indigo-500',
            bgLight: 'bg-blue-50',
            bgDark: 'dark:bg-blue-950/30'
        }
    };

    // Enhanced mobile sort menu with better UX
    const SortMenu = ({ isMobile }) => {
        const sortOptions = [
            { value: 'popular', label: 'Most Popular', icon: Star, color: 'text-yellow-500' },
            { value: 'trending', label: 'Trending Now', icon: Flame, color: 'text-orange-500' },
            { value: 'newest', label: 'Just Added', icon: Sparkles, color: 'text-blue-500' },
            { value: 'rated', label: 'Top Rated', icon: ThumbsUp, color: 'text-green-500' }
        ];

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
                                Sort By
                            </span>
                            <span className="text-primary">
                                {sortOptions.find(opt => opt.value === sortBy)?.label}
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent 
                        side="bottom" 
                        className="rounded-t-3xl"
                    >
                        <>
                            <SheetHeader className="text-left pb-4">
                                <SheetTitle>Sort Categories</SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="h-full py-4">
                                <div className="space-y-2">
                                    {sortOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <motion.button
                                                key={option.value}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setSortBy(option.value);
                                                    setIsLoading(true);
                                                    setTimeout(() => setIsLoading(false), 300);
                                                }}
                                                className={cn(
                                                    "w-full p-3 rounded-xl flex items-center",
                                                    "transition-all duration-200",
                                                    sortBy === option.value 
                                                        ? "bg-primary/10 text-primary"
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                )}
                                            >
                                                <Icon className={cn("w-5 h-5 mr-3", option.color)} />
                                                <span className="font-medium">{option.label}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </>
                    </SheetContent>
                </Sheet>
            );
        }

        // Enhanced desktop dropdown
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="outline" 
                        className="rounded-full min-w-[140px]"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        <span>Sort By</span>
                        <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    {sortOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <DropdownMenuItem 
                                key={option.value}
                                onClick={() => {
                                    setSortBy(option.value);
                                    setIsLoading(true);
                                    setTimeout(() => setIsLoading(false), 500);
                                }}
                                className={cn(
                                    "flex items-center py-2",
                                    sortBy === option.value && "bg-primary/10 text-primary"
                                )}
                            >
                                <Icon className={cn("w-4 h-4 mr-2", option.color)} />
                                {option.label}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    // Enhanced empty state component
    const EmptyState = () => (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-4"
        >
            <div className="relative mb-8 mx-auto w-24 h-24">
                <motion.div 
                    className="absolute inset-0 bg-primary/10 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <Utensils className="w-12 h-12 text-primary absolute top-1/2 left-1/2 
                                 -translate-x-1/2 -translate-y-1/2" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No Categories Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchQuery 
                    ? `No categories match "${searchQuery}". Try a different search term.`
                    : "We're currently organizing our menu categories. Check back soon!"}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setSearchQuery('')}
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Search
                </Button>
                <Link
                    href="/menu"
                    className="inline-flex items-center space-x-2 bg-primary text-white 
                           px-6 py-3 rounded-full hover:bg-primary/90 transition-colors"
                >
                    <span>Browse Full Menu</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );

    // Enhanced CategoryCard with better stats display
    const CategoryCard = ({ category, index }) => {
        const iconConfig = categoryIcons[category.name] || { 
            icon: Pizza, 
            gradient: 'from-gray-500 to-gray-600' 
        };
        const Icon = iconConfig.icon;
        const isSelected = selectedCategory?.id === category.id;

        // Add these enhancements inside the card content
        const Stats = () => (
            <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Users className="w-4 h-4 mb-1 text-blue-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Daily Orders</span>
                    <span className="font-semibold">{category.dailyOrders}+</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Timer className="w-4 h-4 mb-1 text-green-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Avg. Time</span>
                    <span className="font-semibold">{category.avgDeliveryTime}</span>
                </div>
            </div>
        );

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={cn(
                    "group relative overflow-hidden",
                    "bg-white dark:bg-gray-800",
                    "rounded-2xl shadow-lg hover:shadow-xl",
                    "transition-all duration-300",
                    isSelected && "ring-2 ring-primary",
                    "cursor-pointer",
                    "hover:border-primary/50 dark:hover:border-primary/50",
                    "group/card",
                    "border border-gray-100 dark:border-gray-800",
                    "hover:border-primary dark:hover:border-primary"
                )}
            >
                <Link 
                    href={`/menu?category=${category.slug}`}
                    className="block p-6 relative"
                    onClick={() => handleCategoryClick(category)}
                >
                    {/* Enhanced Background Pattern */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10 overflow-hidden">
                        <motion.div 
                            className={cn(
                                "absolute inset-0 bg-gradient-to-br",
                                iconConfig.gradient
                            )}
                            animate={{ 
                                rotate: [0, 5, 0],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 5, repeat: Infinity }}
                        />
                        <div className="absolute right-0 bottom-0 w-32 h-32 -mr-16 -mb-16">
                            <motion.div 
                                className="w-full h-full rounded-full bg-primary/10"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="relative">
                        {/* Enhanced Icon Container */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn(
                                            "w-16 h-16 mb-4 rounded-xl",
                                            "flex items-center justify-center",
                                            "bg-gradient-to-br",
                                            iconConfig.gradient,
                                            "group-hover/card:shadow-lg",
                                            "transform transition-all duration-300"
                                        )}
                                    >
                                        <Icon className="w-8 h-8 text-white" />
                                    </motion.div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Browse {category.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Enhanced Category Info */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white 
                                           group-hover/card:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    {category.trending && (
                                        <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                                            <Flame className="w-3 h-3 mr-1" />
                                            Hot
                                        </Badge>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                                    >
                                        <Heart className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Enhanced Stats */}
                            <Stats />

                            {/* Enhanced Footer */}
                            <div className="flex items-center justify-between pt-2 border-t dark:border-gray-800">
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    {category.items}+ items
                                </Badge>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="text-primary"
                                >
                                    <ArrowRight className="w-5 h-5 transform group-hover/card:translate-x-1 transition-transform" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    };

    // Filter and process categories
    const processedCategories = categories?.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'popular') return b.items - a.items;
        if (sortBy === 'trending') return b.trending ? 1 : -1;
        if (sortBy === 'rated') return b.rating - a.rating;
        return 0;
    });

    const displayedCategories = showAll 
        ? processedCategories 
        : processedCategories?.slice(0, INITIAL_DISPLAY_COUNT);

    const handleCategoryClick = useCallback((category) => {
        setSelectedCategory(category);
    }, []);

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4">
                {/* Enhanced Header with better mobile layout */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex-1"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white 
                                   flex items-center gap-2 flex-wrap">
                            <Sparkles className="w-8 h-8 text-primary" />
                            Popular Categories
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Explore our most popular food categories and find your favorite dishes
                        </p>
                    </motion.div>

                    {/* Enhanced Mobile-Friendly Controls */}
                    <div className="mt-6 md:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 sm:flex-none">
                            <Input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-full w-full sm:w-[200px]"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        <div className="w-full sm:w-auto">
                            <SortMenu isMobile={isMobile} />
                        </div>
                    </div>
                </div>

                {/* Enhanced grid layout for better responsiveness */}
                {processedCategories?.length > 0 ? (
                    <>
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                            layout
                        >
                            <AnimatePresence>
                                {isLoading ? (
                                    <div className="col-span-full flex justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    displayedCategories?.map((category, index) => (
                                        <CategoryCard 
                                            key={category.id} 
                                            category={category} 
                                            index={index}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Enhanced View More/Less Button */}
                        {processedCategories.length > INITIAL_DISPLAY_COUNT && (
                            <motion.div 
                                className="text-center mt-12"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-full"
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    {showAll ? (
                                        <>
                                            <ChevronUp className="w-4 h-4 mr-2" />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4 mr-2" />
                                            View All Categories ({processedCategories.length})
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <EmptyState />
                )}
            </div>
        </section>
    );
};

export default PopularCategories; 