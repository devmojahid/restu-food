import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Minus, Plus, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Separator } from '@/Components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose
} from '@/Components/ui/sheet';

const Cart = ({ show, onClose, items = [], onRemove, onUpdateQuantity, restaurant }) => {
    const isEmpty = items.length === 0;

    const calculateSubtotal = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const deliveryFee = 4.99;
    const taxRate = 0.0825; // 8.25%

    const calculateTax = () => {
        const subtotal = parseFloat(calculateSubtotal());
        return (subtotal * taxRate).toFixed(2);
    };

    const calculateTotal = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const tax = parseFloat(calculateTax());
        return (subtotal + tax + deliveryFee).toFixed(2);
    };

    return (
        <Sheet open={show} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md p-0">
                <div className="flex flex-col h-full">
                    <SheetHeader className="px-6 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="flex items-center">
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Your Order
                            </SheetTitle>
                            <SheetClose className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <X className="w-4 h-4" />
                            </SheetClose>
                        </div>
                        {restaurant?.name && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                From {restaurant.name}
                            </p>
                        )}
                    </SheetHeader>

                    <div className="flex-1 flex flex-col">
                        {isEmpty ? (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Add items from the menu to start your order
                                </p>
                                <Button onClick={onClose}>
                                    Browse Menu
                                </Button>
                            </div>
                        ) : (
                            <>
                                <ScrollArea className="flex-1">
                                    <div className="px-6 py-4">
                                        <ul className="space-y-4">
                                            {items.map((item) => (
                                                <li key={item.id} className="flex gap-4">
                                                    {/* Item Image */}
                                                    {item.image && (
                                                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Item Details */}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between">
                                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                                {item.name}
                                                            </h4>
                                                            <span className="font-medium">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>

                                                        {/* Item Customizations would go here */}

                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center justify-between mt-2">
                                                            <div className="flex items-center border rounded-md">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-none"
                                                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="w-8 text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-none"
                                                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>

                                                            {/* Remove Button */}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-2 text-gray-500 hover:text-red-500"
                                                                onClick={() => onRemove(item.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </ScrollArea>

                                {/* Order Summary */}
                                <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                            <span className="font-medium">${calculateSubtotal()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                                            <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                            <span className="font-medium">${calculateTax()}</span>
                                        </div>
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-medium">
                                            <span>Total</span>
                                            <span>${calculateTotal()}</span>
                                        </div>
                                    </div>

                                    <Button className="w-full mt-4" size="lg">
                                        Checkout
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Cart; 