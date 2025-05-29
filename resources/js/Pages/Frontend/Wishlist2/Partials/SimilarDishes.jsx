import React from 'react';
import { motion } from 'framer-motion';
import {
    Utensils,
    Heart,
    ShoppingBag,
    ExternalLink,
    Star,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';

const SimilarDishes = ({ items = [] }) => {
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

    // Empty state component
    const EmptyState = () => (
        <div className="text-center py-10">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 p-4">
                <Utensils className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No similar dishes found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any dishes similar to those in your wishlist. Try adding more items to get better recommendations.
            </p>
        </div>
    );

    if (items.length === 0) {
        return null; // Don't show section at all if empty
    }

    return (
        <div>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Similar Dishes You Might Like</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Based on your wishlist items and browsing history
                    </p>
                </div>

                <Link href="/recommendations">
                    <Button variant="ghost" className="gap-1">
                        View All
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            {/* Grid of Dishes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item, index) => (
                    <SimilarDishCard
                        key={`similar-${item.id}-${index}`}
                        item={item}
                        onAddToWishlist={handleAddToWishlist}
                        onAddToCart={handleAddToCart}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

// Similar Dish Card Component
const SimilarDishCard = ({
    item,
    onAddToWishlist,
    onAddToCart,
    index
}) => {
    // Format price with discount
    const formattedPrice = formatCurrency(item.price);
    const formattedOriginalPrice = item.discount ? formatCurrency(item.original_price) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-300"
                />

                {/* Overlay with action buttons */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-9 px-3 bg-white/90 text-primary hover:bg-white backdrop-blur-sm"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onAddToWishlist(item.id);
                            }}
                        >
                            <Heart className="h-4 w-4 mr-2" />
                            Save
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-9 px-3 bg-primary text-white hover:bg-primary/90 shadow-md"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onAddToCart(item.id);
                            }}
                        >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Add to Cart
                        </Button>
                    </div>
                </div>

                {/* Discount Badge */}
                {item.discount > 0 && (
                    <div className="absolute right-3 top-3 rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
                        {item.discount}% OFF
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <Link href={`/menu/${item.slug}`}>
                    <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
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
                {item.category && (
                    <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                            {item.category}
                        </Badge>
                    </div>
                )}

                {/* Rating & Price */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{item.rating}</span>
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

            {/* Similarity Reason (If available) */}
            {item.reason && (
                <div className="px-4 pb-3 pt-0">
                    <div className="text-xs text-gray-500 italic">
                        {item.reason}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default SimilarDishes; 