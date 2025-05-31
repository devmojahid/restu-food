import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Grid, 
    List, 
    ArrowUpDown, 
    Star, 
    ShoppingBag, 
    Heart, 
    Eye,
    Badge,
    Flame,
    Info,
    Loader2,
    Filter,
    RefreshCw
} from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Badge as UIBadge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/Components/ui/sheet';

const ProductCard = ({ product, view = 'grid' }) => {
    if (view === 'grid') {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md 
                         hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
            >
                {/* Sale badge */}
                {product.on_sale && (
                    <div className="absolute top-4 left-4 z-10">
                        <UIBadge variant="destructive" className="flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            {product.discount_percentage}% OFF
                        </UIBadge>
                    </div>
                )}
                
                {/* Bestseller badge */}
                {product.is_bestseller && !product.on_sale && (
                    <div className="absolute top-4 left-4 z-10">
                        <UIBadge variant="default" className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-white" />
                            Bestseller
                        </UIBadge>
                    </div>
                )}
                
                {/* New badge */}
                {product.is_new && !product.is_bestseller && !product.on_sale && (
                    <div className="absolute top-4 left-4 z-10">
                        <UIBadge variant="secondary" className="flex items-center gap-1">
                            <Badge className="w-3 h-3" />
                            New
                        </UIBadge>
                    </div>
                )}
                
                {/* Product image */}
                <Link href={`/shop/${product.slug}`} className="block relative overflow-hidden pt-[100%]">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transform 
                                 group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Quick action buttons */}
                    <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 
                                  group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full shadow-md bg-white dark:bg-gray-800 
                                                 hover:bg-primary hover:text-white"
                                    >
                                        <Heart className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Add to Wishlist</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="rounded-full shadow-md bg-white dark:bg-gray-800
                                                 hover:bg-primary hover:text-white"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Quick View</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    
                    {/* Add to cart button (appears on hover) */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full 
                                  group-hover:translate-y-0 transition-transform">
                        <Button
                            variant="default"
                            className="w-full rounded-none py-6 flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Add to Cart</span>
                        </Button>
                    </div>
                </Link>
                
                {/* Product details */}
                <div className="p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {product.category}
                    </div>
                    <Link href={`/shop/${product.slug}`} className="block">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white
                                     mb-1 group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    <div className="flex items-center mb-3">
                        <div className="flex items-center text-amber-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                            ({product.reviews_count} reviews)
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {product.on_sale ? (
                                <>
                                    <span className="text-xl font-bold text-primary">
                                        ${product.sale_price}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                        ${product.price}
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl font-bold text-primary">
                                    ${product.price}
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {product.in_stock ? (
                                <span className="text-green-600 dark:text-green-400">In Stock</span>
                            ) : (
                                <span className="text-red-600 dark:text-red-400">Out of Stock</span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }
    
    // List view
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md 
                     hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
            <div className="flex flex-col sm:flex-row">
                {/* Product image */}
                <div className="relative w-full sm:w-48 h-48">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.on_sale && (
                            <UIBadge variant="destructive" className="flex items-center gap-1">
                                <Flame className="w-3 h-3" />
                                {product.discount_percentage}% OFF
                            </UIBadge>
                        )}
                        
                        {product.is_bestseller && !product.on_sale && (
                            <UIBadge variant="default" className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-white" />
                                Bestseller
                            </UIBadge>
                        )}
                        
                        {product.is_new && !product.is_bestseller && !product.on_sale && (
                            <UIBadge variant="secondary" className="flex items-center gap-1">
                                <Badge className="w-3 h-3" />
                                New
                            </UIBadge>
                        )}
                    </div>
                </div>
                
                {/* Product details */}
                <div className="flex-1 p-4 flex flex-col">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {product.category}
                    </div>
                    <Link href={`/shop/${product.slug}`} className="block">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white
                                     mb-1 group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {product.description}
                    </p>
                    
                    <div className="flex items-center mb-3">
                        <div className="flex items-center text-amber-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                            ({product.reviews_count} reviews)
                        </span>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {product.on_sale ? (
                                <>
                                    <span className="text-xl font-bold text-primary">
                                        ${product.sale_price}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                        ${product.price}
                                    </span>
                                </>
                            ) : (
                                <span className="text-xl font-bold text-primary">
                                    ${product.price}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Button
                                variant="default"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span className="hidden sm:inline">Add to Cart</span>
                            </Button>
                            
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                            >
                                <Heart className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const NoResults = () => (
    <div className="py-16 text-center">
        <Info className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Products Found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            We couldn't find any products matching your filters.
            Try adjusting your search or clearing filters.
        </p>
        <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Filters
        </Button>
    </div>
);

const LoadingState = () => (
    <div className="py-16 text-center">
        <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Loading Products
        </h3>
    </div>
);

const MobileFiltersSheet = ({ children }) => (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="md:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filters
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-4/5 sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            {children}
        </SheetContent>
    </Sheet>
);

const ProductGrid = ({ 
    products = [], 
    view, 
    setView, 
    searchQuery,
    setSearchQuery,
    activeFilters 
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [sortValue, setSortValue] = useState(activeFilters.sort || 'popular');
    
    // Handle sort change
    const handleSortChange = (value) => {
        setSortValue(value);
        // Here you would typically update your activeFilters and/or fetch new data
    };
    
    return (
        <div>
            {/* Search and Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 ml-auto">
                        {/* Mobile Filters Button */}
                        <MobileFiltersSheet>
                            {/* This would contain your filter component */}
                            <div className="p-4">
                                <p className="text-sm text-gray-500">Filter options would go here</p>
                            </div>
                        </MobileFiltersSheet>
                        
                        {/* Sort Dropdown */}
                        <div className="hidden md:block">
                            <Select value={sortValue} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <ArrowUpDown className="w-4 h-4" />
                                        <SelectValue placeholder="Sort by" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popular">Most Popular</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* View Toggle */}
                        <div className="border-l pl-3 hidden md:block">
                            <div className="flex items-center gap-1">
                                <Button
                                    variant={view === 'grid' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setView('grid')}
                                    className="h-9 w-9"
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={view === 'list' ? 'default' : 'ghost'}
                                    size="icon"
                                    onClick={() => setView('list')}
                                    className="h-9 w-9"
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Sort Button */}
                <div className="mt-4 md:hidden">
                    <Select value={sortValue} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-full">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="w-4 h-4" />
                                <SelectValue placeholder="Sort by" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="rating">Highest Rated</SelectItem>
                            <SelectItem value="price_low">Price: Low to High</SelectItem>
                            <SelectItem value="price_high">Price: High to Low</SelectItem>
                            <SelectItem value="newest">Newest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-medium text-gray-900 dark:text-white">{products.length}</span> products
                </div>
                
                {/* Mobile View Toggle */}
                <div className="md:hidden">
                    <div className="flex items-center gap-1">
                        <Button
                            variant={view === 'grid' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setView('grid')}
                            className="h-8 w-8"
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={view === 'list' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setView('list')}
                            className="h-8 w-8"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Product Grid */}
            {isLoading ? (
                <LoadingState />
            ) : products.length === 0 ? (
                <NoResults />
            ) : (
                <div className={cn(
                    view === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-6"
                )}>
                    <AnimatePresence>
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                view={view}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
            
            {/* Pagination - Would be implemented in a real app */}
            {products.length > 0 && (
                <div className="mt-12 flex justify-center">
                    <Button variant="outline" className="mr-2" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" disabled>
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ProductGrid; 