import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Tag,
    ChevronsUpDown,
    Check,
    BadgePercent,
    X,
    ArrowRight
} from 'lucide-react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';

const OrderSummary = ({
    cartItems = [],
    summary = {},
    selectedDeliveryOption = null,
    tipAmount = 0,
    appliedPromoCode = null,
    onApplyPromoCode = () => { },
    onRemovePromoCode = () => { }
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [isApplyingCode, setIsApplyingCode] = useState(false);
    const [promoError, setPromoError] = useState(null);

    // Calculate totals based on props
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = selectedDeliveryOption?.price || 0;
    const discount = summary?.discount || 0;
    const tax = summary?.tax || subtotal * 0.0825; // Default tax rate if not provided
    const total = subtotal + deliveryFee + tax + tipAmount - discount;

    // Handle promo code application
    const handleApplyPromoCode = () => {
        if (!promoCode.trim()) return;

        setIsApplyingCode(true);
        setPromoError(null);

        // Use Inertia form for submitting
        const { post } = useForm({
            promo_code: promoCode
        });

        post(route('checkout2.promo'), {
            preserveScroll: true,
            onSuccess: (page) => {
                // If the server returned a success message
                if (page.props.flash?.success) {
                    onApplyPromoCode(promoCode, page.props.discount);
                    setPromoCode('');
                }
            },
            onError: (errors) => {
                setPromoError(errors.promo_code || 'Invalid promo code');
            },
            onFinish: () => {
                setIsApplyingCode(false);
            }
        });
    };

    // Handle promo code removal
    const handleRemovePromoCode = () => {
        onRemovePromoCode();
    };

    return (
        <Card className="border-gray-200 dark:border-gray-700 shadow-md sticky top-20">
            <CardHeader className="bg-gray-50 dark:bg-gray-800/50 rounded-t-lg">
                <div className="flex items-center justify-between mb-1">
                    <CardTitle className="text-lg font-bold flex items-center">
                        <ShoppingBag className="w-5 h-5 mr-2 text-primary" />
                        Order Summary
                    </CardTitle>

                    <span className="text-sm font-medium">
                        {cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0)} items
                    </span>
                </div>

                <CardDescription>Review your order details</CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
                {/* Mobile Toggle */}
                <div className="md:hidden">
                    <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="w-full"
                    >
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center justify-between w-full p-0 h-auto pb-2"
                            >
                                <span className="text-sm font-medium">
                                    {isOpen ? 'Hide Details' : 'Show Details'}
                                </span>
                                <ChevronsUpDown className="h-4 w-4" />
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="pt-2">
                            <OrderItems items={cartItems} />
                        </CollapsibleContent>
                    </Collapsible>
                    <Separator className="my-2" />
                </div>

                {/* Desktop Order Items */}
                <div className="hidden md:block">
                    <OrderItems items={cartItems} />
                    <Separator className="my-4" />
                </div>

                {/* Promo Code */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Promo Code</h3>
                        {appliedPromoCode && (
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                                {appliedPromoCode.code}
                            </Badge>
                        )}
                    </div>

                    {appliedPromoCode ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                            <div className="flex items-center">
                                <Check className="text-green-500 w-5 h-5 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                        {appliedPromoCode.code}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        {appliedPromoCode.description || 'Discount applied'}
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRemovePromoCode}
                                className="h-8"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1">
                                <BadgePercent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Enter promo code"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                onClick={handleApplyPromoCode}
                                disabled={!promoCode.trim() || isApplyingCode}
                                className="whitespace-nowrap"
                            >
                                {isApplyingCode ? 'Applying...' : 'Apply'}
                            </Button>
                        </div>
                    )}

                    {promoError && (
                        <p className="text-xs text-red-500">{promoError}</p>
                    )}
                </div>

                {/* Order Calculations */}
                <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>

                    {tipAmount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Tip</span>
                            <span>${tipAmount.toFixed(2)}</span>
                        </div>
                    )}

                    {discount > 0 && (
                        <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                            <span>Discount</span>
                            <span>-${discount.toFixed(2)}</span>
                        </div>
                    )}

                    <Separator className="my-2" />

                    <div className="flex items-center justify-between font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Delivery Schedule */}
                {selectedDeliveryOption && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md mt-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <p className="font-medium">Estimated Delivery</p>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {selectedDeliveryOption.name === 'Express'
                                        ? '15-30 minutes'
                                        : selectedDeliveryOption.name === 'Scheduled'
                                            ? 'At your scheduled time'
                                            : '30-45 minutes'}
                                </p>
                            </div>

                            <ArrowRight className="text-gray-400 w-5 h-5" />
                        </div>
                    </div>
                )}
            </CardContent>

            {/* Mobile Checkout Button (shown in mobile view) */}
            <CardFooter className="block lg:hidden pb-0 pt-0">
                <Button className="w-full" size="lg">
                    Proceed to Checkout
                </Button>

                <p className="text-xs text-center text-gray-500 mt-3">
                    By proceeding, you agree to our Terms of Service
                </p>
            </CardFooter>
        </Card>
    );
};

// Sub-component for order items
const OrderItems = ({ items = [] }) => {
    if (!items.length) return (
        <div className="text-center text-sm text-gray-500 py-4">
            Your cart is empty
        </div>
    );

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                        {item.image ? (
                            <div className="w-12 h-12 rounded-md overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-gray-400" />
                            </div>
                        )}

                        <div>
                            <h4 className="text-sm font-medium">{item.name}</h4>
                            <div className="text-xs text-gray-500 mt-1">
                                {item.quantity} × ${item.price.toFixed(2)}

                                {item.options && Object.keys(item.options).length > 0 && (
                                    <div className="mt-1">
                                        {Object.entries(item.options).map(([key, value]) => (
                                            <div key={key}>{key}: {value}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderSummary; 