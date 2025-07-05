import React, { useState } from 'react';
import {
    CreditCard,
    PlusCircle,
    DollarSign,
    CheckCircle,
    Wallet,
    Shield,
    Coins
} from 'lucide-react';

// Custom PayPal icon as it's not included in Lucide
const PaypalIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-paypal"
    >
        <path d="M7 19H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
        <path d="M7 5a4 4 0 0 1 4 4 4 4 0 0 1-4 4H7" />
        <path d="M16 15h5a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-5" />
        <path d="M16 5a4 4 0 0 0-4 4 4 4 0 0 0 4 4h0" />
    </svg>
);

// Custom ApplePay icon
const ApplePayIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 4a4 4 0 0 0-4 4c0 2.2 1.8 4 4 4a4 4 0 0 0 4-4 4 4 0 0 0-4-4z" />
        <path d="M9 20h6" />
        <path d="M12 12v8" />
    </svg>
);

const PaymentStep = ({
    paymentMethods = [],
    selectedPaymentMethod = null,
    onPaymentMethodSelect,
    tipAmount = 0,
    onTipChange,
    tipOptions = [0, 2, 3, 5, 10]
}) => {
    const [isAddingPayment, setIsAddingPayment] = useState(false);
    const [customTip, setCustomTip] = useState('');
    const [activeTab, setActiveTab] = useState('payment');

    // Handle custom tip input change
    const handleCustomTipChange = (e) => {
        const value = e.target.value;
        // Only allow numbers and decimals
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setCustomTip(value);

            // If value is empty, set tip to 0, otherwise parse as float
            if (value === '') {
                onTipChange(0);
            } else {
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    onTipChange(numValue);
                }
            }
        }
    };

    // Handle selecting a pre-defined tip amount
    const handleTipSelect = (amount) => {
        onTipChange(amount);
        setCustomTip('');
    };

    // Get appropriate icon for a payment method
    const getCardIcon = (cardType, brand) => {
        switch (cardType) {
            case 'paypal':
                return <PaypalIcon className="w-6 h-6" />;
            case 'apple_pay':
                return <ApplePayIcon className="w-6 h-6" />;
            case 'cash':
                return <DollarSign className="w-6 h-6" />;
            case 'card':
                switch (brand?.toLowerCase()) {
                    case 'visa':
                        return (
                            <div className="text-blue-700 font-bold text-lg">VISA</div>
                        );
                    case 'mastercard':
                        return (
                            <div className="text-red-600 font-bold text-lg">MC</div>
                        );
                    case 'amex':
                        return (
                            <div className="text-blue-500 font-bold text-lg">AMEX</div>
                        );
                    default:
                        return <CreditCard className="w-6 h-6" />;
                }
            default:
                return <CreditCard className="w-6 h-6" />;
        }
    };

    // Format card number to show only last 4 digits
    const formatCardNumber = (last4) => {
        return `•••• •••• •••• ${last4 || '0000'}`;
    };

    // Format expiry date
    const formatExpiry = (month, year) => {
        return `${month || '00'}/${year || '00'}`;
    };

    return (
        <div className="space-y-8">
            {/* Step Title */}
            <div>
                <h2 className="text-2xl font-bold mb-1">Payment Method</h2>
                <p className="text-gray-600">
                    Choose how you want to pay for your order
                </p>
            </div>

            {/* Tabs for Payment Method and Tipping */}
            <div className="w-full">
                <div className="flex w-full rounded-lg bg-gray-100 p-1 mb-6">
                    <button
                        onClick={() => setActiveTab('payment')}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'payment'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Payment Method
                    </button>
                    <button
                        onClick={() => setActiveTab('tip')}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'tip'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Add a Tip
                    </button>
                </div>

                {/* Payment Methods Tab */}
                {activeTab === 'payment' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Select Payment Method</h3>

                            <button
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                                onClick={() => setIsAddingPayment(true)}
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Add New</span>
                            </button>
                        </div>

                        {/* Payment Method Selection */}
                        {paymentMethods.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {paymentMethods.map((method) => {
                                    const isSelected = selectedPaymentMethod?.id === method.id;

                                    return (
                                        <div
                                            key={method.id}
                                            className="transition-transform hover:scale-105"
                                        >
                                            <label
                                                htmlFor={`method-${method.id}`}
                                                className="cursor-pointer block h-full"
                                            >
                                                <div className={`h-full p-4 rounded-lg border-2 transition-all duration-200 hover:border-blue-300 ${isSelected
                                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                                    : 'border-gray-200 bg-white'
                                                    }`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.type === 'card'
                                                                ? "bg-blue-100 text-blue-600"
                                                                : method.type === 'paypal'
                                                                    ? "bg-blue-500/10 text-blue-500"
                                                                    : method.type === 'apple_pay'
                                                                        ? "bg-gray-900 text-white"
                                                                        : "bg-green-100 text-green-600"
                                                                }`}>
                                                                {getCardIcon(method.type, method.brand)}
                                                            </div>

                                                            <div className="flex flex-col">
                                                                <h4 className="text-base font-semibold mb-1">
                                                                    {method.type === 'card'
                                                                        ? `${method.brand} ${formatCardNumber(method.last4)}`
                                                                        : method.type === 'paypal'
                                                                            ? `PayPal (${method.email})`
                                                                            : method.type === 'apple_pay'
                                                                                ? 'Apple Pay'
                                                                                : 'Cash on Delivery'}
                                                                </h4>

                                                                {method.type === 'card' && (
                                                                    <div className="text-xs text-gray-500">
                                                                        Expires {formatExpiry(method.exp_month, method.exp_year)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <input
                                                            type="radio"
                                                            id={`method-${method.id}`}
                                                            name="payment-method"
                                                            value={method.id}
                                                            checked={isSelected}
                                                            onChange={() => onPaymentMethodSelect(method.id)}
                                                            className="w-4 h-4 text-blue-600"
                                                        />
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                                <h4 className="text-lg font-medium mb-1">No payment methods found</h4>
                                <p className="text-gray-500 mb-4">
                                    Add a new payment method to continue with your order
                                </p>
                                <button
                                    onClick={() => setIsAddingPayment(true)}
                                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add New Payment Method
                                </button>
                            </div>
                        )}

                        {/* Payment Security Notice */}
                        <div className="text-sm text-gray-500 border-t pt-4">
                            <p className="flex items-center">
                                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                                <span>All transactions are secure and encrypted.</span>
                            </p>
                        </div>
                    </div>
                )}

                {/* Tipping Tab */}
                {activeTab === 'tip' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Add a Tip for Your Delivery Person</h3>
                            <p className="text-gray-600 text-sm">
                                100% of your tip goes directly to your delivery person.
                            </p>
                        </div>

                        {/* Tip Selection */}
                        <div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                                {tipOptions.map((amount) => (
                                    <button
                                        key={`tip-${amount}`}
                                        type="button"
                                        onClick={() => handleTipSelect(amount)}
                                        className={`relative h-20 px-4 py-2 rounded-lg border-2 transition-all hover:scale-105 ${tipAmount === amount
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-bold">${amount}</span>
                                            {amount > 0 && (
                                                <span className="text-xs text-gray-500 mt-1">
                                                    {Math.round(amount / 5 * 100)}% of order
                                                </span>
                                            )}
                                        </div>

                                        {tipAmount === amount && (
                                            <div className="absolute top-2 right-2">
                                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                            </div>
                                        )}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => {
                                        handleTipSelect(0);
                                        setActiveTab("payment");
                                    }}
                                    className="h-20 px-4 py-2 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 hover:scale-105 transition-all"
                                >
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg font-bold">No Tip</span>
                                        <span className="text-xs text-gray-500 mt-1">
                                            Skip
                                        </span>
                                    </div>
                                </button>
                            </div>

                            {/* Custom Tip Input */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <label htmlFor="custom-tip" className="mb-2 block font-medium">
                                    Custom Tip Amount
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            id="custom-tip"
                                            type="text"
                                            placeholder="Enter custom amount"
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={customTip}
                                            onChange={handleCustomTipChange}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (customTip) {
                                                const amount = parseFloat(customTip);
                                                if (!isNaN(amount)) {
                                                    onTipChange(amount);
                                                }
                                            }
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tip Appreciation Message */}
                        {tipAmount > 0 && (
                            <div className="p-4 border border-green-200 bg-green-50 rounded-lg text-green-700 flex items-start gap-3">
                                <Coins className="w-5 h-5 mt-0.5" />
                                <div>
                                    <p className="font-medium">Thank you for your generosity!</p>
                                    <p className="text-sm mt-1">Your ${tipAmount.toFixed(2)} tip makes a big difference to delivery workers.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add New Payment Method Modal */}
            {isAddingPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Add a new payment method</h3>
                            <p className="text-gray-600 text-sm mt-1">
                                Enter your payment details below
                            </p>
                        </div>

                        <div className="py-8 text-center">
                            <p className="text-gray-500">
                                This is a demo implementation. In a real application, a payment form would be here.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsAddingPayment(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsAddingPayment(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Save Payment Method
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentStep;