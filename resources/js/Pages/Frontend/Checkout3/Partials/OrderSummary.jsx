import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronDown, ChevronUp, X, BadgePlus, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';

const OrderSummary = ({
    cartItems = [],
    summary = {},
    selectedDeliveryOption = null,
    tipAmount = 0,
    appliedPromoCode = null,
    onApplyPromoCode,
    onRemovePromoCode
}) => {
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);
    const [calculatedTotal, setCalculatedTotal] = useState(0);

    // Calculate the total with all additions (delivery option, tip) and discounts
    useEffect(() => {
        let total = summary.subtotal || 0;

        // Add tax
        if (summary.tax) {
            total += summary.tax;
        }

        // Add service fee
        if (summary.service_fee) {
            total += summary.service_fee;
        }

        // Add delivery fee based on selected option
        const deliveryFee = selectedDeliveryOption?.price || summary.delivery_fee || 0;
        total += deliveryFee;

        // Add tip
        if (tipAmount > 0) {
            total += tipAmount;
        }

        // Apply discount if promo code is applied
        if (appliedPromoCode) {
            // This is a simplified calculation - in a real app you'd likely
            // have more complex logic from the backend
            if (appliedPromoCode.discount_type === 'percentage') {
                const discount = (summary.subtotal * appliedPromoCode.discount_value) / 100;
                total -= discount;
            } else {
                total -= appliedPromoCode.discount_value;
            }
        }

        setCalculatedTotal(total);
    }, [summary, selectedDeliveryOption, tipAmount, appliedPromoCode]);

    // Handle promo code submission
    const handleApplyPromoCode = (e) => {
        e.preventDefault();

        if (!promoCode.trim()) {
            setPromoError('Please enter a promo code');
            return;
        }

        // Clear any previous errors
        setPromoError('');

        // Call the parent's handler
        onApplyPromoCode(promoCode);

        // Reset the input
        setPromoCode('');
    };

    // Format price with default currency
    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Order Summary
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 sm:hidden"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <span className="sr-only">{isExpanded ? 'Hide' : 'Show'} order summary</span>
                    </Button>
                </div>
            </CardHeader>

            <div className={cn("sm:block", isExpanded ? "block" : "hidden")}>
                <CardContent className="pb-4">
                    {/* Items in the cart */}
                    <div className="space-y-3">
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <div key={index} className="flex items-start py-2">
                                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-gray-200" />
                                        )}
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div className="flex justify-between text-sm font-medium text-gray-900">
                                            <h3 className="line-clamp-1">
                                                {item.name}
                                            </h3>
                                            <p className="ml-2">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                        <div className="flex items-end justify-between text-xs">
                                            <p className="text-gray-500">Qty {item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-4 text-center">
                                <ShoppingBag className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                <p className="text-gray-500">Your cart is empty</p>
                            </div>
                        )}
                    </div>

                    <Separator className="my-4" />

                    {/* Promo code section */}
                    <div>
                        {appliedPromoCode ? (
                            <div className="mb-4">
                                <div className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                                    <div>
                                        <p className="text-sm font-medium text-green-800">
                                            {appliedPromoCode.code}
                                        </p>
                                        <p className="text-xs text-green-700">
                                            {appliedPromoCode.description}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0 text-green-700 hover:text-green-900"
                                        onClick={onRemovePromoCode}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleApplyPromoCode} className="mb-4">
                                <p className="text-sm font-medium mb-2">Promo Code</p>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Enter code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className={promoError ? "border-red-300" : ""}
                                        />
                                        {promoError && (
                                            <p className="text-xs text-red-500 mt-1">{promoError}</p>
                                        )}
                                    </div>
                                    <Button type="submit" variant="outline" size="sm">Apply</Button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Order details */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatPrice(summary.subtotal || 0)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span>{formatPrice(summary.tax || 0)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Service Fee</span>
                            <span>{formatPrice(summary.service_fee || 0)}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="flex items-center text-gray-600">
                                Delivery Fee
                                {selectedDeliveryOption && (
                                    <Badge variant="outline" size="sm" className="ml-2 text-xs">
                                        {selectedDeliveryOption.name}
                                    </Badge>
                                )}
                            </span>
                            <span>
                                {formatPrice(selectedDeliveryOption?.price || summary.delivery_fee || 0)}
                            </span>
                        </div>

                        {tipAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tip</span>
                                <span className="text-green-600">{formatPrice(tipAmount)}</span>
                            </div>
                        )}

                        {appliedPromoCode && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Discount</span>
                                <span className="text-green-600">
                                    {appliedPromoCode.discount_type === 'percentage'
                                        ? `-${formatPrice((summary.subtotal * appliedPromoCode.discount_value) / 100)}`
                                        : `-${formatPrice(appliedPromoCode.discount_value)}`
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="border-t pt-4">
                    <div className="w-full">
                        <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>{formatPrice(calculatedTotal)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Taxes included where applicable
                        </p>
                    </div>
                </CardFooter>
            </div>
        </Card>
    );
};

export default OrderSummary; 