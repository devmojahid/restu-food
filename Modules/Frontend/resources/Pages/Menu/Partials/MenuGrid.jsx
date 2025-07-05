import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, 
    Clock, 
    Tag, 
    Plus, 
    Info,
    Heart,
    ChevronRight,
    AlertCircle,
    Utensils,
    Flame,
    Leaf,
    DollarSign,
    X
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/Components/ui/use-toast';
import Categories from './Categories';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import NoData from '@/Components/ui/no-data';
import { 
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/Components/ui/sheet";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Skeleton } from "@/Components/ui/skeleton";
import { useInView } from 'react-intersection-observer';
import QuickView from '@/Components/Frontend/Menu/QuickView';
import { useMenu } from '@/hooks/useMenu';

const MenuGrid = ({ categories, menuItems, view, searchQuery: initialSearch, activeFilters: initialFilters }) => {
    const {
        items: filteredItems,
        wishlist,
        selectedCategory,
        filters,
        searchQuery,
        toggleWishlist,
        setSelectedCategory,
        updateFilters,
        clearFilters,
        setSearchQuery,
        isWishlisted
    } = useMenu(menuItems);

    // Update search and filters when props change
    useEffect(() => {
        setSearchQuery(initialSearch);
        updateFilters(initialFilters);
    }, [initialSearch, initialFilters]);

    const { addToCart } = useCart();
    const { toast } = useToast();
    const [showItemDetails, setShowItemDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { ref: loadMoreRef, inView } = useInView();

    // Add this filter options object
    const filterOptions = {
        sort_options: {
            'recommended': 'Recommended',
            'price_asc': 'Price: Low to High',
            'price_desc': 'Price: High to Low',
            'rating': 'Highest Rated',
            'popularity': 'Most Popular'
        },
        dietary: {
            'vegetarian': 'Vegetarian',
            'vegan': 'Vegan',
            'gluten_free': 'Gluten Free',
            'dairy_free': 'Dairy Free'
        }
    };

    // Sort items
    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (filters.sort) {
            case 'price_asc':
                return a.price - b.price;
            case 'price_desc':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'popularity':
                return b.reviews_count - a.reviews_count;
            default:
                // For recommended, use a combination of rating and popularity
                const aScore = (a.rating * 0.7) + ((a.reviews_count / 100) * 0.3);
                const bScore = (b.rating * 0.7) + ((b.reviews_count / 100) * 0.3);
                return bScore - aScore;
        }
    });

    const handleAddToCart = (item) => {
        addToCart(item);
        toast({
            title: "Added to Cart",
            description: `${item.name} has been added to your cart`,
            variant: "success"
        });
    };

    const ItemCard = ({ item, index, isListView }) => {
        const { ref, inView } = useInView({
            threshold: 0.1,
            triggerOnce: true
        });
        const isWishlisted = wishlist.has(item.id);

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.05 }}
                className={cn(
                    "group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden",
                    "border border-gray-200 dark:border-gray-700",
                    "hover:shadow-lg transition-all duration-300",
                    isListView ? "flex gap-6" : "flex flex-col"
                )}
            >
                {/* Image Section with Enhanced Hover Effects */}
                <div className={cn(
                    "relative overflow-hidden",
                    isListView ? "w-48 h-48" : "aspect-[4/3]"
                )}>
                    <motion.img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Enhanced Badges with Animation */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <AnimatePresence>
                            {item.is_popular && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <Badge className="bg-primary">
                                        <Flame className="w-3 h-3 mr-1" />
                                        Popular
                                    </Badge>
                                </motion.div>
                            )}
                            {item.is_new && (
                                <Badge className="bg-green-500">New</Badge>
                            )}
                            {item.discount && (
                                <Badge className="bg-red-500">-{item.discount}%</Badge>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Quick Actions with Tooltips */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() => toggleWishlist(item.id)}
                                    >
                                        <Heart className={cn(
                                            "w-4 h-4",
                                            isWishlisted && "fill-current text-red-500"
                                        )} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() => setShowItemDetails(item)}
                                    >
                                        <Info className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Quick View
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Content Section with Enhanced Layout */}
                <div className={cn(
                    "flex-1",
                    isListView ? "py-4 pr-4" : "p-6"
                )}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <Link 
                                href={`/menu/${item.slug}`}
                                className="group-hover:text-primary transition-colors"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {item.name}
                                </h3>
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {item.description}
                            </p>
                        </div>
                        <div className="text-lg font-bold text-primary">
                            ${item.price}
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center text-yellow-400">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="ml-1 text-sm font-medium">
                                            {item.rating}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.reviews_count} reviews</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span className="ml-1 text-sm">
                                {item.preparation_time}min
                            </span>
                        </div>

                        {item.is_vegetarian && (
                            <Badge variant="secondary" className="gap-1">
                                <Leaf className="w-3 h-3" />
                                Vegetarian
                            </Badge>
                        )}

                        {item.is_spicy && (
                            <Badge variant="secondary" className="gap-1">
                                <Flame className="w-3 h-3" />
                                Spicy
                            </Badge>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Cart
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            asChild
                        >
                            <Link href={`/menu/${item.slug}`}>
                                <Info className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    };

    const ItemSkeleton = ({ isListView }) => (
        <div className={cn(
            "bg-white dark:bg-gray-800 rounded-2xl overflow-hidden",
            "border border-gray-200 dark:border-gray-700",
            isListView ? "flex gap-6" : "flex flex-col"
        )}>
            <Skeleton className={cn(
                "bg-gray-200 dark:bg-gray-700",
                isListView ? "w-48 h-48" : "aspect-[4/3] w-full"
            )} />
            <div className="flex-1 p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <Categories
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                className="mb-8"
            />

            {/* Active Filters */}
            {(selectedCategory || filters.dietary.length > 0 || filters.price.length > 0 || filters.sort !== 'recommended') && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 px-4"
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Active Filters:
                        </span>
                        {/* ... your existing filter badges ... */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            className="ml-auto"
                        >
                            Clear All Filters
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Grid Content */}
            <div className="relative">
                {filteredItems.length === 0 ? (
                    <NoData
                        title="No items found"
                        description="Try adjusting your filters or search term"
                    />
                ) : (
                    <div className={cn(
                        "grid gap-6",
                        view === 'grid' 
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                            : "grid-cols-1"
                    )}>
                        {filteredItems.map((item, index) => (
                            <ItemCard 
                                key={item.id} 
                                item={item} 
                                index={index}
                                isListView={view === 'list'}
                                onAddToCart={handleAddToCart}
                                onQuickView={setShowItemDetails}
                                onWishlist={toggleWishlist}
                                isWishlisted={isWishlisted(item.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick View */}
            <QuickView 
                item={showItemDetails}
                isOpen={!!showItemDetails}
                onClose={() => setShowItemDetails(null)}
                onAddToCart={handleAddToCart}
                onWishlist={toggleWishlist}
                isWishlisted={showItemDetails ? isWishlisted(showItemDetails.id) : false}
            />
        </div>
    );
};

export default MenuGrid; 