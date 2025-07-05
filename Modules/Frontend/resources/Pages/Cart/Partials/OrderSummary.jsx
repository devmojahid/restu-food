import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, router } from '@inertiajs/react';
import {
    CreditCard,
    ShieldCheck,
    Clock,
    Percent,
    Check,
    X,
    AlertCircle,
    RefreshCw,
    ArrowRight,
    Truck,
    Info
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { Badge } from '@/Components/ui/badge';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Separator } from '@/Components/ui/separator';
import { useToast } from '@/Components/ui/use-toast';
import { cn } from '@/lib/utils';

const OrderSummary = ({
    summary = {},
    onApplyPromoCode,
    isCheckoutDisabled = false
}) => {
    const [promoCode, setPromoCode] = useState('');
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
    const { toast } = useToast();

    // Default values if summary is not provided or missing fields
    const {
        subtotal = 0,
        tax = 0,
        delivery_fee = 0,
        discount = 0,
        total = 0,
        currency = 'USD',
        free_delivery_threshold = 30,
        min_order_amount = 10,
        active_promo = null
    } = summary || {};

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(price);
    };

    const handleApplyPromoCode = async () => {
        if (!promoCode.trim()) return;

        setIsApplyingPromo(true);
        try {
            if (onApplyPromoCode) {
                await onApplyPromoCode(promoCode);
            } else {
                // Simulate API call for demo
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Show success message
                toast({
                    title: "Promo code applied",
                    description: "Your discount has been applied to the order",
                });
            }
            setPromoCode('');
        } catch (error) {
            toast({
                title: "Invalid promo code",
                description: error?.message || "This code is invalid or has expired",
                variant: "destructive",
            });
        } finally {
            setIsApplyingPromo(false);
        }
    };

    const handleRemovePromoCode = async () => {
        try {
            // In a real app, you would make an API call to remove the promo code
            await new Promise(resolve => setTimeout(resolve, 500));

            toast({
                title: "Promo code removed",
                description: "Your discount has been removed",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove promo code",
                variant: "destructive",
            });
        }
    };

    const handleCheckout = async () => {
        setIsProcessingCheckout(true);
        try {
            // In a real app, you would navigate to checkout or initiate checkout process
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Navigate to checkout page
            router.visit('/checkout');
        } catch (error) {
            toast({
                title: "Checkout error",
                description: "There was an error processing your checkout",
                variant: "destructive",
            });
            setIsProcessingCheckout(false);
        }
    };

    const isMinimumMet = subtotal >= min_order_amount;
    const isFreeDelivery = subtotal >= free_delivery_threshold;

    return (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-4">
                <CardTitle className="text-xl">Order Summary</CardTitle>
                <CardDescription>Review your order details before checkout</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Price Breakdown */}
                <div className="space-y-3">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Tax</span>
                        <span>{formatPrice(tax)}</span>
                    </div>

                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                            <span>Delivery Fee</span>
                            {isFreeDelivery && (
                                <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                                    Free
                                </Badge>
                            )}
                        </div>
                        <span>{isFreeDelivery ? 'Free' : formatPrice(delivery_fee)}</span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                            <span>Discount</span>
                            <span>-{formatPrice(discount)}</span>
                        </div>
                    )}

                    <Separator className="my-2" />

                    <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                </div>

                {/* Minimum Order Alert */}
                {!isMinimumMet && (
                    <Alert variant="warning" className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50">
                        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <AlertDescription className="text-yellow-700 dark:text-yellow-300 text-sm">
                            Minimum order amount is {formatPrice(min_order_amount)}.
                            Add {formatPrice(min_order_amount - subtotal)} more to proceed.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Free Delivery Info */}
                {!isFreeDelivery && (
                    <Alert className="bg-primary/5 border-primary/20">
                        <Truck className="h-4 w-4 text-primary" />
                        <AlertDescription className="text-primary dark:text-primary text-sm">
                            Add {formatPrice(free_delivery_threshold - subtotal)} more for free delivery!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Promo Code */}
                <div className="space-y-3">
                    <div className="font-medium text-gray-900 dark:text-white">Promo Code</div>

                    {active_promo ? (
                        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800/50">
                            <div className="flex items-center">
                                <Badge variant="outline" className="bg-white dark:bg-gray-800 mr-2">
                                    {active_promo.code}
                                </Badge>
                                <span className="text-sm text-green-700 dark:text-green-300">
                                    {active_promo.description}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRemovePromoCode}
                                className="text-gray-500 dark:text-gray-400 hover:text-red-500"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter promo code"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                variant="outline"
                                onClick={handleApplyPromoCode}
                                disabled={!promoCode || isApplyingPromo}
                            >
                                {isApplyingPromo ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Apply'
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Estimated Delivery */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>Estimated Delivery</span>
                    </div>
                    <span>30-45 minutes</span>
                </div>

                {/* Secure Checkout Badge */}
                <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                    <ShieldCheck className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                    <span>Secure Checkout</span>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
                <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCheckoutDisabled || !isMinimumMet || isProcessingCheckout}
                >
                    {isProcessingCheckout ? (
                        <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard className="h-4 w-4" />
                            Proceed to Checkout
                        </>
                    )}
                </Button>

                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    By proceeding, you agree to our
                    <Link href="/terms" className="text-primary hover:underline mx-1">Terms of Service</Link>
                    and
                    <Link href="/privacy" className="text-primary hover:underline mx-1">Privacy Policy</Link>
                </div>
            </CardFooter>
        </Card>
    );
};

export default OrderSummary; 