import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    X, 
    LayoutGrid, 
    List, 
    ChevronDown,
    Star,
    ShoppingBag,
    Heart,
    Eye,
    BadgePercent,
    AlertCircle,
    ArrowUpDown,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Skeleton } from '@/Components/ui/skeleton';

const ProductGrid = ({
    products = [],
    view,
    setView,
    searchQuery,
    setSearchQuery,
    activeFilters,
    setActiveFilters,
    isMobile = false
}) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Apply filters when they change
    useEffect(() => {
        const applyFilters = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Simulate API call with 500ms delay (in real app, this would be a server call)
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Apply filters
                let filtered = [...products];
                
                // Apply search query
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    filtered = filtered.filter(
                        p => p.name.toLowerCase().includes(query) || 
                             p.description?.toLowerCase().includes(query) || 
                             p.category?.toLowerCase().includes(query) || 
                             p.brand?.toLowerCase().includes(query)
                    );
                }
                
                // Apply category filter
                if (activeFilters.category) {
                    filtered = filtered.filter(p => p.category === activeFilters.category);
                }
                
                // Apply brand filter
                if (activeFilters.brand) {
                    filtered = filtered.filter(p => p.brand === activeFilters.brand);
                }
                
                // Apply price filter
                if (activeFilters.price) {
                    const [min, max] = activeFilters.price.split('-').map(Number);
                    filtered = filtered.filter(p => {
                        const priceToCheck = p.on_sale ? p.sale_price : p.price;
                        return priceToCheck >= min && priceToCheck <= max;
                    });
                }
                
                // Apply rating filter
                if (activeFilters.rating) {
                    filtered = filtered.filter(p => p.rating >= activeFilters.rating);
                }
                
                // Apply discount filter
                if (activeFilters.discount) {
                    filtered = filtered.filter(p => p.on_sale);
                }
                
                // Apply availability filter
                if (activeFilters.availability && activeFilters.availability !== 'all') {
                    if (activeFilters.availability === 'in-stock') {
                        filtered = filtered.filter(p => p.in_stock);
                    } else if (activeFilters.availability === 'out-of-stock') {
                        filtered = filtered.filter(p => !p.in_stock);
                    }
                }
                
                // Apply dietary filters
                if (activeFilters.dietary?.length) {
                    filtered = filtered.filter(p => 
                        p.dietary_tags?.some(tag => activeFilters.dietary.includes(tag))
                    );
                }
                
                // Apply shipping filters
                if (activeFilters.shipping?.length) {
                    filtered = filtered.filter(p => 
                        p.shipping_options?.some(option => activeFilters.shipping.includes(option))
                    );
                }
                
                // Apply featured filters
                if (activeFilters.featured?.length) {
                    filtered = filtered.filter(p => {
                        if (activeFilters.featured.includes('bestseller') && p.is_bestseller) return true;
                        if (activeFilters.featured.includes('new') && p.is_new) return true;
                        if (activeFilters.featured.includes('staff-pick') && p.is_staff_pick) return true;
                        return false;
                    });
                }
                
                // Apply sorting
                if (activeFilters.sort) {
                    switch (activeFilters.sort) {
                        case 'popular':
                            filtered.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
                            break;
                        case 'newest':
                            filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
                            break;
                        case 'price-low':
                            filtered.sort((a, b) => {
                                const aPrice = a.on_sale ? a.sale_price : a.price;
                                const bPrice = b.on_sale ? b.sale_price : b.price;
                                return aPrice - bPrice;
                            });
                            break;
                        case 'price-high':
                            filtered.sort((a, b) => {
                                const aPrice = a.on_sale ? a.sale_price : a.price;
                                const bPrice = b.on_sale ? b.sale_price : b.price;
                                return bPrice - aPrice;
                            });
                            break;
                        case 'rating':
                            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                            break;
                        default:
                            break;
                    }
                }
                
                setFilteredProducts(filtered);
            } catch (err) {
                setError('Error filtering products. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        
        applyFilters();
    }, [products, searchQuery, activeFilters]);
    
    const sortOptions = [
        { label: 'Most Popular', value: 'popular' },
        { label: 'Newest First', value: 'newest' },
        { label: 'Price: Low to High', value: 'price-low' },
        { label: 'Price: High to Low', value: 'price-high' },
        { label: 'Top Rated', value: 'rating' },
    ];
    
    const handleSortChange = (value) => {
        setActiveFilters({
            ...activeFilters,
            sort: value
        });
    };
    
    return (
        <div>
            {/* Desktop Toolbar */}
            {!isMobile && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-8"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => setSearchQuery('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    
                    {/* Result Count and Sort Controls */}
                    <div className="flex items-center justify-between md:justify-end w-full gap-4">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>{filteredProducts.length} Products</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline">Sort by:</span>
                                <Select 
                                    value={activeFilters.sort} 
                                    onValueChange={handleSortChange}
                                >
                                    <SelectTrigger className="w-[160px] h-9 text-sm">
                                        <SelectValue placeholder="Most Popular" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {/* View Toggle */}
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8 rounded-md", 
                                        view === 'grid' && "bg-white dark:bg-gray-600 shadow-sm"
                                    )}
                                    onClick={() => setView('grid')}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8 rounded-md", 
                                        view === 'list' && "bg-white dark:bg-gray-600 shadow-sm"
                                    )}
                                    onClick={() => setView('list')}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Error Message */}
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            {/* Products Grid */}
            <div className="relative min-h-[300px]">
                {isLoading ? (
                    <div className={cn(
                        "grid gap-4",
                        view === 'grid' 
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                            : "grid-cols-1"
                    )}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <ProductSkeleton key={i} view={view} />
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Products Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                            We couldn't find any products matching your current filters or search query.
                        </p>
                        <Button onClick={() => {
                            setActiveFilters({
                                category: '',
                                brand: '',
                                price: '',
                                dietary: [],
                                rating: null,
                                sort: 'popular',
                                discount: false,
                                availability: 'all',
                                shipping: [],
                                featured: []
                            });
                            setSearchQuery('');
                        }} className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Clear All Filters
                        </Button>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                view === 'grid' 
                                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" 
                                    : "flex flex-col gap-4"
                            )}
                        >
                            {filteredProducts.map((product, index) => (
                                view === 'grid' ? (
                                    <GridProductCard key={product.id} product={product} index={index} />
                                ) : (
                                    <ListProductCard key={product.id} product={product} index={index} />
                                )
                            ))}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

const GridProductCard = ({ product, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group"
        >
            <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                {/* Badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                    {product.is_new && (
                        <Badge variant="secondary" className="bg-blue-500 text-white px-2 py-1 text-xs">
                            New
                        </Badge>
                    )}
                    
                    {product.is_bestseller && (
                        <Badge variant="secondary" className="bg-amber-500 text-white px-2 py-1 text-xs">
                            Bestseller
                        </Badge>
                    )}
                    
                    {product.on_sale && (
                        <Badge variant="secondary" className="bg-red-500 text-white px-2 py-1 text-xs">
                            <BadgePercent className="w-3 h-3 mr-1" />
                            {product.discount_percentage}% Off
                        </Badge>
                    )}
                </div>
                
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-primary hover:text-white transition-colors"
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                    
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-primary hover:text-white transition-colors"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
                
                {/* Product Image */}
                <div className="relative overflow-hidden pt-[80%]">
                    <Link href={`/shop/${product.slug}`}>
                        <img
                            src={product.image || '/images/placeholder.png'}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                </div>
                
                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {product.category}
                        </span>
                        
                        <div className="flex items-center">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-xs font-medium">
                                {product.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>
                    
                    <Link href={`/shop/${product.slug}`} className="mb-2 hover:text-primary transition-colors">
                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">
                            {product.name}
                        </h3>
                    </Link>
                    
                    {/* Price */}
                    <div className="flex items-baseline mb-3">
                        {product.on_sale ? (
                            <>
                                <span className="text-lg font-bold text-primary mr-2">
                                    ${product.sale_price.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    ${product.price.toFixed(2)}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                    
                    {/* Add to Cart Button */}
                    <div className="mt-auto">
                        <Button 
                            className="w-full"
                            variant={product.in_stock ? "default" : "outline"}
                            disabled={!product.in_stock}
                        >
                            {product.in_stock ? (
                                <>
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </>
                            ) : (
                                "Out of Stock"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ListProductCard = ({ product, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group"
        >
            <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700 h-full">
                <div className="flex flex-col md:flex-row">
                    {/* Product Image */}
                    <div className="relative md:w-1/3 lg:w-1/4">
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                            {product.is_new && (
                                <Badge variant="secondary" className="bg-blue-500 text-white px-2 py-1 text-xs">
                                    New
                                </Badge>
                            )}
                            
                            {product.is_bestseller && (
                                <Badge variant="secondary" className="bg-amber-500 text-white px-2 py-1 text-xs">
                                    Bestseller
                                </Badge>
                            )}
                            
                            {product.on_sale && (
                                <Badge variant="secondary" className="bg-red-500 text-white px-2 py-1 text-xs">
                                    <BadgePercent className="w-3 h-3 mr-1" />
                                    {product.discount_percentage}% Off
                                </Badge>
                            )}
                        </div>
                        
                        <Link href={`/shop/${product.slug}`} className="block h-full">
                            <div className="relative h-60 md:h-full overflow-hidden">
                                <img
                                    src={product.image || '/images/placeholder.png'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </Link>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {product.category}
                            </span>
                            
                            <div className="flex items-center">
                                <div className="flex items-center mr-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "w-4 h-4",
                                                i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ({product.reviews_count})
                                </span>
                            </div>
                        </div>
                        
                        <Link href={`/shop/${product.slug}`} className="mb-2 hover:text-primary transition-colors">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white leading-tight">
                                {product.name}
                            </h3>
                        </Link>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                            {product.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {product.tags?.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        
                        <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Price */}
                            <div className="flex items-baseline">
                                {product.on_sale ? (
                                    <>
                                        <span className="text-xl font-bold text-primary mr-2">
                                            ${product.sale_price.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        ${product.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-10 w-10 rounded-full"
                                >
                                    <Heart className="h-5 w-5" />
                                </Button>
                                
                                <Button 
                                    className="flex-1"
                                    variant={product.in_stock ? "default" : "outline"}
                                    disabled={!product.in_stock}
                                >
                                    {product.in_stock ? (
                                        <>
                                            <ShoppingBag className="h-4 w-4 mr-2" />
                                            Add to Cart
                                        </>
                                    ) : (
                                        "Out of Stock"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ProductSkeleton = ({ view }) => {
    if (view === 'grid') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="pt-[80%] relative">
                    <Skeleton className="absolute inset-0" />
                </div>
                <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-4 w-2/4" />
                    <Skeleton className="h-10 w-full rounded-md mt-2" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 lg:w-1/4">
                    <div className="h-60 md:h-full">
                        <Skeleton className="h-full w-full" />
                    </div>
                </div>
                <div className="p-5 flex-1 space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-10 w-1/3 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductGrid; 