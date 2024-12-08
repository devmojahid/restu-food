import React from 'react';
import { Link } from '@inertiajs/react';
import { Heart, Star, ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useDropdown } from '@/hooks/useDropdown';

const WishlistDropdown = () => {
    const { isOpen, handleToggle, handleClose } = useDropdown();
    const wishlistItems = [
        {
            id: 1,
            name: 'Margherita Pizza',
            price: 14.99,
            rating: 4.5,
            image: '/images/dishes/pizza.jpg',
            restaurant: 'Pizza House'
        },
        // Add more items as needed
    ];

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 text-gray-700 rounded-full w-10 h-10 relative"
                onClick={handleToggle}
            >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs 
                                 w-5 h-5 rounded-full flex items-center justify-center">
                        {wishlistItems.length}
                    </span>
                )}
            </Button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-30" 
                        onClick={handleClose}
                    />
                    <div className="absolute right-0 mt-2 w-[380px] bg-white rounded-lg shadow-lg border z-40">
                        <div className="px-4 py-3 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg text-gray-900">Wishlist</h3>
                                <span className="text-sm text-gray-500">{wishlistItems.length} items</span>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            <AnimatePresence initial={false}>
                                {wishlistItems.length > 0 ? (
                                    <div className="p-4 space-y-4">
                                        {wishlistItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="flex items-start space-x-4"
                                            >
                                                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute top-0 right-0 bg-white/90 px-1.5 py-1 rounded-bl-lg">
                                                        <div className="flex items-center space-x-1">
                                                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                                            <span className="text-xs font-medium">{item.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-medium text-gray-900 truncate">
                                                        {item.name}
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {item.restaurant}
                                                    </p>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            className="h-8 rounded-full"
                                                        >
                                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                                            Add to Cart
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                            <Heart className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h3 className="mt-4 text-sm font-medium text-gray-900">
                                            Your wishlist is empty
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Save items you'd like to order later
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {wishlistItems.length > 0 && (
                            <div className="border-t p-4">
                                <Link
                                    href="/wishlist"
                                    className="inline-flex w-full items-center justify-center rounded-full 
                                             bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-900 
                                             hover:bg-gray-200 focus:outline-none focus:ring-2 
                                             focus:ring-primary/50"
                                >
                                    <span>View Wishlist</span>
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default WishlistDropdown; 