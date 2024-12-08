import React from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingCart, Minus, Plus, Trash2, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useDropdown } from '@/hooks/useDropdown';

const CartDropdown = () => {
    const { isOpen, handleToggle, handleClose } = useDropdown();
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
                    <div className="absolute right-0 mt-2 w-[380px] bg-white rounded-lg shadow-lg border z-40">
                        <div className="px-4 py-3 border-b">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg text-gray-900">Shopping Cart</h3>
                                <span className="text-sm text-gray-500">{cartItems.length} items</span>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            <AnimatePresence initial={false}>
                                {cartItems.length > 0 ? (
                                    <div className="p-4 space-y-4">
                                        {cartItems.map((item) => (
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
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-medium text-gray-900 truncate">
                                                        {item.name}
                                                    </h4>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {item.restaurant}
                                                    </p>
                                                    <div className="mt-2 flex items-center space-x-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-7 w-7 rounded-full"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </Button>
                                                            <span className="text-sm font-medium w-4 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-7 w-7 rounded-full"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {formatPrice(item.price * item.quantity)}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                            <ShoppingCart className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h3 className="mt-4 text-sm font-medium text-gray-900">
                                            Your cart is empty
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Start adding items to your cart
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {cartItems.length > 0 && (
                            <div className="border-t p-4 space-y-4">
                                <div className="flex items-center justify-between text-base font-medium text-gray-900">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/cart"
                                        className="inline-flex items-center justify-center rounded-full border border-gray-200 
                                                         px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 
                                                         focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        View Cart
                                    </Link>
                                    <Link
                                        href="/checkout"
                                        className="inline-flex items-center justify-center rounded-full bg-primary 
                                                         px-4 py-2.5 text-sm font-medium text-white hover:bg-primary/90 
                                                         focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    >
                                        <span>Checkout</span>
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CartDropdown; 