import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
    // Ensure item has valid structure
    if (!item || !item.id) return null;

    return (
        <div className="flex items-start py-4 border-b border-gray-200 dark:border-gray-700">
            {/* Item Image */}
            {item.image && (
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-4">
                    <img
                        src={item.image}
                        alt={item.name || 'Food item'}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Item Details */}
            <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                    {item.name || 'Food item'}
                </h4>

                {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                        {item.description}
                    </p>
                )}

                {/* Customizations, if any */}
                {item.options && item.options.length > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                        {item.options.map((option, index) => (
                            <span key={index}>
                                {option.name}: {option.value}
                                {index < item.options.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </div>
                )}

                {/* Price and Quantity Controls */}
                <div className="flex items-center justify-between mt-2">
                    <div className="font-medium text-gray-900 dark:text-white">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="p-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 
                                     hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="w-3 h-3" />
                        </button>

                        <span className="mx-2 text-gray-900 dark:text-white w-6 text-center">
                            {item.quantity || 1}
                        </span>

                        <button
                            onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="p-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 
                                     hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Increase quantity"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Remove Button */}
            <button
                onClick={() => onRemoveItem(item.id)}
                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Remove item"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

const Cart = ({
    show = false,
    items = [],
    total = 0,
    restaurant = null,
    onClose,
    onUpdateQuantity,
    onRemoveItem
}) => {
    // Early return if cart shouldn't be shown
    if (!show) return null;

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />

                    {/* Cart Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 
                                 shadow-xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex items-center">
                                <ShoppingBag className="w-5 h-5 mr-2 text-primary" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Your Order
                                </h3>
                                {items.length > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-sm rounded-full">
                                        {items.length} {items.length === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                                         dark:hover:text-gray-200 transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Restaurant Info (if available) */}
                        {restaurant && (
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b 
                                          border-gray-200 dark:border-gray-700">
                                <div className="flex items-center">
                                    {restaurant.logoUrl && (
                                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-white">
                                            <img
                                                src={restaurant.logoUrl}
                                                alt={restaurant.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">
                                            {restaurant.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Order from {restaurant.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                        Your cart is empty
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-xs">
                                        Add items from the menu to start your order.
                                    </p>
                                    <Button
                                        className="mt-6"
                                        onClick={onClose}
                                    >
                                        Browse Menu
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {items.map((item) => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            onUpdateQuantity={onUpdateQuantity}
                                            onRemoveItem={onRemoveItem}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer with Totals and Checkout */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-4">
                                {/* Order Summary */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>${total}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Delivery Fee</span>
                                        <span>$3.99</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Tax</span>
                                        <span>${(parseFloat(total) * 0.1).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-gray-900 dark:text-white text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span>Total</span>
                                        <span>
                                            ${(parseFloat(total) + 3.99 + parseFloat(total) * 0.1).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Button className="w-full flex items-center justify-center gap-2">
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4" />
                                </Button>

                                {/* Additional Options */}
                                <div className="text-center">
                                    <button
                                        onClick={onClose}
                                        className="text-primary hover:text-primary/80 text-sm font-medium"
                                    >
                                        Add More Items
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Cart; 