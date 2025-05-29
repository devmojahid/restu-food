import React from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    ShoppingBag,
    Clock,
    ArrowRight,
    CheckCircle2,
    Shield,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { Progress } from '@/Components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { cn } from '@/lib/utils';

const CartSummary = ({
    summary = {},
    isCheckingOut = false,
    onCheckout
}) => {
    const {
        subtotal = 0,
        discount = 0,
        tax = 0,
        delivery_fee = 0,
        service_fee = 0,
        total = 0,
        estimated_time = '30-45 min',
        promo_applied = false,
        promo_code = '',
        promo_discount = 0
    } = summary;

    // Calculate free delivery threshold
    const FREE_DELIVERY_THRESHOLD = 35;
    const progressToFreeDelivery = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
    const amountToFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;
    const hasFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md",
                "border border-gray-100 dark:border-gray-700",
                "sticky top-24"
            )}
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{estimated_time}</span>
                </div>
            </div>

            {/* Free Delivery Progress */}
            {!hasFreeDelivery && subtotal > 0 && (
                <div className="mb-6 p-4 bg-primary/5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Free delivery progress</span>
                        <span className="text-sm font-medium">${subtotal.toFixed(2)} / ${FREE_DELIVERY_THRESHOLD.toFixed(2)}</span>
                    </div>
                    <Progress value={progressToFreeDelivery} className="h-2 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add <span className="font-medium text-primary">${amountToFreeDelivery.toFixed(2)}</span> more to get free delivery!
                    </p>
                </div>
            )}

            {/* Summary Items */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Item Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                )}

                {promo_applied && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span className="flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Promo: {promo_code}
                        </span>
                        <span>-${promo_discount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between">
                    <div className="flex items-center">
                        <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                        {hasFreeDelivery && (
                            <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                                Free
                            </span>
                        )}
                    </div>
                    <span>
                        {hasFreeDelivery ? (
                            <span className="flex items-center">
                                <span className="text-gray-400 line-through mr-1">${delivery_fee.toFixed(2)}</span>
                                <span className="text-green-600 dark:text-green-400">$0.00</span>
                            </span>
                        ) : (
                            `$${delivery_fee.toFixed(2)}`
                        )}
                    </span>
                </div>

                <div className="flex justify-between">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="flex items-center cursor-help">
                                <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                                <AlertCircle className="w-3.5 h-3.5 ml-1 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs max-w-xs">This fee helps us operate our platform and provide customer support.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span>${service_fee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Checkout Button */}
            <Button
                className="w-full h-12 text-base group"
                onClick={onCheckout}
                disabled={isCheckingOut || subtotal === 0}
            >
                {isCheckingOut ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Checkout
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </Button>

            {/* Secure Checkout Message */}
            <div className="mt-4 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                <span>Secure checkout</span>
            </div>
        </motion.div>
    );
};

export default CartSummary; 