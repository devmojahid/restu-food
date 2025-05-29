import React from 'react';
import {
    MapPin,
    CreditCard,
    Edit2,
    Clock,
    ShoppingBag,
    MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';

const ReviewStep = ({
    cartItems = [],
    selectedAddress = null,
    selectedPaymentMethod = null,
    selectedDeliveryOption = null,
    tipAmount = 0,
    specialInstructions = '',
    onSpecialInstructionsChange
}) => {
    // Format price
    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    // Calculate subtotal
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold mb-4">Review Your Order</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                    Please review your order details before placing your order.
                </p>

                {/* Order Items Summary */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Order Items</CardTitle>
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                                <ShoppingBag className="w-3 h-3 mr-1" />
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                            </Badge>
                        </div>
                        <CardDescription>Items in your order</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {item.quantity} × {formatPrice(item.price)}
                                            </p>
                                            {Object.entries(item.options || {}).length > 0 && (
                                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                                                    {Object.entries(item.options).map(([key, value]) => (
                                                        <span key={key} className="mr-2">
                                                            {key}: {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {item.instructions && (
                                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-500 italic">
                                                    "{item.instructions}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-3 border-t flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span className="font-bold">{formatPrice(calculateSubtotal())}</span>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Information */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-primary" />
                                Delivery Address
                            </CardTitle>
                            <Button variant="ghost" size="sm">
                                <Edit2 className="w-4 h-4 mr-1" />
                                Change
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                        {selectedAddress ? (
                            <div className="space-y-1">
                                <p className="font-medium">{selectedAddress.recipient}</p>
                                <p className="text-sm">{selectedAddress.address_line1}</p>
                                {selectedAddress.address_line2 && (
                                    <p className="text-sm">{selectedAddress.address_line2}</p>
                                )}
                                <p className="text-sm">
                                    {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                                </p>
                                <p className="text-sm">{selectedAddress.country}</p>
                                <p className="text-sm font-medium mt-2">{selectedAddress.phone}</p>

                                {selectedAddress.delivery_instructions && (
                                    <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                        <p className="font-medium mb-1">Delivery Instructions:</p>
                                        <p>{selectedAddress.delivery_instructions}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Please select a delivery address.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center">
                                <CreditCard className="w-4 h-4 mr-2 text-primary" />
                                Payment Method
                            </CardTitle>
                            <Button variant="ghost" size="sm">
                                <Edit2 className="w-4 h-4 mr-1" />
                                Change
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                        {selectedPaymentMethod ? (
                            <div className="flex items-center space-x-3">
                                {selectedPaymentMethod.icon && (
                                    <img
                                        src={selectedPaymentMethod.icon}
                                        alt={selectedPaymentMethod.type}
                                        className="w-8 h-8 object-contain"
                                    />
                                )}
                                <div>
                                    {selectedPaymentMethod.type === 'credit_card' ? (
                                        <>
                                            <p className="font-medium capitalize">
                                                {selectedPaymentMethod.brand} ending in {selectedPaymentMethod.last4}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Expires {selectedPaymentMethod.exp_month}/{selectedPaymentMethod.exp_year}
                                            </p>
                                        </>
                                    ) : selectedPaymentMethod.type === 'paypal' ? (
                                        <p className="font-medium">
                                            PayPal ({selectedPaymentMethod.email})
                                        </p>
                                    ) : (
                                        <p className="font-medium capitalize">
                                            {selectedPaymentMethod.type.replace('_', ' ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Please select a payment method.
                            </p>
                        )}

                        {tipAmount > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Driver Tip:</span>
                                    <span className="font-medium">${tipAmount.toFixed(2)}</span>
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delivery Option */}
            {selectedDeliveryOption && (
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-primary" />
                                Delivery Option
                            </CardTitle>
                            <Button variant="ghost" size="sm">
                                <Edit2 className="w-4 h-4 mr-1" />
                                Change
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{selectedDeliveryOption.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedDeliveryOption.description}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="font-semibold">
                                    {selectedDeliveryOption.price > 0
                                        ? `$${selectedDeliveryOption.price.toFixed(2)}`
                                        : 'Free'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Special Instructions */}
            <div>
                <div className="flex items-center space-x-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Special Instructions</h3>
                </div>
                <Label htmlFor="special-instructions" className="text-sm mb-2 block">
                    Add any special instructions for your delivery
                </Label>
                <Textarea
                    id="special-instructions"
                    placeholder="E.g., Ring doorbell, leave at door, call upon arrival, etc."
                    value={specialInstructions}
                    onChange={onSpecialInstructionsChange}
                    className="h-24"
                />
            </div>

            {/* Confirmation Note */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg mt-8">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                    Your order will be processed immediately.
                </p>
            </div>
        </div>
    );
};

export default ReviewStep; 