import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    Heart,
    Trash2,
    ShoppingBag,
    Star,
    Clock,
    MoreHorizontal,
    Flame,
    Filter,
    ChevronDown,
    ChevronUp,
    Share2,
    Bookmark,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { useToast } from '@/Components/ui/use-toast';

const WishlistItems = ({
    items = [],
    onRemoveItem,
    onMoveToCart,
    onClearWishlist,
    removeInProgress = false,
    moveToCartInProgress = false
}) => {
    const [sortBy, setSortBy] = useState('date_added');
    const [filterBy, setFilterBy] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expanded, setExpanded] = useState(false);
    const { toast } = useToast();

    // Sort items based on selected sort option
    const sortedItems = [...items].sort((a, b) => {
        switch (sortBy) {
            case 'price_low':
                return a.price - b.price;
            case 'price_high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'name':
                return a.name.localeCompare(b.name);
            case 'date_added':
            default:
                return new Date(b.date_added) - new Date(a.date_added);
        }
    });

    // Filter items based on filter and search
    const filteredItems = sortedItems.filter(item => {
        // Apply search filter
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Apply category filter
        if (filterBy !== 'all' && item.restaurant?.name !== filterBy) {
            return false;
        }

        return true;
    });

    // Get unique restaurants for filter
    const restaurants = [...new Set(items.map(item => item.restaurant?.name).filter(Boolean))];

    // Handle bulk actions
    const handleMoveAllToCart = () => {
        // In a real app, you'd implement the logic to move all items to cart
        toast({
            title: "Success",
            description: "All items moved to cart",
        });
    };

    return (
        <div id="wishlist-content" className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Your Wishlist Items
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
                    </p>
                </div>

                {/* Controls and Actions */}
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary"
                        onClick={() => setExpanded(!expanded)}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                        {expanded ? (
                            <ChevronUp className="w-4 h-4 ml-2" />
                        ) : (
                            <ChevronDown className="w-4 h-4 ml-2" />
                        )}
                    </Button>

                    {/* Danger Actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4 mr-2" />
                                Actions
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleMoveAllToCart}>
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Move All to Cart
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast({ title: "Wishlist shared successfully" })}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share Wishlist
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-500 focus:text-red-500"
                                onClick={onClearWishlist}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear Wishlist
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Expanded Filters */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Sort By */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                        Sort By
                                    </label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="date_added">Date Added</SelectItem>
                                            <SelectItem value="price_low">Price: Low to High</SelectItem>
                                            <SelectItem value="price_high">Price: High to Low</SelectItem>
                                            <SelectItem value="rating">Rating</SelectItem>
                                            <SelectItem value="name">Name</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Filter By */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                        Filter By Restaurant
                                    </label>
                                    <Select value={filterBy} onValueChange={setFilterBy}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Restaurants</SelectItem>
                                            {restaurants.map(restaurant => (
                                                <SelectItem key={restaurant} value={restaurant}>
                                                    {restaurant}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Search */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                                        Search
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Search wishlist..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Wishlist Items Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredItems.map((item, index) => (
                            <WishlistItemCard
                                key={item.id}
                                item={item}
                                index={index}
                                onRemove={() => onRemoveItem(item.id)}
                                onMoveToCart={() => onMoveToCart(item.id)}
                                removeInProgress={removeInProgress}
                                moveToCartInProgress={moveToCartInProgress}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery || filterBy !== 'all'
                            ? 'Try adjusting your filters to see more items'
                            : 'Your wishlist is empty. Browse our menu to add items.'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

const WishlistItemCard = ({
    item,
    index,
    onRemove,
    onMoveToCart,
    removeInProgress,
    moveToCartInProgress
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const { toast } = useToast();

    // Format date added to a readable format
    const formattedDate = item.date_added
        ? format(new Date(item.date_added), 'MMM dd, yyyy')
        : 'Recently added';

    // Calculate discount
    const hasDiscount = item.discount_percent > 0;
    const originalPrice = item.original_price || item.price;

    // Check if item is available
    const isAvailable = item.is_available !== false; // Default to true if not specified

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            layout
            className={cn(
                "relative group overflow-hidden",
                "bg-white dark:bg-gray-800",
                "rounded-xl border border-gray-100 dark:border-gray-700",
                "shadow-sm hover:shadow-md transition-all duration-300",
                !isAvailable && "opacity-75"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Unavailable Overlay */}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-red-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Currently Unavailable
                        </span>
                    </div>
                )}

                {/* Price Badge */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    <Badge className="bg-primary/90 text-white">
                        {item.currency}{item.price.toFixed(2)}
                    </Badge>

                    {hasDiscount && (
                        <Badge variant="outline" className="bg-red-500/90 text-white">
                            <Flame className="w-3 h-3 mr-1" />
                            {item.discount_percent}% OFF
                        </Badge>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm 
                                           hover:bg-white/40 text-white transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onRemove();
                                    }}
                                    disabled={removeInProgress}
                                >
                                    {removeInProgress ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Remove from Wishlist</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Date Added */}
                <div className="absolute bottom-4 left-4 text-white text-xs">
                    <span className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                        Added {formattedDate}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <Link
                            href={`/menu/${item.slug}`}
                            className="text-lg font-semibold text-gray-900 dark:text-white 
                                   hover:text-primary transition-colors block"
                        >
                            {item.name}
                        </Link>

                        {item.restaurant && (
                            <Link
                                href={`/restaurants/${item.restaurant.slug}`}
                                className="text-sm text-gray-500 dark:text-gray-400 
                                       hover:text-primary transition-colors"
                            >
                                {item.restaurant.name}
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-medium">{item.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">
                            ({item.reviews_count})
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {item.description}
                </p>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">
                            {item.currency}{item.price.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">
                                {item.currency}{originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isAvailable) {
                                onMoveToCart();
                            } else {
                                toast({
                                    title: "Item Unavailable",
                                    description: "This item is currently not available",
                                    variant: "destructive"
                                });
                            }
                        }}
                        disabled={moveToCartInProgress || !isAvailable}
                        className="rounded-full"
                        size="sm"
                    >
                        {moveToCartInProgress ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <ShoppingBag className="w-4 h-4 mr-2" />
                        )}
                        Add to Cart
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default WishlistItems; 