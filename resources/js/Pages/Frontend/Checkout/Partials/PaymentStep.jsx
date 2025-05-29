import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Plus,
    CheckCircle,
    Lock,
    Shield,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/Components/ui/tooltip';

const PaymentStep = ({
    paymentMethods = [],
    selectedPaymentMethod = null,
    onPaymentMethodSelect,
    tipAmount = 0,
    onTipChange,
    tipOptions = [0, 2, 3, 5, 10]
}) => {
    const [customTip, setCustomTip] = useState('');
    const [showCustomTipInput, setShowCustomTipInput] = useState(false);

    // Handle custom tip input change
    const handleCustomTipChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
            setCustomTip(value);

            if (value !== '') {
                onTipChange(parseFloat(value));
            }
        }
    };

    // Handle tip option selection
    const handleTipSelect = (amount) => {
        if (amount === 'custom') {
            setShowCustomTipInput(true);
            setCustomTip(tipAmount > 0 && !tipOptions.includes(tipAmount) ? tipAmount.toString() : '');
            return;
        }

        setShowCustomTipInput(false);
        onTipChange(amount);
    };

    // Get card icon based on brand
    const getCardIcon = (cardType, brand) => {
        if (cardType === 'credit_card') {
            switch (brand?.toLowerCase()) {
                case 'visa':
                    return '/images/payment/visa.svg';
                case 'mastercard':
                    return '/images/payment/mastercard.svg';
                case 'amex':
                    return '/images/payment/amex.svg';
                case 'discover':
                    return '/images/payment/discover.svg';
                default:
                    return '/images/payment/credit-card.svg';
            }
        }

        return null;
    };

    // Format card number
    const formatCardNumber = (last4) => {
        return `•••• ${last4}`;
    };

    // Format expiration date
    const formatExpiry = (month, year) => {
        return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                <RadioGroup
                    value={selectedPaymentMethod}
                    onValueChange={onPaymentMethodSelect}
                    className="space-y-4"
                >
                    {paymentMethods.map((method) => {
                        const isSelected = selectedPaymentMethod === method.id;

                        return (
                            <div key={method.id} className="relative">
                                <div
                                    className={cn(
                                        "flex items-start space-x-4 p-4 rounded-lg border transition-all",
                                        "hover:border-primary/50 hover:shadow-sm",
                                        isSelected && "border-primary ring-1 ring-primary/20"
                                    )}
                                >
                                    <RadioGroupItem
                                        id={method.id}
                                        value={method.id}
                                        className="mt-1"
                                    />
                                    <div className="flex flex-1 items-center">
                                        <div className="flex-shrink-0 mr-4">
                                            {method.icon ? (
                                                <img
                                                    src={method.icon}
                                                    alt={method.type}
                                                    className="w-8 h-8 object-contain"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-gray-500" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <Label
                                                htmlFor={method.id}
                                                className="text-base font-medium cursor-pointer"
                                            >
                                                {method.type === 'credit_card' ? (
                                                    <span className="capitalize">
                                                        {method.brand} {formatCardNumber(method.last4)}
                                                    </span>
                                                ) : method.type === 'paypal' ? (
                                                    <span>PayPal ({method.email})</span>
                                                ) : (
                                                    <span className="capitalize">
                                                        {method.type.replace('_', ' ')}
                                                    </span>
                                                )}

                                                {method.is_default && (
                                                    <Badge variant="outline" className="ml-2 text-xs">
                                                        Default
                                                    </Badge>
                                                )}
                                            </Label>

                                            {method.type === 'credit_card' && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {method.holder_name} • Expires {formatExpiry(method.exp_month, method.exp_year)}
                                                </p>
                                            )}

                                            {method.type === 'cash' && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    Pay with cash upon delivery
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <CheckCircle className="w-5 h-5 text-primary mt-1" />
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Add New Payment Method */}
                    <div className="relative">
                        <div
                            className="flex items-start space-x-4 p-4 rounded-lg border border-dashed hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                        >
                            <div className="w-5 h-5 mt-1" /> {/* Placeholder for radio button alignment */}
                            <div className="flex items-center flex-1">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                                    <Plus className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-base font-medium">Add New Payment Method</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Add a new card or payment option
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </RadioGroup>

                {/* Security Note */}
                <div className="mt-6 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Lock className="w-4 h-4 mr-1" />
                    <p>Your payment information is encrypted and secure.</p>
                </div>
            </div>

            <Separator className="my-8" />

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add a Tip</h2>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="w-5 h-5 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>100% of your tip goes to the delivery driver</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Show your appreciation for excellent service
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {tipOptions.map((option) => (
                        <motion.button
                            key={option}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTipSelect(option)}
                            className={cn(
                                "px-6 py-3 rounded-full border font-medium text-base transition-all",
                                tipAmount === option && !showCustomTipInput
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-primary/70"
                            )}
                        >
                            {option === 0 ? 'No Tip' : `$${option.toFixed(2)}`}
                        </motion.button>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTipSelect('custom')}
                        className={cn(
                            "px-6 py-3 rounded-full border font-medium text-base transition-all",
                            showCustomTipInput
                                ? "bg-primary text-white border-primary"
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-primary/70"
                        )}
                    >
                        Custom
                    </motion.button>
                </div>

                {showCustomTipInput && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                    >
                        <Label htmlFor="custom-tip" className="text-sm mb-2 block">
                            Enter custom tip amount ($)
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-gray-500">$</span>
                            </div>
                            <Input
                                id="custom-tip"
                                type="text"
                                value={customTip}
                                onChange={handleCustomTipChange}
                                placeholder="0.00"
                                className="pl-8"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Driver Note */}
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg">
                    <div className="flex items-start">
                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-300">
                                Support Your Delivery Driver
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                                Your delivery driver goes the extra mile to ensure your food arrives hot and fresh.
                                A tip is a great way to show your appreciation for their service.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentStep; 