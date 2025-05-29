import React from 'react';
import { motion } from 'framer-motion';
import {
    History,
    Heart,
    ShoppingBag,
    Clock,
    ChevronRight,
    ChevronLeft,
    X,
    Star,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

const RecentlyViewed = ({ items = [] }) => {
    const { toast } = useToast();

    // Handle adding item to wishlist
    const handleAddToWishlist = (itemId) => {
        router.post('/wishlist2/add', {
            dish_id: itemId
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
            }
        });
    };

    // Handle adding item to cart
    const handleAddToCart = (itemId) => {
        router.post('/cart/add', {
            dish_id: itemId,
            quantity: 1
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Added to cart",
                    description: "Item has been added to your cart",
                    action: (
                        <Link href="/cart" className="inline-flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-primary shadow-sm hover:bg-gray-50">
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
            }
        });
    };

    // Handle removing from history
    const handleRemoveFromHistory = (itemId) => {
        router.delete('/history/remove', {
            data: { item_id: itemId },
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Removed from history",
                    description: "Item has been removed from your viewing history",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Could not remove item. Please try again.",
                    variant: "destructive",
                });
            }
        });
    };

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
                <History className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No viewing history</h3>
            <p className="text-gray-500 max-w-md mb-6">
                Items you view will appear here for easy access. Start exploring to build your history.
            </p>
            <Link href="/restaurants">
                <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Explore Restaurants
                </Button>
            </Link>
        </div>
    );

    if (items.length === 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <History className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-2xl font-bold">Recently Viewed</h2>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Items you've viewed recently across our platform
                    </p>
                </div>

                <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => {
                        router.delete('/history/clear', {
                            preserveScroll: true,
                            onSuccess: () => {
                                toast({
                                    title: "History cleared",
                                    description: "Your viewing history has been cleared",
                                });
                            }
                        });
                    }}
                >
                    <X className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Clear History</span>
                </Button>
            </div>

            {/* Scrollable Content */}
            <div className="relative">
                <ScrollArea className="pb-4">
                    <div className="flex space-x-4">
                        {items.map((item, index) => (
                            <HistoryItem
                                key={`history-${item.id}-${index}`}
                                item={item}
                                onAddToWishlist={handleAddToWishlist}
                                onAddToCart={handleAddToCart}
                                onRemove={handleRemoveFromHistory}
                                index={index}
                            />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
};

// History Item Component
const HistoryItem = ({
    item,
    onAddToWishlist,
    onAddToCart,
    onRemove,
    index
}) => {
    // Format price with discount
    const formattedPrice = formatCurrency(item.price);
    const formattedOriginalPrice = item.discount ? formatCurrency(item.original_price) : null;

    // Format the view time (e.g., "2 hours ago")
    const viewedTime = item.viewed_at ? formatRelativeTime(item.viewed_at) : "Recently";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group w-[280px] shrink-0 rounded-lg border bg-card overflow-hidden shadow-sm"
        >
            {/* Item Image */}
            <div className="relative h-40 overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                />

                {/* View Time Badge */}
                <div className="absolute left-3 top-3 rounded-full bg-black/60 backdrop-blur-sm px-2 py-1 text-xs text-white flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {viewedTime}
                </div>

                {/* Action Buttons */}
                <div className="absolute right-3 top-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 shadow-sm backdrop-blur-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToWishlist(item.id);
                        }}
                    >
                        <Heart className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 shadow-sm backdrop-blur-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(item.id);
                        }}
                    >
                        <ShoppingBag className="h-4 w-4 text-primary" />
                    </Button>
                </div>

                {/* Remove Button */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 px-2 rounded-md text-xs bg-white/10 hover:bg-red-600 text-white backdrop-blur-sm border border-white/20"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemove(item.id);
                        }}
                    >
                        <X className="h-3 w-3 mr-1" />
                        Remove
                    </Button>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Item Content */}
            <div className="p-4">
                <Link href={`/menu/${item.slug}`}>
                    <h3 className="font-medium text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                    </h3>
                </Link>

                {item.restaurant && (
                    <div className="mt-1 text-sm text-gray-500">
                        <Link
                            href={`/restaurants/${item.restaurant.slug}`}
                            className="hover:text-primary transition-colors"
                        >
                            {item.restaurant.name}
                        </Link>
                    </div>
                )}

                {/* Tags Row */}
                {(item.category || item.discount > 0) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {item.category && (
                            <Badge variant="outline" className="text-xs">
                                {item.category}
                            </Badge>
                        )}

                        {item.discount > 0 && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600 text-xs">
                                {item.discount}% OFF
                            </Badge>
                        )}
                    </div>
                )}

                {/* Price & Rating */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 font-medium">{item.rating}</span>
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

// Helper function to format relative time (e.g., "2 hours ago")
const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }

    // Use formatDate for older dates
    return formatDate(dateString);
};

export default RecentlyViewed; 