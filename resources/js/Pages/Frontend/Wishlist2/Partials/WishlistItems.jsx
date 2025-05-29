import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    ShoppingBag,
    Trash,
    Grid,
    List,
    SortAsc,
    Filter,
    Clock,
    Star,
    X,
    ChevronDown,
    ChevronRight,
    MoreHorizontal,
    Info,
    Bookmark,
    Edit,
    Share,
    Tag,
    BadgePercent,
    CalendarClock,
    AlarmClock,
    Utensils
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

const WishlistItems = ({
    items = [],
    onRemoveItem,
    onMoveToCart,
    onClearWishlist,
    removeInProgress = false,
    moveToCartInProgress = false,
    collectionName = null
}) => {
    const [view, setView] = useState('grid');
    const [sortBy, setSortBy] = useState('date_added');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterBy, setFilterBy] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [confirmClearOpen, setConfirmClearOpen] = useState(false);

    // Filter and sort items
    const filteredItems = items
        .filter(item => {
            // Apply search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    item.name.toLowerCase().includes(query) ||
                    item.restaurant?.name.toLowerCase().includes(query) ||
                    item.category?.toLowerCase().includes(query)
                );
            }

            // Apply category filter
            if (filterBy !== 'all') {
                if (filterBy === 'discounted' && !item.discount) return false;
                if (filterBy === 'limited_time' && !item.limited_time) return false;
                if (filterBy === 'out_of_stock' && item.in_stock) return false;
                if (filterBy === 'in_stock' && !item.in_stock) return false;
                if (filterBy === 'featured' && !item.featured) return false;
            }

            return true;
        })
        .sort((a, b) => {
            // Apply sorting
            let comparison = 0;

            switch (sortBy) {
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'rating':
                    comparison = b.rating - a.rating;
                    break;
                case 'restaurant':
                    comparison = a.restaurant?.name.localeCompare(b.restaurant?.name || '');
                    break;
                case 'date_added':
                default:
                    comparison = new Date(b.date_added) - new Date(a.date_added);
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

    // Toggle sort order when clicking the same sort option
    const handleSortChange = (value) => {
        if (value === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(value);
            setSortOrder('desc');
        }
    };

    // Handle clear all items
    const handleClearAll = () => {
        setConfirmClearOpen(false);
        onClearWishlist();
    };

    // Component for empty state
    const EmptyState = () => (
        <div className="text-center py-12 px-4">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 p-4">
                <Heart className="h-10 w-10 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No wishlist items found</h3>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
                {searchQuery || filterBy !== 'all'
                    ? "No items match your current filters. Try adjusting your search or filters."
                    : collectionName
                        ? `This collection is empty. Add items to "${collectionName}" to see them here.`
                        : "Your wishlist is empty. Start adding items to your wishlist to see them here."}
            </p>
            <div className="flex justify-center space-x-4">
                {(searchQuery || filterBy !== 'all') && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery('');
                            setFilterBy('all');
                        }}
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
                <Link href="/restaurants">
                    <Button>
                        <Utensils className="mr-2 h-4 w-4" />
                        Explore Restaurants
                    </Button>
                </Link>
            </div>
        </div>
    );

    // If no items match filters
    if (filteredItems.length === 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {/* Header with actions */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold md:text-2xl">
                        {collectionName
                            ? `Collection: ${collectionName}`
                            : `Your Wishlist`}
                        <span className="ml-2 text-gray-500">({filteredItems.length} items)</span>
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-auto">
                        <Input
                            type="text"
                            placeholder="Search wishlist..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-10 w-full sm:w-[200px]"
                        />
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        {searchQuery && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setSearchQuery('')}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "rounded-full",
                            showFilters && "bg-primary/10 text-primary"
                        )}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>

                    {/* View Toggle */}
                    <div className="flex rounded-full border p-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-full h-8 w-8",
                                view === 'grid' && "bg-primary text-primary-foreground"
                            )}
                            onClick={() => setView('grid')}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-full h-8 w-8",
                                view === 'list' && "bg-primary text-primary-foreground"
                            )}
                            onClick={() => setView('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Sort Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-full">
                                <SortAsc className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Sort</span>
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {[
                                { value: 'date_added', label: 'Date Added' },
                                { value: 'price', label: 'Price' },
                                { value: 'name', label: 'Name' },
                                { value: 'rating', label: 'Rating' },
                                { value: 'restaurant', label: 'Restaurant' },
                            ].map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => handleSortChange(option.value)}
                                    className={cn(
                                        "flex items-center justify-between",
                                        sortBy === option.value && "bg-primary/10 text-primary"
                                    )}
                                >
                                    {option.label}
                                    {sortBy === option.value && (
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 transition-transform",
                                                sortOrder === 'desc' ? "rotate-0" : "rotate-180"
                                            )}
                                        />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Clear All Button */}
                    <Button
                        variant="outline"
                        className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setConfirmClearOpen(true)}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Clear All</span>
                    </Button>
                </div>
            </div>

            {/* Filters Row (expandable) */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="rounded-lg border bg-card p-4 shadow-sm">
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={filterBy === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterBy('all')}
                                    className="rounded-full"
                                >
                                    All
                                </Button>
                                <Button
                                    variant={filterBy === 'discounted' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterBy('discounted')}
                                    className="rounded-full"
                                >
                                    <BadgePercent className="mr-2 h-4 w-4" />
                                    Discounted
                                </Button>
                                <Button
                                    variant={filterBy === 'featured' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterBy('featured')}
                                    className="rounded-full"
                                >
                                    <Star className="mr-2 h-4 w-4" />
                                    Featured
                                </Button>
                                <Button
                                    variant={filterBy === 'in_stock' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterBy('in_stock')}
                                    className="rounded-full"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    In Stock
                                </Button>
                                <Button
                                    variant={filterBy === 'out_of_stock' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterBy('out_of_stock')}
                                    className="rounded-full"
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Out of Stock
                                </Button>
                                <Button
                                    variant={filterBy === 'limited_time' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setFilterBy('limited_time')}
                                    className="rounded-full"
                                >
                                    <AlarmClock className="mr-2 h-4 w-4" />
                                    Limited Time
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Items Grid/List */}
            <div className={cn(
                view === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
            )}>
                <AnimatePresence>
                    {filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            layout
                        >
                            <WishlistItemCard
                                item={item}
                                view={view}
                                onRemove={onRemoveItem}
                                onMoveToCart={onMoveToCart}
                                removeInProgress={removeInProgress}
                                moveToCartInProgress={moveToCartInProgress}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Confirm Clear Dialog */}
            <Dialog open={confirmClearOpen} onOpenChange={setConfirmClearOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Clear Wishlist</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to clear all items from your wishlist?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmClearOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleClearAll}
                        >
                            Clear All
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Wishlist Item Card Component
const WishlistItemCard = ({
    item,
    view,
    onRemove,
    onMoveToCart,
    removeInProgress,
    moveToCartInProgress
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Format price with discount
    const formattedPrice = formatCurrency(item.price);
    const formattedOriginalPrice = item.discount ? formatCurrency(item.original_price) : null;

    // Format date added
    const dateAdded = item.date_added_formatted || formatDate(item.date_added);

    if (view === 'list') {
        return (
            <div
                className="group relative flex gap-4 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                                <Link href={`/menu/${item.slug}`}>{item.name}</Link>
                            </h3>
                            {item.restaurant && (
                                <p className="text-sm text-gray-500">
                                    <Link
                                        href={`/restaurants/${item.restaurant.slug}`}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {item.restaurant.name}
                                    </Link>
                                </p>
                            )}
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="ml-1 text-sm font-medium">{item.rating}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags & Metadata */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        {item.category && (
                            <Badge variant="outline" className="text-xs">
                                {item.category}
                            </Badge>
                        )}
                        {item.in_stock === false && (
                            <Badge variant="destructive" className="text-xs">
                                Out of Stock
                            </Badge>
                        )}
                        {item.discount > 0 && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-xs">
                                {item.discount}% OFF
                            </Badge>
                        )}
                        {item.limited_time && (
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 text-xs">
                                Limited Time
                            </Badge>
                        )}
                    </div>

                    {/* Date & Price Info */}
                    <div className="mt-auto flex items-end justify-between pt-2">
                        <div className="text-xs text-gray-500">
                            Added {dateAdded}
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="text-right">
                                <div className="font-medium text-lg">{formattedPrice}</div>
                                {formattedOriginalPrice && (
                                    <div className="text-xs text-gray-500 line-through">
                                        {formattedOriginalPrice}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute right-4 top-4 flex space-x-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => onMoveToCart(item.id)}
                                    disabled={moveToCartInProgress}
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Add to Cart</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => onRemove(item.id)}
                                    disabled={removeInProgress}
                                >
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Remove from Wishlist</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        );
    }

    // Grid View
    return (
        <div
            className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />

                {/* Top-left badges */}
                <div className="absolute left-3 top-3 flex flex-col space-y-2">
                    {item.discount > 0 && (
                        <Badge className="bg-green-500 text-white">
                            {item.discount}% OFF
                        </Badge>
                    )}
                    {item.limited_time && (
                        <Badge className="bg-amber-500 text-white">
                            Limited Time
                        </Badge>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="absolute right-3 top-3 flex space-x-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white"
                        onClick={() => onMoveToCart(item.id)}
                        disabled={moveToCartInProgress}
                    >
                        <ShoppingBag className="h-4 w-4 text-gray-700" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white text-red-500 hover:text-red-600"
                        onClick={() => onRemove(item.id)}
                        disabled={removeInProgress}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Stock Status */}
                {item.in_stock === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <Badge variant="destructive" className="text-sm">
                            Out of Stock
                        </Badge>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-medium text-lg group-hover:text-primary transition-colors line-clamp-1">
                            <Link href={`/menu/${item.slug}`}>{item.name}</Link>
                        </h3>
                        {item.restaurant && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                                <Link
                                    href={`/restaurants/${item.restaurant.slug}`}
                                    className="hover:text-primary transition-colors"
                                >
                                    {item.restaurant.name}
                                </Link>
                            </p>
                        )}
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm font-medium">{item.rating}</span>
                        </div>
                    </div>
                </div>

                {/* Date Added */}
                <div className="mt-2 text-xs text-gray-500">
                    <Clock className="mr-1 inline-block h-3 w-3" />
                    Added {dateAdded}
                </div>

                {/* Price */}
                <div className="mt-3 flex items-center justify-between">
                    <div>
                        <div className="font-medium text-lg">{formattedPrice}</div>
                        {formattedOriginalPrice && (
                            <div className="text-xs text-gray-500 line-through">
                                {formattedOriginalPrice}
                            </div>
                        )}
                    </div>

                    <Badge variant="outline" className="text-xs">
                        {item.category}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

// Search Icon Component
const Search = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.3-4.3" />
    </svg>
);

// CheckCircle Icon Component
const CheckCircle = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

// XCircle Icon Component
const XCircle = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
);

export default WishlistItems; 