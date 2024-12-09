import React from 'react';
import { Link } from '@inertiajs/react';
import { Heart, Star, ShoppingCart, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useDropdown } from '@/hooks/useDropdown';
import MobileSheet from '@/Components/ui/mobile-sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

const WishlistDropdown = () => {
    const { isOpen, handleToggle, handleClose } = useDropdown();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const wishlistItems = [
        {
            id: 1,
            name: 'Margherita Pizza',
            price: 14.99,
            rating: 4.5,
            image: '/images/dishes/pizza.jpg',
            restaurant: 'Pizza House',
            discount: '20% OFF',
            isAvailable: true
        },
        {
            id: 2,
            name: 'Chicken Biryani',
            price: 16.99,
            rating: 4.8,
            image: '/images/dishes/biryani.jpg',
            restaurant: 'Spice Garden',
            isAvailable: true
        },
        {
            id: 3,
            name: 'Sushi Platter',
            price: 24.99,
            rating: 4.7,
            image: '/images/dishes/sushi.jpg',
            restaurant: 'Sushi Master',
            isAvailable: false
        }
    ];

    const WishlistContent = () => (
        <div className="flex flex-col h-full">
            {/* Header - Only for Desktop */}
            {!isMobile && (
                <div className="px-4 py-3 border-b dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Wishlist</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {wishlistItems.length} items
                        </span>
                    </div>
                </div>
            )}

            {/* Items List */}
            <div className={cn(
                "flex-1 overflow-y-auto overscroll-contain",
                "min-h-0 w-full",
                isMobile ? "px-4" : "px-6"
            )}>
                <div className="py-4 space-y-4">
                    <AnimatePresence initial={false}>
                        {wishlistItems.length > 0 ? (
                            wishlistItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={cn(
                                        "flex items-start space-x-4 rounded-xl",
                                        "bg-white dark:bg-gray-800/50",
                                        "border border-gray-100 dark:border-gray-800",
                                        "p-3 md:p-4",
                                        "shadow-sm hover:shadow-md transition-shadow"
                                    )}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-24 w-24 flex-shrink-0">
                                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-200"
                                            />
                                            {item.discount && (
                                                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-bl-lg font-medium">
                                                    {item.discount}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-base font-medium text-gray-900 dark:text-white">
                                                    {item.name}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {item.restaurant}
                                                </p>
                                                <div className="flex items-center mt-1 space-x-2">
                                                    <div className="flex items-center text-yellow-400">
                                                        <Star className="w-4 h-4 fill-current" />
                                                        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {item.rating}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => {/* Remove from wishlist */}}
                                            >
                                                <Heart className="w-4 h-4 fill-current" />
                                            </Button>
                                        </div>

                                        <div className="mt-3">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="w-full rounded-full"
                                                disabled={!item.isAvailable}
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-8 text-center"
                            >
                                <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <Heart className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Your wishlist is empty
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[200px]">
                                    Start saving your favorite items
                                </p>
                                <Button
                                    variant="default"
                                    className="rounded-full"
                                    onClick={handleClose}
                                >
                                    Browse Menu
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Actions */}
            {wishlistItems.length > 0 && (
                <div className={cn(
                    "border-t dark:border-gray-800",
                    "bg-white dark:bg-gray-900",
                    "w-full",
                    isMobile ? "px-4 pb-4" : "p-4"
                )}>
                    <Link
                        href="/wishlist"
                        className={cn(
                            "flex items-center justify-center space-x-2 w-full",
                            "bg-primary/10 hover:bg-primary/20 text-primary",
                            "px-4 py-3 rounded-full transition-colors",
                            "font-medium text-sm"
                        )}
                    >
                        <span>View Full Wishlist</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );

    if (isMobile) {
        return (
            <>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 text-gray-700 rounded-full w-10 h-10 relative"
                    onClick={handleToggle}
                >
                    <Heart className="w-5 h-5" />
                    {wishlistItems.length > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-primary text-white text-xs 
                                     w-5 h-5 rounded-full flex items-center justify-center"
                        >
                            {wishlistItems.length}
                        </motion.span>
                    )}
                </Button>

                <AnimatePresence>
                    {isOpen && (
                        <MobileSheet
                            isOpen={isOpen}
                            onClose={handleClose}
                            title={`Wishlist (${wishlistItems.length})`}
                            fullHeight
                            className="flex flex-col max-w-lg mx-auto"
                        >
                            <WishlistContent />
                        </MobileSheet>
                    )}
                </AnimatePresence>
            </>
        );
    }

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

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-30" 
                            onClick={handleClose}
                        />
                        <div className="absolute right-0 mt-2 w-[380px] bg-white dark:bg-gray-900 
                                    rounded-lg shadow-lg border dark:border-gray-800 z-40">
                            <WishlistContent />
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WishlistDropdown; 