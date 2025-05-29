import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Wallet,
    DollarSign,
    Plus,
    CheckCircle2,
    Shield
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { cn } from '@/lib/utils';

const PaymentMethods = ({
    methods = [],
    selectedMethod = null,
    onSelectMethod
}) => {
    const [showAddCardForm, setShowAddCardForm] = useState(false);
    const [newCard, setNewCard] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: '',
        save: true
    });

    // Default payment methods if none provided
    const defaultMethods = [
        {
            id: 'card-visa',
            title: 'Visa ending in 4242',
            type: 'card',
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025,
            is_default: true
        },
        {
            id: 'card-mastercard',
            title: 'Mastercard ending in 5555',
            type: 'card',
            brand: 'mastercard',
            last4: '5555',
            exp_month: 8,
            exp_year: 2024
        },
        {
            id: 'paypal',
            title: 'PayPal',
            type: 'paypal',
            email: 'user@example.com'
        },
        {
            id: 'cash',
            title: 'Cash on Delivery',
            type: 'cash'
        }
    ];

    const displayMethods = methods?.length > 0 ? methods : defaultMethods;
    const selected = selectedMethod?.id ? selectedMethod : displayMethods.find(method => method.is_default) || displayMethods[0];

    const handleNewCardSubmit = (e) => {
        e.preventDefault();

        // In a real app, this would send the data to the server
        // For demo purposes, we'll just close the form
        setShowAddCardForm(false);

        // Reset form
        setNewCard({
            name: '',
            number: '',
            expiry: '',
            cvv: '',
            save: true
        });
    };

    const getMethodIcon = (type, brand) => {
        if (type === 'card') {
            return CreditCard;
        } else if (type === 'paypal') {
            return Wallet;
        } else if (type === 'cash') {
            return DollarSign;
        }
        return CreditCard;
    };

    const getCardBrandImage = (brand) => {
        switch (brand) {
            case 'visa':
                return '/images/payment/visa.svg';
            case 'mastercard':
                return '/images/payment/mastercard.svg';
            case 'amex':
                return '/images/payment/amex.svg';
            case 'discover':
                return '/images/payment/discover.svg';
            default:
                return '/images/payment/generic-card.svg';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Payment Method</h2>

                <Dialog open={showAddCardForm} onOpenChange={setShowAddCardForm}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Card</span>
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Card</DialogTitle>
                            <DialogDescription>
                                Enter your card details to save it for future purchases.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleNewCardSubmit} className="space-y-4 mt-4">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="card-name">Name on Card</Label>
                                    <Input
                                        id="card-name"
                                        placeholder="John Doe"
                                        value={newCard.name}
                                        onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input
                                        id="card-number"
                                        placeholder="1234 5678 9012 3456"
                                        value={newCard.number}
                                        onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="card-expiry">Expiration Date</Label>
                                        <Input
                                            id="card-expiry"
                                            placeholder="MM/YY"
                                            value={newCard.expiry}
                                            onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="card-cvv">CVV</Label>
                                        <Input
                                            id="card-cvv"
                                            placeholder="123"
                                            type="password"
                                            value={newCard.cvv}
                                            onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="save-card"
                                        checked={newCard.save}
                                        onChange={(e) => setNewCard({ ...newCard, save: e.target.checked })}
                                        className="text-primary focus:ring-primary"
                                    />
                                    <Label htmlFor="save-card" className="cursor-pointer">
                                        Save this card for future purchases
                                    </Label>
                                </div>
                            </div>

                            <div className="flex items-center justify-center text-xs text-gray-500 gap-1 mt-4">
                                <Shield className="h-3 w-3" />
                                <span>Your payment information is secure and encrypted</span>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Add Card</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <RadioGroup
                defaultValue={selected?.id}
                value={selected?.id}
                onValueChange={(value) => {
                    const method = displayMethods.find(method => method.id === value);
                    if (method) {
                        onSelectMethod(method);
                    }
                }}
                className="space-y-3"
            >
                {displayMethods.map((method) => {
                    const Icon = getMethodIcon(method.type, method.brand);
                    const isSelected = selected?.id === method.id;

                    return (
                        <div
                            key={method.id}
                            className={cn(
                                "relative rounded-xl overflow-hidden",
                                "border transition-all duration-300 p-3",
                                isSelected
                                    ? "border-primary/70 ring-2 ring-primary/30 bg-primary/5 dark:bg-primary/10"
                                    : "border-gray-200 dark:border-gray-700 hover:border-primary/40"
                            )}
                        >
                            <RadioGroupItem
                                value={method.id}
                                id={method.id}
                                className="sr-only"
                            />

                            <Label
                                htmlFor={method.id}
                                className="flex items-center cursor-pointer"
                            >
                                {method.type === 'card' && method.brand ? (
                                    <div className="w-12 h-8 mr-3 flex items-center justify-center">
                                        <img
                                            src={getCardBrandImage(method.brand)}
                                            alt={method.brand}
                                            className="max-w-full max-h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                                        isSelected
                                            ? "bg-primary/10 text-primary"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                    )}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <span className="font-medium">{method.title}</span>

                                        {method.is_default && (
                                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    {method.type === 'card' && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            Expires {method.exp_month}/{method.exp_year}
                                        </div>
                                    )}

                                    {method.type === 'paypal' && method.email && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {method.email}
                                        </div>
                                    )}
                                </div>

                                {isSelected && (
                                    <CheckCircle2 className="h-5 w-5 text-primary ml-2" />
                                )}
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>

            <div className="flex items-center justify-center text-xs text-gray-500 gap-1 mt-6">
                <Shield className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                <span>All payments are secure and encrypted</span>
            </div>
        </motion.div>
    );
};

export default PaymentMethods; 