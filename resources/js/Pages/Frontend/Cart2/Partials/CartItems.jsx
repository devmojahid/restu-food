import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Minus,
    Trash2,
    Clock,
    Info,
    Heart,
    ShoppingCart,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { cn } from '@/lib/utils';

const CartItems = ({
    items = [],
    onUpdateQuantity,
    onRemoveItem,
    onSaveForLater
}) => {
    // Empty state if no items
    if (!items || items.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md" id="cart-items">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Cart</h2>
                    <Badge variant="outline">0 items</Badge>
                </div>

                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Your cart is empty
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <Link
                        href="/menu"
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full text-sm font-medium"
                    >
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
            id="cart-items"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                <Badge variant="outline">{items.length} item{items.length !== 1 ? 's' : ''}</Badge>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <CartItemCard
                        key={item.id}
                        item={item}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveItem={onRemoveItem}
                        onSaveForLater={onSaveForLater}
                    />
                ))}
            </div>
        </motion.div>
    );
};

const CartItemCard = ({ item, onUpdateQuantity, onRemoveItem, onSaveForLater }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Calculate item total price
    const calculateItemTotal = () => {
        let total = item.price * item.quantity;

        // Add addons cost
        if (item.addons && Array.isArray(item.addons)) {
            item.addons.forEach(addon => {
                total += addon.price * addon.quantity;
            });
        }

        // Apply discount if any
        if (item.discount && item.discount > 0) {
            total = total - (total * item.discount / 100);
        }

        return total.toFixed(2);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
                "border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden",
                "hover:border-primary/30 dark:hover:border-primary/30",
                "transition-all duration-300"
            )}
        >
            <div className="flex flex-col sm:flex-row gap-4 p-4">
                {/* Item Image */}
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />

                    {item.discount > 0 && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                            {item.discount}% OFF
                        </div>
                    )}
                </div>

                {/* Item Details */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                            <Link
                                href={`/menu/${item.slug}`}
                                className="text-lg font-semibold hover:text-primary transition-colors"
                            >
                                {item.name}
                            </Link>

                            <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                                <Link
                                    href={`/restaurants/${item.restaurant.slug}`}
                                    className="hover:text-primary transition-colors"
                                >
                                    {item.restaurant.name}
                                </Link>

                                {item.preparation_time && (
                                    <>
                                        <span className="mx-2">•</span>
                                        <Clock className="w-3.5 h-3.5 mr-1" />
                                        <span>{item.preparation_time}</span>
                                    </>
                                )}
                            </div>

                            {/* Variations */}
                            {item.variations && Object.keys(item.variations).length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {Object.entries(item.variations).map(([key, value]) => (
                                        <Badge
                                            key={`${key}-${value}`}
                                            variant="secondary"
                                            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                        >
                                            {key}: {value}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-2 sm:text-right">
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg">
                                    ${calculateItemTotal()}
                                </span>

                                {item.discount > 0 && (
                                    <span className="text-sm text-gray-500 line-through">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                )}

                                <span className="text-xs text-gray-500">
                                    ${item.price.toFixed(2)} each
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Controls and Actions */}
                    <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>

                            <span className="w-8 text-center font-medium">
                                {item.quantity}
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-primary"
                                            onClick={() => onSaveForLater(item.id)}
                                        >
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Save for later</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-red-500"
                                            onClick={() => onRemoveItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Remove from cart</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>

            {/* Addons and Special Instructions */}
            {((item.addons && item.addons.length > 0) || item.instructions) && (
                <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="border-t border-gray-100 dark:border-gray-700"
                >
                    <CollapsibleTrigger asChild>
                        <button className="flex w-full items-center justify-between px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <span className="flex items-center">
                                <Info className="w-4 h-4 mr-2" />
                                {isOpen ? 'Hide details' : 'Show details'}
                            </span>
                            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                        <div className="px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-800/50">
                            {/* Addons */}
                            {item.addons && item.addons.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Add-ons:</h4>
                                    <ul className="space-y-1">
                                        {item.addons.map((addon, index) => (
                                            <li key={index} className="text-sm flex justify-between">
                                                <span>
                                                    {addon.name} × {addon.quantity}
                                                </span>
                                                <span className="font-medium">
                                                    ${(addon.price * addon.quantity).toFixed(2)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Special Instructions */}
                            {item.instructions && (
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Special instructions:</h4>
                                    <p className="text-sm italic bg-white dark:bg-gray-700 p-2 rounded-md">
                                        "{item.instructions}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </motion.div>
    );
};

export default CartItems; 