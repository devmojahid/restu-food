import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, CreditCard, Plus, Banknote, BadgePercent } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';
import { Card } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/Components/ui/tabs';
import { Slider } from '@/Components/ui/slider';

const PaymentSection = ({
    isOpen,
    toggleSection,
    onComplete,
    paymentMethods = [],
    selectedPaymentMethod = null,
    tipAmount = 0,
    isComplete = false,
    errors = {}
}) => {
    const [localSelectedPaymentMethod, setLocalSelectedPaymentMethod] = useState(selectedPaymentMethod);
    const [localTipAmount, setLocalTipAmount] = useState(tipAmount);
    const [localErrors, setLocalErrors] = useState({});
    const [addingNewCard, setAddingNewCard] = useState(false);
    const [tipType, setTipType] = useState('percentage');

    // Common tip percentages and amounts
    const tipPercentages = [0, 10, 15, 20, 25];
    const tipAmounts = [0, 2, 3, 5, 10];

    // Handle payment method selection
    const handlePaymentMethodSelection = (method) => {
        setLocalSelectedPaymentMethod(method);
        setLocalErrors((prev) => ({ ...prev, paymentMethod: null }));
    };

    // Handle percentage tip selection
    const handleTipPercentageSelection = (percentage) => {
        // In a real app, this would calculate based on the actual order subtotal
        const orderSubtotal = 51.96; // This would come from props in a real app
        const calculatedTip = (percentage / 100) * orderSubtotal;
        setLocalTipAmount(parseFloat(calculatedTip.toFixed(2)));
        setTipType('percentage');
    };

    // Handle fixed tip amount selection
    const handleTipAmountSelection = (amount) => {
        setLocalTipAmount(amount);
        setTipType('fixed');
    };

    // Handle custom tip amount input
    const handleCustomTipChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        if (value === '' || isNaN(parseFloat(value))) {
            setLocalTipAmount(0);
        } else {
            setLocalTipAmount(parseFloat(parseFloat(value).toFixed(2)));
        }
        setTipType('custom');
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!localSelectedPaymentMethod) {
            validationErrors.paymentMethod = 'Please select a payment method';
        }

        if (Object.keys(validationErrors).length > 0) {
            setLocalErrors(validationErrors);
            return;
        }

        onComplete(localSelectedPaymentMethod, localTipAmount);
    };

    // Get payment method icon
    const getPaymentMethodIcon = (method) => {
        if (method.type === 'card') {
            return (
                <div className={`h-8 w-12 flex items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium ${method.brand === 'Visa' ? 'text-blue-700' : method.brand === 'Mastercard' ? 'text-red-600' : ''}`}>
                    {method.brand === 'Visa' && 'VISA'}
                    {method.brand === 'Mastercard' && 'MC'}
                    {!['Visa', 'Mastercard'].includes(method.brand) && method.brand}
                </div>
            );
        } else if (method.type === 'paypal') {
            return <div className="h-8 w-12 flex items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium text-blue-600">PP</div>;
        } else if (method.type === 'apple_pay') {
            return <div className="h-8 w-12 flex items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium">AP</div>;
        } else {
            return <Banknote className="h-6 w-6 text-gray-500" />;
        }
    };

    // Selected payment method display
    const getSelectedPaymentMethodSummary = () => {
        if (!selectedPaymentMethod) return 'No payment method selected';

        if (selectedPaymentMethod.type === 'card') {
            return `${selectedPaymentMethod.brand} ****${selectedPaymentMethod.last4}`;
        } else if (selectedPaymentMethod.type === 'paypal') {
            return `PayPal (${selectedPaymentMethod.email})`;
        } else if (selectedPaymentMethod.type === 'cash') {
            return 'Cash on Delivery';
        } else {
            return selectedPaymentMethod.name || selectedPaymentMethod.type;
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
                                <CreditCard className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-lg">Payment</h3>
                            {!isOpen && isComplete && (
                                <div className="text-sm text-gray-500">
                                    <p>{getSelectedPaymentMethodSummary()}</p>
                                    {tipAmount > 0 && (
                                        <p className="text-green-600">Tip: ${tipAmount.toFixed(2)}</p>
                                    )}
                                </div>
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
                            <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-6 bg-white">
                                {/* Payment Methods */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium">Payment Method</h4>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAddingNewCard(!addingNewCard)}
                                            className="text-xs"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            {addingNewCard ? 'Cancel' : 'Add New Card'}
                                        </Button>
                                    </div>

                                    {/* New Card Form (would be implemented in a real app) */}
                                    {addingNewCard && (
                                        <Card className="mb-4 p-4 space-y-4">
                                            <div className="text-center text-gray-500 py-4">
                                                <p>Card form would be implemented here in a real application</p>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-3"
                                                    onClick={() => setAddingNewCard(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </Card>
                                    )}

                                    {/* Payment Methods List */}
                                    {paymentMethods.length > 0 ? (
                                        <div>
                                            <RadioGroup
                                                value={localSelectedPaymentMethod?.id || ''}
                                                onValueChange={(value) => {
                                                    const method = paymentMethods.find(m => m.id === value);
                                                    handlePaymentMethodSelection(method);
                                                }}
                                                className="space-y-3"
                                            >
                                                {paymentMethods.map((method) => (
                                                    <div
                                                        key={method.id}
                                                        className={cn(
                                                            "flex items-center border rounded-lg p-4 cursor-pointer",
                                                            localSelectedPaymentMethod?.id === method.id ? "border-primary bg-primary-50" : "border-gray-200"
                                                        )}
                                                        onClick={() => handlePaymentMethodSelection(method)}
                                                    >
                                                        <RadioGroupItem
                                                            value={method.id}
                                                            id={`payment-${method.id}`}
                                                            className="mr-3"
                                                        />
                                                        <div className="flex flex-1 items-center">
                                                            {getPaymentMethodIcon(method)}
                                                            <div className="ml-3 flex-1">
                                                                <Label htmlFor={`payment-${method.id}`} className="font-medium">
                                                                    {method.type === 'card' && (
                                                                        `${method.brand} ****${method.last4}`
                                                                    )}
                                                                    {method.type === 'paypal' && 'PayPal'}
                                                                    {method.type === 'apple_pay' && 'Apple Pay'}
                                                                    {method.type === 'cash' && 'Cash on Delivery'}
                                                                </Label>
                                                                <div className="text-sm text-gray-500">
                                                                    {method.type === 'card' && (
                                                                        `Expires: ${method.exp_month}/${method.exp_year}`
                                                                    )}
                                                                    {method.type === 'paypal' && method.email}
                                                                </div>
                                                            </div>
                                                            {method.is_default && (
                                                                <div className="text-xs text-primary-600">Default</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            {(localErrors.paymentMethod || errors.payment_method_id) && (
                                                <p className="text-sm text-red-500 mt-2">
                                                    {localErrors.paymentMethod || errors.payment_method_id}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 border border-dashed rounded-lg">
                                            <CreditCard className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                            <p className="text-gray-500">No payment methods available</p>
                                            <Button className="mt-3" size="sm" onClick={() => setAddingNewCard(true)}>
                                                Add a payment method
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Driver Tip Section */}
                                <div className="pt-2">
                                    <div className="flex items-center mb-3">
                                        <h4 className="font-medium">Driver Tip</h4>
                                        <div className="ml-2 bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                                            Optional
                                        </div>
                                    </div>

                                    <Tabs defaultValue="percentage" value={tipType} onValueChange={setTipType} className="w-full">
                                        <TabsList className="grid grid-cols-3 mb-4">
                                            <TabsTrigger value="percentage">Percentage</TabsTrigger>
                                            <TabsTrigger value="fixed">Fixed Amount</TabsTrigger>
                                            <TabsTrigger value="custom">Custom</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="percentage" className="space-y-4">
                                            <div className="grid grid-cols-5 gap-2">
                                                {tipPercentages.map((percentage) => (
                                                    <button
                                                        key={`tip-percentage-${percentage}`}
                                                        type="button"
                                                        className={cn(
                                                            "py-2 px-3 rounded-lg border text-center transition-colors",
                                                            tipType === 'percentage' &&
                                                                Math.round(localTipAmount / 51.96 * 100) === percentage
                                                                ? "bg-primary-50 border-primary text-primary-700"
                                                                : "border-gray-200 hover:border-primary-100 hover:bg-primary-50"
                                                        )}
                                                        onClick={() => handleTipPercentageSelection(percentage)}
                                                    >
                                                        {percentage}%
                                                    </button>
                                                ))}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="fixed" className="space-y-4">
                                            <div className="grid grid-cols-5 gap-2">
                                                {tipAmounts.map((amount) => (
                                                    <button
                                                        key={`tip-amount-${amount}`}
                                                        type="button"
                                                        className={cn(
                                                            "py-2 px-3 rounded-lg border text-center transition-colors",
                                                            tipType === 'fixed' && localTipAmount === amount
                                                                ? "bg-primary-50 border-primary text-primary-700"
                                                                : "border-gray-200 hover:border-primary-100 hover:bg-primary-50"
                                                        )}
                                                        onClick={() => handleTipAmountSelection(amount)}
                                                    >
                                                        {amount === 0 ? 'No Tip' : `$${amount.toFixed(2)}`}
                                                    </button>
                                                ))}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="custom" className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Label htmlFor="tipAmount" className="flex items-center">$</Label>
                                                <Input
                                                    id="tipAmount"
                                                    placeholder="Enter custom tip amount"
                                                    value={localTipAmount === 0 ? '' : localTipAmount}
                                                    onChange={handleCustomTipChange}
                                                    className="max-w-xs"
                                                />
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    {/* Tip Slider */}
                                    <div className="mt-4">
                                        <Slider
                                            defaultValue={[0]}
                                            max={25}
                                            step={1}
                                            value={[tipType === 'percentage'
                                                ? Math.round(localTipAmount / 51.96 * 100)
                                                : Math.min(Math.round(localTipAmount * 5), 25)]}
                                            onValueChange={(values) => {
                                                if (tipType === 'percentage') {
                                                    handleTipPercentageSelection(values[0]);
                                                } else {
                                                    handleTipAmountSelection(values[0] / 5);
                                                }
                                            }}
                                            className="mt-2"
                                        />
                                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                                            <div>No Tip</div>
                                            <div>
                                                {tipType === 'percentage'
                                                    ? `${Math.round(localTipAmount / 51.96 * 100)}% ($${localTipAmount.toFixed(2)})`
                                                    : `$${localTipAmount.toFixed(2)}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={!localSelectedPaymentMethod}
                                    >
                                        Review Order
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PaymentSection; 