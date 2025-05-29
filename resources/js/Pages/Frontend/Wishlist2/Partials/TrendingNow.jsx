import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Heart,
    Filter,
    ShoppingBag,
    Star,
    ChevronRight,
    ChevronLeft,
    Utensils,
    MapPin,
    Clock,
    BadgePercent,
    Flame,
    Eye,
    BarChart3
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

const TrendingNow = ({ items = [] }) => {
    const { toast } = useToast();
    const [activeFilter, setActiveFilter] = useState('all');
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Filter options
    const filterOptions = [
        { value: 'all', label: 'All' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'new', label: 'New Arrivals' },
        { value: 'rated', label: 'Top Rated' },
        { value: 'deals', label: 'Best Deals' },
    ];

    // Filter items based on active filter
    const filteredItems = items.filter(item => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'popular') return item.is_popular;
        if (activeFilter === 'new') return item.is_new;
        if (activeFilter === 'rated') return item.rating >= 4.5;
        if (activeFilter === 'deals') return item.discount > 0;
        return true;
    });

    // Handle adding item to wishlist
    const handleAddToWishlist = (itemId) => {
        setIsAddingToWishlist(true);

        router.post('/wishlist2/add', {
            dish_id: itemId,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Added to wishlist",
                    description: "Item has been added to your wishlist",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Could not add item to wishlist. Please try again.",
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setIsAddingToWishlist(false);
            }
        });
    };

    // Handle adding item to cart
    const handleAddToCart = (itemId) => {
        setIsAddingToCart(true);

        router.post('/cart/add', {
            dish_id: itemId,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Added to cart",
                    description: "Item has been added to your cart",
                    action: (
                        <Link href="/cart" className="inline-flex items-center justify-center font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md px-3 text-xs">
                            View Cart
                        </Link>
                    ),
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Could not add item to cart. Please try again.",
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setIsAddingToCart(false);
            }
        });
    };

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
                <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trending items</h3>
            <p className="text-gray-500 max-w-md mb-6">
                There are no trending items available right now. Check back later or try a different filter.
            </p>
            <Button
                variant="outline"
                onClick={() => setActiveFilter('all')}
            >
                Reset Filters
            </Button>
        </div>
    );

    if (items.length === 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Trending Now</h2>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Popular dishes that are trending across our platform right now
                    </p>
                </div>

                {/* Filter Tabs */}
                <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full md:w-auto">
                    <TabsList className="w-full md:w-auto h-9 overflow-x-auto justify-start md:justify-center flex-nowrap">
                        {filterOptions.map(option => (
                            <TabsTrigger
                                key={option.value}
                                value={option.value}
                                className="px-3 py-1.5 text-xs whitespace-nowrap"
                            >
                                {option.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {/* Items Grid */}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item, index) => (
                        <TrendingItemCard
                            key={item.id}
                            item={item}
                            index={index}
                            onAddToWishlist={handleAddToWishlist}
                            onAddToCart={handleAddToCart}
                            isAddingToWishlist={isAddingToWishlist}
                            isAddingToCart={isAddingToCart}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}

            {/* View All Link */}
            {filteredItems.length > 0 && (
                <div className="mt-8 text-center">
                    <Link href="/trending">
                        <Button variant="outline" className="rounded-full">
                            View All Trending Items
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

// Trending Item Card Component
const TrendingItemCard = ({
    item,
    index,
    onAddToWishlist,
    onAddToCart,
    isAddingToWishlist,
    isAddingToCart
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Format price with discount
    const formattedPrice = formatCurrency(item.price);
    const formattedOriginalPrice = item.discount ? formatCurrency(item.original_price) : null;

    // Calculate ranking number (1-based index)
    const rankingNumber = index + 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Ranking Badge */}
            <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-white shadow-md">
                {rankingNumber}
            </div>

            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay with stats */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Action Buttons */}
                <div className="absolute right-3 top-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToWishlist(item.id);
                        }}
                        disabled={isAddingToWishlist}
                    >
                        <Heart className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(item.id);
                        }}
                        disabled={isAddingToCart}
                    >
                        <ShoppingBag className="h-4 w-4 text-primary" />
                    </Button>
                </div>

                {/* Trending stats at bottom of image */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-white/90 text-primary gap-1 backdrop-blur-sm shadow-sm">
                            <Eye className="h-3 w-3" />
                            <span>{formatNumber(item.views || 0)}</span>
                        </Badge>

                        <Badge variant="secondary" className="bg-white/90 text-amber-500 gap-1 backdrop-blur-sm shadow-sm">
                            <Flame className="h-3 w-3 fill-amber-500" />
                            <span>{formatNumber(item.orders || 0)} orders</span>
                        </Badge>
                    </div>

                    <Badge variant="secondary" className="bg-white/90 text-blue-500 gap-1 backdrop-blur-sm shadow-sm">
                        <BarChart3 className="h-3 w-3" />
                        <span>{item.trend_percentage || 0}% ↑</span>
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <Link href={`/menu/${item.slug}`}>
                    <h3 className="line-clamp-1 font-semibold group-hover:text-primary transition-colors">
                        {item.name}
                    </h3>
                </Link>

                {item.restaurant && (
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                        <MapPin className="mr-1 h-3 w-3" />
                        <Link
                            href={`/restaurants/${item.restaurant.slug}`}
                            className="line-clamp-1 hover:text-primary transition-colors"
                        >
                            {item.restaurant.name}
                        </Link>
                    </div>
                )}

                {/* Tags Row */}
                <div className="mt-2 flex flex-wrap gap-2">
                    {item.is_new && (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 text-xs">
                            New
                        </Badge>
                    )}

                    {item.is_popular && (
                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 text-xs">
                            Popular
                        </Badge>
                    )}

                    {item.discount > 0 && (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-xs">
                            {item.discount}% OFF
                        </Badge>
                    )}

                    {item.category && (
                        <Badge variant="outline" className="text-xs">
                            {item.category}
                        </Badge>
                    )}
                </div>

                {/* Rating & Price */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-medium">{item.rating}</span>
                        <span className="ml-1 text-xs text-gray-500">
                            ({formatNumber(item.rating_count || 0)})
                        </span>
                    </div>

                    <div className="text-right">
                        <div className="font-semibold">{formattedPrice}</div>
                        {formattedOriginalPrice && (
                            <div className="text-xs text-gray-500 line-through">
                                {formattedOriginalPrice}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Helper function to format numbers
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num;
};

export default TrendingNow; 