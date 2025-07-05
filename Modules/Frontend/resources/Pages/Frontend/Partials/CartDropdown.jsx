import React from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingCart, Minus, Plus, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useDropdown } from '@/hooks/useDropdown';
import MobileSheet from '@/Components/ui/mobile-sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import { useScrollLock } from '@/hooks/useScrollLock';

const CartDropdown = () => {
    const { isOpen, handleToggle, handleClose } = useDropdown();
    const isMobile = useMediaQuery('(max-width: 768px)');
    useScrollLock(isOpen && isMobile);

    const cartItems = [
        {
            id: 1,
            name: 'Chicken Burger',
            price: 12.99,
            quantity: 2,
            image: '/images/dishes/burger.jpg',
            restaurant: 'Burger House'
        },
        // Add more items as needed
    ];

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const OrderSummary = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(5.99)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Tax</span>
                    <span>{formatPrice(cartTotal * 0.1)}</span>
                </div>
                <div className="pt-2 border-t dark:border-gray-800">
                    <div className="flex justify-between font-medium text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span className="text-primary">
                            {formatPrice(cartTotal + 5.99 + (cartTotal * 0.1))}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Link
                    href="/cart"
                    className={cn(
                        "inline-flex items-center justify-center rounded-full",
                        "border border-gray-200 dark:border-gray-700",
                        "px-4 py-3.5 text-sm font-medium",
                        "text-gray-700 dark:text-gray-200",
                        "hover:bg-gray-50 dark:hover:bg-gray-800",
                        "focus:outline-none focus:ring-2 focus:ring-primary/50",
                        "transition-colors duration-200"
                    )}
                >
                    View Cart
                </Link>
                <Link
                    href="/checkout"
                    className={cn(
                        "inline-flex items-center justify-center rounded-full",
                        "bg-primary hover:bg-primary/90",
                        "px-4 py-3.5 text-sm font-medium text-white",
                        "focus:outline-none focus:ring-2 focus:ring-primary/50",
                        "transition-colors duration-200"
                    )}
                >
                    <span>Checkout</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </div>
    );

    const CartContent = () => (
        <div className="flex flex-col h-full">
            {/* Cart Header - Only for Desktop */}
            {!isMobile && (
                <div className="px-4 py-3 border-b dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            Shopping Cart
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {cartItems.length} items
                        </span>
                    </div>
                </div>
            )}

            {/* Cart Items */}
            <div className={cn(
                "flex-1 overflow-y-auto overscroll-contain",
                "min-h-0 w-full",
                isMobile ? "px-4" : "px-6"
            )}>
                <div className="py-4 space-y-4">
                    <AnimatePresence initial={false}>
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
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
                                    <div className="relative h-20 w-20 flex-shrink-0">
                                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-200"
                                            />
                                            {item.discount && (
                                                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-bl-lg font-medium">
                                                    {item.discount}% OFF
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                                                    {item.name}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {item.restaurant}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center space-x-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className={cn(
                                                        "h-7 w-7 rounded-full",
                                                        "border-gray-200 dark:border-gray-700",
                                                        "hover:bg-primary/5 hover:border-primary"
                                                    )}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className={cn(
                                                        "h-7 w-7 rounded-full",
                                                        "border-gray-200 dark:border-gray-700",
                                                        "hover:bg-primary/5 hover:border-primary"
                                                    )}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
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
                                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Your cart is empty
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[200px]">
                                    Looks like you haven't added any items to your cart yet
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

            {/* Cart Footer */}
            {cartItems.length > 0 && (
                <div className={cn(
                    "border-t dark:border-gray-800",
                    "bg-white dark:bg-gray-900",
                    "w-full",
                    isMobile ? "px-4 pb-4" : "p-4"
                )}>
                    <OrderSummary />
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
                    <ShoppingCart className="w-5 h-5" />
                    {cartItems.length > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-primary text-white text-xs 
                                     w-5 h-5 rounded-full flex items-center justify-center"
                        >
                            {cartItems.length}
                        </motion.span>
                    )}
                </Button>

                <AnimatePresence>
                    {isOpen && (
                        <MobileSheet
                            isOpen={isOpen}
                            onClose={handleClose}
                            title={`Shopping Cart (${cartItems.length})`}
                            fullHeight
                            className="flex flex-col max-w-lg mx-auto"
                        >
                            <CartContent />
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
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs 
                                 w-5 h-5 rounded-full flex items-center justify-center">
                        {cartItems.length}
                    </span>
                )}
            </Button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-30" 
                        onClick={handleClose}
                    />
                    <div className="absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 
                                rounded-lg shadow-lg border dark:border-gray-800 z-40 mx-4 sm:mx-0">
                        <CartContent />
                    </div>
                </>
            )}
        </div>
    );
};

export default CartDropdown; 