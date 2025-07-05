import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import {
    Star,
    ShoppingBag,
    Heart,
    Flame,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { useToast } from "@/Components/ui/use-toast";

const SimilarDishes = ({ items = [] }) => {
    const { toast } = useToast();

    // If no items, don't render the component
    if (!items?.length) return null;

    // Handler for adding item to cart
    const handleAddToCart = (item) => {
        toast({
            title: "Added to Cart",
            description: `${item.name} has been added to your cart`,
        });
    };

    // Handler for toggling wishlist status
    const handleToggleWishlist = (item) => {
        toast({
            title: item.in_wishlist ? "Removed from Wishlist" : "Added to Wishlist",
            description: `${item.name} has been ${item.in_wishlist ? 'removed from' : 'added to'} your wishlist`,
        });
    };

    return (
        <section className="mt-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Similar Dishes
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        More items you might like
                    </p>
                </div>

                {/* View All Link */}
                <Link
                    href="/menu?category=recommended"
                    className="text-primary hover:text-primary/80 font-medium flex items-center transition-colors"
                >
                    <span>View All</span>
                    <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((item, index) => (
                    <SimilarDishCard
                        key={item.id}
                        item={item}
                        index={index}
                        onAddToCart={() => handleAddToCart(item)}
                        onToggleWishlist={() => handleToggleWishlist(item)}
                    />
                ))}
            </div>
        </section>
    );
};

const SimilarDishCard = ({ item, index, onAddToCart, onToggleWishlist }) => {
    // Calculate if item has a discount
    const hasDiscount = item.discount_percent > 0;
    const discountedPrice = hasDiscount
        ? item.price * (1 - item.discount_percent / 100)
        : item.price;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Discount Badge */}
                {hasDiscount && (
                    <div className="absolute top-2 left-2">
                        <Badge className="bg-red-500 text-white">
                            <Flame className="w-3 h-3 mr-1" />
                            {item.discount_percent}% OFF
                        </Badge>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-white text-gray-900"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleWishlist();
                                }}
                            >
                                <Heart
                                    className={`w-4 h-4 ${item.in_wishlist ? 'fill-red-500 text-red-500' : ''}`}
                                />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-primary text-white"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onAddToCart();
                                }}
                            >
                                <ShoppingBag className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center text-white">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="ml-1 text-sm font-medium">{item.rating}</span>
                            <span className="text-xs ml-1">
                                ({item.reviews_count})
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <Link href={`/menu/${item.slug}`}>
                    <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-1 line-clamp-1 hover:text-primary transition-colors">
                        {item.name}
                    </h3>
                </Link>

                {item.restaurant && (
                    <Link
                        href={`/restaurants/${item.restaurant.slug}`}
                        className="text-sm text-gray-500 dark:text-gray-400 mb-2 block hover:text-primary transition-colors"
                    >
                        {item.restaurant.name}
                    </Link>
                )}

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.description}
                </p>

                {/* Price and Labels */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold text-primary text-lg">
                            ${discountedPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">
                                ${item.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Categories or Tags */}
                    {item.categories?.length > 0 && (
                        <div className="flex items-center space-x-1">
                            {item.categories.slice(0, 2).map(category => (
                                <Badge
                                    key={category.id || category}
                                    variant="outline"
                                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-normal"
                                >
                                    {typeof category === 'string' ? category : category.name}
                                </Badge>
                            ))}
                            {item.categories.length > 2 && (
                                <Badge variant="outline" className="text-xs">+{item.categories.length - 2}</Badge>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SimilarDishes; 