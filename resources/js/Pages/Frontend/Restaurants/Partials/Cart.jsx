import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, 
    Plus, 
    Minus, 
    Trash2, 
    ChevronRight,
    Clock,
    Info,
    X,
    CreditCard
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/Components/ui/sheet';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/Components/ui/use-toast';

const Cart = ({ restaurant, show, onClose }) => {
    const { 
        items, 
        updateQuantity, 
        removeItem, 
        cartTotal, 
        cartSubtotal,
        deliveryFee,
        tax,
        appliedOffer,
        applyOffer,
        removeOffer
    } = useCart();
    const [promoCode, setPromoCode] = useState('');
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const { toast } = useToast();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Minimum order check
    const isMinimumMet = cartSubtotal >= restaurant.delivery_info.minimum_order;

    const handleQuantityChange = async (item, newQuantity) => {
        if (newQuantity < 1) {
            await removeItem(item);
            return;
        }
        await updateQuantity(item, newQuantity);
    };

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        setIsApplyingPromo(true);
        try {
            await applyOffer(promoCode);
            toast({
                title: "Promo code applied!",
                description: "Your discount has been added to the order.",
            });
            setPromoCode('');
        } catch (error) {
            toast({
                title: "Invalid promo code",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsApplyingPromo(false);
        }
    };

    const handleCheckout = async () => {
        if (!isMinimumMet) {
            toast({
                title: "Minimum order not met",
                description: `Minimum order amount is $${restaurant.delivery_info.minimum_order}`,
                variant: "destructive",
            });
            return;
        }

        setIsCheckingOut(true);
        try {
            // Checkout logic here
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
            // Redirect to checkout page
        } catch (error) {
            toast({
                title: "Checkout failed",
                description: "Please try again later",
                variant: "destructive",
            });
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <Sheet open={show} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Your Order
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-[calc(100vh-8rem)]">
                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto py-6">
                        {items.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Your cart is empty
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Add items from the menu to start your order
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className={cn(
                                            "flex gap-4 p-4 rounded-xl",
                                            "bg-white dark:bg-gray-800",
                                            "border border-gray-100 dark:border-gray-700"
                                        )}
                                    >
                                        {/* Item Image */}
                                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        ${item.price}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </Button>
                                                <span className="w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart Summary */}
                    {items.length > 0 && (
                        <div className="border-t dark:border-gray-700 pt-4 space-y-4">
                            {/* Promo Code */}
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter promo code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                />
                                <Button
                                    variant="outline"
                                    onClick={handleApplyPromo}
                                    disabled={isApplyingPromo || !promoCode}
                                >
                                    Apply
                                </Button>
                            </div>

                            {/* Applied Offer */}
                            {appliedOffer && (
                                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600 dark:text-green-400">
                                            {appliedOffer.code}
                                        </span>
                                        <span className="text-sm text-green-700 dark:text-green-300">
                                            ({appliedOffer.discount_value}% off)
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeOffer}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Order Summary */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white">${cartSubtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                                    <span className="text-gray-900 dark:text-white">${deliveryFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                    <span className="text-gray-900 dark:text-white">${tax}</span>
                                </div>
                                {appliedOffer && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Discount</span>
                                        <span>-${(cartSubtotal * appliedOffer.discount_value / 100).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t dark:border-gray-700 pt-2 flex justify-between font-medium">
                                    <span className="text-gray-900 dark:text-white">Total</span>
                                    <span className="text-gray-900 dark:text-white">${cartTotal}</span>
                                </div>
                            </div>

                            {/* Minimum Order Warning */}
                            {!isMinimumMet && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                                        <Info className="w-4 h-4" />
                                        <span>
                                            Minimum order amount is ${restaurant.delivery_info.minimum_order}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Estimated Delivery Time */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>Estimated delivery: {restaurant.delivery_info.estimated_time} mins</span>
                            </div>

                            {/* Checkout Button */}
                            <Button
                                className="w-full gap-2"
                                disabled={!isMinimumMet || isCheckingOut}
                                onClick={handleCheckout}
                            >
                                {isCheckingOut ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <CreditCard className="w-4 h-4" />
                                        Checkout
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default Cart; 