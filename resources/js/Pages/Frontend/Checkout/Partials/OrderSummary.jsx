import React, { useState } from 'react';
import {
    ShoppingBag,
    Calculator,
    Truck,
    Heart,
    Percent,
    Receipt,
    PlusCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';

const OrderSummary = ({
    cartItems = [],
    summary = {},
    selectedDeliveryOption = null,
    tipAmount = 0
}) => {
    const [showPromoCodeInput, setShowPromoCodeInput] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [showItemDetails, setShowItemDetails] = useState(false);

    // Format price
    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    // Handle promo code input change
    const handlePromoCodeChange = (e) => {
        setPromoCode(e.target.value);
    };

    // Handle promo code application
    const handleApplyPromoCode = () => {
        // This would be implemented to call the backend
        console.log(`Applying promo code: ${promoCode}`);
    };

    // Calculate taxes, delivery fee, etc. using the summary or compute if not provided
    const calculateSummary = () => {
        // Use provided summary values if available
        if (summary && Object.keys(summary).length) {
            return {
                subtotal: summary.subtotal || 0,
                tax: summary.tax || 0,
                deliveryFee: summary.delivery_fee || 0,
                tip: tipAmount || summary.tip || 0,
                discount: summary.discount || 0,
                total: summary.total || 0,
                activePromo: summary.active_promo || null
            };
        }

        // Otherwise calculate it
        const subtotal = cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        const tax = subtotal * 0.07; // 7% tax
        const deliveryFee = selectedDeliveryOption?.price || 0;
        const discount = 0; // No discount in this case
        const total = subtotal + tax + deliveryFee + tipAmount - discount;

        return {
            subtotal,
            tax,
            deliveryFee,
            tip: tipAmount,
            discount,
            total,
            activePromo: null
        };
    };

    const orderSummary = calculateSummary();

    return (
        <Card className="sticky top-24">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </Badge>
                </div>
                <CardDescription>Review your order details</CardDescription>
            </CardHeader>

            <CardContent className="pb-0">
                {/* Item Details Toggle */}
                <Button
                    variant="ghost"
                    className="w-full justify-between mb-4 p-0 h-auto"
                    onClick={() => setShowItemDetails(!showItemDetails)}
                >
                    <span className="font-medium">
                        {showItemDetails ? 'Hide' : 'Show'} item details
                    </span>
                    {showItemDetails ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </Button>

                {/* Item Details (Collapsible) */}
                <AnimatePresence>
                    {showItemDetails && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-3 mb-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {item.quantity} × {item.name}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Order Calculation */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calculator className="w-4 h-4 mr-2" />
                            <span>Subtotal</span>
                        </div>
                        <span>{formatPrice(orderSummary.subtotal)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Receipt className="w-4 h-4 mr-2" />
                            <span>Tax</span>
                        </div>
                        <span>{formatPrice(orderSummary.tax)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Truck className="w-4 h-4 mr-2" />
                            <span>Delivery Fee</span>
                        </div>
                        <span>
                            {orderSummary.deliveryFee > 0
                                ? formatPrice(orderSummary.deliveryFee)
                                : 'Free'}
                        </span>
                    </div>

                    {orderSummary.tip > 0 && (
                        <div className="flex justify-between items-center">
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <Heart className="w-4 h-4 mr-2" />
                                <span>Driver Tip</span>
                            </div>
                            <span>{formatPrice(orderSummary.tip)}</span>
                        </div>
                    )}

                    {orderSummary.discount > 0 && (
                        <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                            <div className="flex items-center">
                                <Percent className="w-4 h-4 mr-2" />
                                <span>Discount</span>
                            </div>
                            <span>-{formatPrice(orderSummary.discount)}</span>
                        </div>
                    )}
                </div>

                {/* Promo Code */}
                <div className="mt-4">
                    {orderSummary.activePromo ? (
                        <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded text-xs mb-4">
                            <div>
                                <span className="font-medium text-green-700 dark:text-green-400">
                                    {orderSummary.activePromo.code}
                                </span>
                                <p className="text-green-600 dark:text-green-500 mt-0.5">
                                    {orderSummary.activePromo.description}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 p-0 px-2"
                            >
                                Remove
                            </Button>
                        </div>
                    ) : (
                        <div className="mb-4">
                            {showPromoCodeInput ? (
                                <div className="space-y-2">
                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Enter promo code"
                                            value={promoCode}
                                            onChange={handlePromoCodeChange}
                                            className="h-9"
                                        />
                                        <Button
                                            size="sm"
                                            className="h-9"
                                            onClick={handleApplyPromoCode}
                                            disabled={!promoCode}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs p-0 h-auto"
                                        onClick={() => setShowPromoCodeInput(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto flex items-center text-primary"
                                    onClick={() => setShowPromoCodeInput(true)}
                                >
                                    <PlusCircle className="w-4 h-4 mr-1" />
                                    Add Promo Code
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex-col pt-0">
                <Separator className="my-4" />

                {/* Total */}
                <div className="flex justify-between items-center w-full mb-4">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg">
                        {formatPrice(orderSummary.total)}
                    </span>
                </div>

                {/* Free Delivery Threshold Note */}
                {selectedDeliveryOption && selectedDeliveryOption.min_order_free_delivery > 0 && (
                    <div className="w-full">
                        {orderSummary.subtotal < selectedDeliveryOption.min_order_free_delivery ? (
                            <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                                Add ${(selectedDeliveryOption.min_order_free_delivery - orderSummary.subtotal).toFixed(2)} more for free delivery
                            </div>
                        ) : (
                            <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded text-center">
                                You've qualified for free delivery!
                            </div>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

export default OrderSummary; 