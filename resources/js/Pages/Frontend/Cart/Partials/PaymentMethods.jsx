import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Wallet,
    Banknote,
    Building,
    ChevronDown,
    Plus,
    Shield,
    AlertCircle,
    Check,
    RefreshCw,
    X
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/Components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/Components/ui/collapsible';
import { Badge } from '@/Components/ui/badge';
import { useToast } from '@/Components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/Components/ui/alert';

const PaymentMethodCard = ({ method, isSelected, onSelect }) => {
    const getIcon = () => {
        switch (method.type) {
            case 'credit_card':
                return CreditCard;
            case 'wallet':
                return Wallet;
            case 'cash':
                return Banknote;
            case 'bank':
                return Building;
            default:
                return CreditCard;
        }
    };

    const getStatusBadge = () => {
        if (method.is_default) {
            return (
                <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary border-primary/20">
                    Default
                </Badge>
            );
        }

        if (method.status === 'expired') {
            return (
                <Badge variant="outline" className="ml-2 text-xs bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50">
                    Expired
                </Badge>
            );
        }

        return null;
    };

    const PaymentIcon = getIcon();

    return (
        <div
            className={cn(
                "relative p-4 rounded-xl cursor-pointer transition-all duration-300",
                "border",
                isSelected
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-primary/50",
                "flex items-center",
                method.status === 'expired' && "opacity-60"
            )}
            onClick={() => method.status !== 'expired' && onSelect(method.id)}
        >
            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute top-1/2 -translate-y-1/2 left-4">
                    <div className="h-4 w-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                    </div>
                </div>
            )}

            <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center ml-6",
                isSelected ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            )}>
                <PaymentIcon className="h-5 w-5" />
            </div>

            <div className="flex-1 ml-4">
                <div className="flex items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                        {method.name}
                    </h3>
                    {getStatusBadge()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {method.description}
                </p>
            </div>
        </div>
    );
};

const AddCardForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        card_number: '',
        expiry: '',
        cvv: '',
        is_default: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let processedValue = value;

        // Format card number with spaces
        if (name === 'card_number') {
            processedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);
        }

        // Format expiry date with slash
        if (name === 'expiry') {
            const numbers = value.replace(/[^\d]/g, '');
            if (numbers.length <= 2) {
                processedValue = numbers;
            } else {
                processedValue = `${numbers.substring(0, 2)}/${numbers.substring(2, 4)}`;
            }
        }

        // Limit CVV to 3 or 4 digits
        if (name === 'cvv') {
            processedValue = value.replace(/[^\d]/g, '').substring(0, 4);
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : processedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!formData.name || !formData.card_number || !formData.expiry || !formData.cvv) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        // More specific validations
        if (formData.card_number.replace(/\s/g, '').length < 16) {
            toast({
                title: "Invalid Card Number",
                description: "Please enter a valid 16-digit card number",
                variant: "destructive",
            });
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
            toast({
                title: "Invalid Expiry Date",
                description: "Please enter a valid expiry date (MM/YY)",
                variant: "destructive",
            });
            return;
        }

        if (formData.cvv.length < 3) {
            toast({
                title: "Invalid CVV",
                description: "Please enter a valid CVV code",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            // In a real app, you would submit to an API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Create a masked version for display
            const maskedCardNumber = `**** **** **** ${formData.card_number.slice(-4)}`;

            // Call the onSave callback with processed data
            onSave({
                id: Date.now().toString(),
                type: 'credit_card',
                name: `${formData.name}'s Card`,
                description: maskedCardNumber,
                is_default: formData.is_default,
                status: 'active',
                card: {
                    last4: formData.card_number.slice(-4),
                    brand: detectCardBrand(formData.card_number),
                    exp_month: formData.expiry.split('/')[0],
                    exp_year: `20${formData.expiry.split('/')[1]}`,
                }
            });

            toast({
                title: "Card Added",
                description: "Your payment method has been added",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add payment method. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Simple function to detect card brand based on first digits
    const detectCardBrand = (cardNumber) => {
        const number = cardNumber.replace(/\s+/g, '');
        let brand = 'unknown';

        // Very simplified detection logic
        if (/^4/.test(number)) brand = 'visa';
        else if (/^5[1-5]/.test(number)) brand = 'mastercard';
        else if (/^3[47]/.test(number)) brand = 'amex';
        else if (/^6(?:011|5)/.test(number)) brand = 'discover';

        return brand;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name">Cardholder Name</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <Label htmlFor="card_number">Card Number</Label>
                <Input
                    id="card_number"
                    name="card_number"
                    placeholder="1234 5678 9012 3456"
                    value={formData.card_number}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleChange}
                        type="password"
                        required
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="is_default"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="is_default" className="text-sm font-normal">
                    Save as default payment method
                </Label>
            </div>

            <Alert className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-500" />
                <AlertDescription className="text-gray-700 dark:text-gray-300 text-sm">
                    Your payment information is encrypted and secure
                </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Add Card
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};

const PaymentMethods = ({ methods = [], onMethodSelect, selectedMethodId = null }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(selectedMethodId);
    const { toast } = useToast();

    // Ensure methods is an array
    const safeMethods = Array.isArray(methods) ? methods : [];

    // Find the default method if no method is selected
    const defaultMethod = safeMethods.find(m => m.is_default && m.status !== 'expired');

    // Set selected method to default if none is selected
    React.useEffect(() => {
        if (!selectedId && defaultMethod) {
            setSelectedId(defaultMethod.id);
            if (onMethodSelect) onMethodSelect(defaultMethod.id);
        }
    }, [defaultMethod, selectedId, onMethodSelect]);

    const handleSelect = (methodId) => {
        setSelectedId(methodId);
        if (onMethodSelect) onMethodSelect(methodId);
    };

    const handleAddMethod = (newMethod) => {
        // In a real app, you would update state through a proper state management system
        console.log('Added new payment method:', newMethod);
        setIsAddDialogOpen(false);

        // If it's set as default, select it
        if (newMethod.is_default) {
            handleSelect(newMethod.id);
        }
    };

    if (safeMethods.length === 0) {
        return (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Payment Method</CardTitle>
                    <CardDescription>Add a payment method for your order</CardDescription>
                </CardHeader>

                <CardContent className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <CreditCard className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Payment Methods</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Please add a payment method to complete your order.
                    </p>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Payment Method
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add Payment Method</DialogTitle>
                                <DialogDescription>
                                    Enter your card details below
                                </DialogDescription>
                            </DialogHeader>

                            <AddCardForm
                                onSave={handleAddMethod}
                                onCancel={() => setIsAddDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Payment Method</CardTitle>
                        <CardDescription>Select how you want to pay</CardDescription>
                    </div>
                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 p-0">
                                <ChevronDown className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    isOpen ? "rotate-180" : "rotate-0"
                                )} />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <CardContent className="pt-2">
                                <div className="space-y-3">
                                    <RadioGroup
                                        defaultValue={selectedId || defaultMethod?.id || safeMethods[0]?.id}
                                        value={selectedId}
                                        onValueChange={handleSelect}
                                        className="space-y-3"
                                    >
                                        {safeMethods.map(method => (
                                            <PaymentMethodCard
                                                key={method.id}
                                                method={method}
                                                isSelected={selectedId === method.id}
                                                onSelect={handleSelect}
                                            />
                                        ))}
                                    </RadioGroup>

                                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full mt-4">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add New Card
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Add Payment Method</DialogTitle>
                                                <DialogDescription>
                                                    Enter your card details below
                                                </DialogDescription>
                                            </DialogHeader>

                                            <AddCardForm
                                                onSave={handleAddMethod}
                                                onCancel={() => setIsAddDialogOpen(false)}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </CardHeader>
        </Card>
    );
};

export default PaymentMethods; 