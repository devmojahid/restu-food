import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, ClipboardCheck, Pencil } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Separator } from '@/Components/ui/separator';
import { Checkbox } from '@/Components/ui/checkbox';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';
import { Badge } from '@/Components/ui/badge';

const ReviewSection = ({
    isOpen,
    toggleSection,
    customerInfo,
    selectedAddress,
    selectedDeliveryOption,
    selectedPaymentMethod,
    cartItems = [],
    tipAmount = 0,
    specialInstructions = '',
    onSpecialInstructionsChange,
    agreedToTerms = false,
    setAgreedToTerms,
    isComplete = false
}) => {
    // Format card information
    const formatPaymentMethod = () => {
        if (!selectedPaymentMethod) return 'No payment method selected';

        if (selectedPaymentMethod.type === 'card') {
            return (
                <div>
                    <div className="font-medium">
                        {selectedPaymentMethod.brand} ****{selectedPaymentMethod.last4}
                    </div>
                    <div className="text-sm text-gray-500">
                        Expires: {selectedPaymentMethod.exp_month}/{selectedPaymentMethod.exp_year}
                    </div>
                </div>
            );
        } else if (selectedPaymentMethod.type === 'paypal') {
            return (
                <div>
                    <div className="font-medium">PayPal</div>
                    <div className="text-sm text-gray-500">{selectedPaymentMethod.email}</div>
                </div>
            );
        } else if (selectedPaymentMethod.type === 'apple_pay') {
            return <div className="font-medium">Apple Pay</div>;
        } else {
            return <div className="font-medium">{selectedPaymentMethod.name || 'Cash on Delivery'}</div>;
        }
    };

    return (
        <div className="mb-6">
            <div
                className={cn(
                    "border rounded-lg overflow-hidden transition-all",
                    isComplete && !isOpen ? "border-green-200 bg-green-50" : "border-gray-200",
                    isOpen ? "shadow-md" : ""
                )}
            >
                {/* Section Header - Always visible */}
                <div
                    className={cn(
                        "flex items-center justify-between p-4 cursor-pointer transition-colors",
                        isOpen ? "bg-gray-50" : isComplete ? "bg-green-50" : "bg-white",
                        (isComplete && !isOpen) ? "hover:bg-green-100" : "hover:bg-gray-50"
                    )}
                    onClick={toggleSection}
                >
                    <div className="flex items-center">
                        <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full mr-3",
                            isComplete ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        )}>
                            {isComplete ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                <ClipboardCheck className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-lg">Review Order</h3>
                            {!isOpen && isComplete && (
                                <p className="text-sm text-gray-500">
                                    Order details reviewed
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                    </div>
                </div>

                {/* Section Content - Only visible when expanded */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 pt-2 space-y-6 bg-white">
                                {/* Customer Information */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">Customer Information</h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => toggleSection('customerInfo')}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                    </div>

                                    {customerInfo ? (
                                        <div className="text-sm">
                                            <p className="font-medium">{customerInfo.firstName} {customerInfo.lastName}</p>
                                            <p className="text-gray-600">{customerInfo.email}</p>
                                            <p className="text-gray-600">{customerInfo.phone}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-red-500">Please complete customer information</p>
                                    )}
                                </div>

                                <Separator />

                                {/* Shipping Information */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">Shipping Information</h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => toggleSection('shipping')}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                    </div>

                                    {selectedAddress ? (
                                        <div className="space-y-3">
                                            <div className="text-sm">
                                                <p className="font-medium">{selectedAddress.name}</p>
                                                <p className="text-gray-600">
                                                    {selectedAddress.address_line_1}
                                                    {selectedAddress.address_line_2 && (
                                                        <>, {selectedAddress.address_line_2}</>
                                                    )}
                                                </p>
                                                <p className="text-gray-600">
                                                    {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}
                                                </p>
                                                <p className="text-gray-600">{selectedAddress.phone}</p>
                                            </div>

                                            {selectedDeliveryOption && (
                                                <div>
                                                    <Badge variant="outline" className="font-normal">
                                                        {selectedDeliveryOption.name} (${selectedDeliveryOption.price.toFixed(2)})
                                                    </Badge>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {selectedDeliveryOption.description}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-red-500">Please select a shipping address</p>
                                    )}
                                </div>

                                <Separator />

                                {/* Payment Information */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">Payment Information</h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => toggleSection('payment')}
                                        >
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                    </div>

                                    {selectedPaymentMethod ? (
                                        <div className="space-y-3">
                                            {formatPaymentMethod()}

                                            {tipAmount > 0 && (
                                                <div className="text-sm text-green-600 flex items-center">
                                                    <span className="font-medium">Driver Tip:</span>
                                                    <span className="ml-2">${tipAmount.toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-red-500">Please select a payment method</p>
                                    )}
                                </div>

                                <Separator />

                                {/* Order Items */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Order Items ({cartItems.length})</h4>

                                    <div className="space-y-3">
                                        {cartItems.length > 0 ? (
                                            cartItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
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
                                                    <div className="flex flex-1 flex-col">
                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                            <h3>
                                                                {item.name}
                                                            </h3>
                                                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                        <div className="flex flex-1 items-end justify-between text-sm">
                                                            <p className="text-gray-500">Qty {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-red-500">Your cart is empty</p>
                                        )}
                                    </div>
                                </div>

                                {/* Special Instructions */}
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Special Instructions <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                                    </h4>
                                    <Textarea
                                        placeholder="Add any special instructions or delivery notes..."
                                        className="resize-none"
                                        value={specialInstructions}
                                        onChange={(e) => onSpecialInstructionsChange(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        For example: Ring the doorbell, leave at the door, etc.
                                    </p>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="terms"
                                            checked={agreedToTerms}
                                            onCheckedChange={setAgreedToTerms}
                                        />
                                        <Label
                                            htmlFor="terms"
                                            className="text-sm leading-tight"
                                        >
                                            I agree to the <a href="#" className="text-primary underline">Terms and Conditions</a> and <a href="#" className="text-primary underline">Privacy Policy</a>
                                        </Label>
                                    </div>

                                    {!agreedToTerms && isComplete && (
                                        <p className="text-sm text-red-500">
                                            Please agree to the terms and conditions to place your order
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ReviewSection; 