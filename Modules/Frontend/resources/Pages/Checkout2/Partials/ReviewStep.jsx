import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    CreditCard,
    Truck,
    Calendar,
    Edit2,
    Utensils,
    ArrowRight,
    Clock,
    AlertCircle,
    Package,
    Info,
    Clipboard
} from 'lucide-react';
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/Components/ui/alert";
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const ReviewStep = ({
    cartItems = [],
    selectedAddress = null,
    selectedPaymentMethod = null,
    selectedDeliveryOption = null,
    tipAmount = 0,
    specialInstructions = '',
    onSpecialInstructionsChange
}) => {
    const [expanded, setExpanded] = useState(true);

    // Format card number to show only last 4 digits
    const formatCardNumber = (last4) => {
        return `•••• ${last4 || '0000'}`;
    };

    // Get payment method display text
    const getPaymentMethodDisplay = () => {
        if (!selectedPaymentMethod) return 'No payment method selected';

        switch (selectedPaymentMethod.type) {
            case 'card':
                return `${selectedPaymentMethod.brand} ${formatCardNumber(selectedPaymentMethod.last4)}`;
            case 'paypal':
                return `PayPal (${selectedPaymentMethod.email})`;
            case 'apple_pay':
                return 'Apple Pay';
            case 'cash':
                return 'Cash on Delivery';
            default:
                return selectedPaymentMethod.name || 'Selected payment method';
        }
    };

    // Calculate total items
    const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);

    // Calculate estimated delivery time
    const getEstimatedDeliveryTime = () => {
        if (!selectedDeliveryOption) return 'N/A';

        // Just a placeholder implementation
        switch (selectedDeliveryOption.id) {
            case 'express':
                return '15-30 minutes';
            case 'standard':
                return '30-45 minutes';
            case 'scheduled':
                return 'At scheduled time';
            default:
                return '30-60 minutes';
        }
    };

    return (
        <div className="space-y-8">
            {/* Step Title */}
            <div>
                <h2 className="text-2xl font-bold mb-1">Review Your Order</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Please review your order details before placing your order
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Information */}
                <Card className="border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-primary" />
                                Delivery Information
                            </CardTitle>

                            {/* <Link href={route('checkout2')} preserveScroll preserveState> */}
                            <Link href="#" preserveScroll preserveState>
                                <Button variant="ghost" size="sm" className="h-8 gap-1">
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                        {selectedAddress ? (
                            <>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="font-medium">Name:</div>
                                    <div className="col-span-2">{selectedAddress.name}</div>

                                    <div className="font-medium">Address:</div>
                                    <div className="col-span-2">
                                        {selectedAddress.address_line1}
                                        {selectedAddress.address_line2 && <span>, {selectedAddress.address_line2}</span>}
                                        <br />
                                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipcode}
                                        <br />
                                        {selectedAddress.country}
                                    </div>

                                    <div className="font-medium">Phone:</div>
                                    <div className="col-span-2">{selectedAddress.phone}</div>
                                </div>

                                {selectedAddress.instructions && (
                                    <div className="text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                                        <div className="font-medium mb-1">Special instructions:</div>
                                        <div>{selectedAddress.instructions}</div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-amber-600 dark:text-amber-400 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                No delivery address selected
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Information */}
                <Card className="border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-primary" />
                                Payment Information
                            </CardTitle>

                            {/* <Link href={route('checkout2')} preserveScroll preserveState query={{ step: 2 }}> */}
                            <Link href="#" preserveScroll preserveState>
                                <Button variant="ghost" size="sm" className="h-8 gap-1">
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                        {selectedPaymentMethod ? (
                            <>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="font-medium">Method:</div>
                                    <div className="col-span-2">{getPaymentMethodDisplay()}</div>

                                    {tipAmount > 0 && (
                                        <>
                                            <div className="font-medium">Tip Amount:</div>
                                            <div className="col-span-2">${tipAmount.toFixed(2)}</div>
                                        </>
                                    )}
                                </div>

                                <div className="text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                                    <div className="font-medium mb-1">Payment Terms:</div>
                                    <div>
                                        {selectedPaymentMethod.type === 'cash'
                                            ? 'You will need to pay the delivery person upon arrival.'
                                            : 'Your card will be charged after order confirmation.'}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-amber-600 dark:text-amber-400 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                No payment method selected
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delivery Method */}
                <Card className="border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold flex items-center">
                                <Truck className="w-5 h-5 mr-2 text-primary" />
                                Delivery Method
                            </CardTitle>

                            {/* <Link href={route('checkout2')} preserveScroll preserveState> */}
                            <Link href="#" preserveScroll preserveState>
                                <Button variant="ghost" size="sm" className="h-8 gap-1">
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                        {selectedDeliveryOption ? (
                            <>
                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="font-medium">Option:</div>
                                    <div className="col-span-2">
                                        {selectedDeliveryOption.name} <span className="text-gray-500">
                                            (${selectedDeliveryOption.price.toFixed(2)})
                                        </span>
                                    </div>

                                    <div className="font-medium">Delivery Time:</div>
                                    <div className="col-span-2 flex items-center">
                                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                        {getEstimatedDeliveryTime()}
                                    </div>
                                </div>

                                {selectedDeliveryOption.description && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                                        <Info className="w-4 h-4 mr-1 inline-block" />
                                        {selectedDeliveryOption.description}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-amber-600 dark:text-amber-400 text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                No delivery option selected
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold flex items-center">
                                <Package className="w-5 h-5 mr-2 text-primary" />
                                Order Summary
                            </CardTitle>

                            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <Accordion
                            type="single"
                            defaultValue="items"
                            collapsible
                            className="w-full"
                        >
                            <AccordionItem value="items" className="border-0">
                                <AccordionTrigger className="py-2">
                                    View Order Details
                                </AccordionTrigger>
                                <AccordionContent>
                                    {cartItems.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Item</TableHead>
                                                    <TableHead className="text-right w-20">Qty</TableHead>
                                                    <TableHead className="text-right">Price</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {cartItems.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="py-2">
                                                            <div className="font-medium">{item.name}</div>
                                                            {item.options && (
                                                                <div className="text-xs text-gray-500 mt-0.5">
                                                                    {Object.entries(item.options).map(([key, value]) => (
                                                                        <div key={key}>{key}: {value}</div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right py-2">{item.quantity}</TableCell>
                                                        <TableCell className="text-right py-2">${item.price.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="text-center text-sm text-gray-500 py-2">No items in cart</div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
                <h3 className="font-medium flex items-center">
                    <Clipboard className="w-5 h-5 mr-2 text-primary" />
                    Special Instructions for Restaurant
                </h3>

                <Textarea
                    placeholder="Add any special requests, preferences or allergies"
                    value={specialInstructions}
                    onChange={onSpecialInstructionsChange}
                    rows={3}
                    className="resize-none"
                />

                <p className="text-xs text-gray-500">
                    Note: Additional charges may apply for special requests
                </p>
            </div>

            {/* Order Finalization Alert */}
            <Alert className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200 dark:border-amber-900/50">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertTitle>Important Information</AlertTitle>
                <AlertDescription className="mt-2 text-sm">
                    <p>By placing your order, you agree to the following:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                        <li>All order details are correct and complete</li>
                        <li>You agree to our Terms of Service and Privacy Policy</li>
                        <li>You acknowledge our refund and cancellation policies</li>
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default ReviewStep; 