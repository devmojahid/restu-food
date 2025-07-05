import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, MapPin, Plus, Clock, Home, Briefcase, FileEdit } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import { Label } from '@/Components/ui/label';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';

const ShippingSection = ({
    isOpen,
    toggleSection,
    onComplete,
    addresses = [],
    deliveryOptions = [],
    selectedAddress = null,
    selectedDeliveryOption = null,
    isComplete = false,
    errors = {}
}) => {
    const [localSelectedAddress, setLocalSelectedAddress] = useState(selectedAddress);
    const [localSelectedDeliveryOption, setLocalSelectedDeliveryOption] = useState(selectedDeliveryOption);
    const [addingNewAddress, setAddingNewAddress] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    // Handle address selection
    const handleAddressSelection = (address) => {
        setLocalSelectedAddress(address);
        setLocalErrors((prev) => ({ ...prev, address: null }));
    };

    // Handle delivery option selection
    const handleDeliveryOptionSelection = (option) => {
        setLocalSelectedDeliveryOption(option);
        setLocalErrors((prev) => ({ ...prev, deliveryOption: null }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!localSelectedAddress) {
            validationErrors.address = 'Please select a delivery address';
        }
        if (!localSelectedDeliveryOption) {
            validationErrors.deliveryOption = 'Please select a delivery option';
        }

        if (Object.keys(validationErrors).length > 0) {
            setLocalErrors(validationErrors);
            return;
        }

        onComplete(localSelectedAddress, localSelectedDeliveryOption);
    };

    // Address icon based on type
    const getAddressIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'home':
                return <Home className="h-4 w-4" />;
            case 'work':
                return <Briefcase className="h-4 w-4" />;
            default:
                return <MapPin className="h-4 w-4" />;
        }
    };

    // Display selected address summary
    const getSelectedAddressSummary = () => {
        if (!selectedAddress) return 'No address selected';

        return (
            <>
                {selectedAddress.name} • {selectedAddress.address_line_1}, {selectedAddress.city}
                {selectedDeliveryOption && (
                    <Badge variant="outline" className="ml-2">
                        {selectedDeliveryOption.name}
                    </Badge>
                )}
            </>
        );
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
                                <MapPin className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-medium text-lg">Shipping</h3>
                            {!isOpen && isComplete && (
                                <p className="text-sm text-gray-500">
                                    {getSelectedAddressSummary()}
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
                            <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-6 bg-white">
                                {/* Shipping Address Selection */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium">Shipping Address</h4>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAddingNewAddress(!addingNewAddress)}
                                            className="text-xs"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            {addingNewAddress ? 'Cancel' : 'Add New Address'}
                                        </Button>
                                    </div>

                                    {/* New Address Form (would be implemented in a real app) */}
                                    {addingNewAddress && (
                                        <Card className="mb-4">
                                            <CardContent className="p-4 space-y-4">
                                                <div className="text-center text-gray-500 py-4">
                                                    <p>Address form would be implemented here in a real application</p>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-3"
                                                        onClick={() => setAddingNewAddress(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Existing Addresses */}
                                    {addresses.length > 0 ? (
                                        <div>
                                            <RadioGroup
                                                value={localSelectedAddress?.id?.toString() || ''}
                                                onValueChange={(value) => {
                                                    const address = addresses.find(a => a.id.toString() === value);
                                                    handleAddressSelection(address);
                                                }}
                                                className="space-y-3"
                                            >
                                                {addresses.map((address) => (
                                                    <div
                                                        key={address.id}
                                                        className={cn(
                                                            "flex items-center border rounded-lg p-4 cursor-pointer",
                                                            localSelectedAddress?.id === address.id ? "border-primary bg-primary-50" : "border-gray-200"
                                                        )}
                                                        onClick={() => handleAddressSelection(address)}
                                                    >
                                                        <RadioGroupItem
                                                            value={address.id.toString()}
                                                            id={`address-${address.id}`}
                                                            className="mr-3"
                                                        />
                                                        <div className="flex flex-1">
                                                            <div className="ml-1 flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center">
                                                                        <Label htmlFor={`address-${address.id}`} className="font-medium">
                                                                            {address.name}
                                                                        </Label>
                                                                        {address.is_default && (
                                                                            <Badge variant="outline" size="sm" className="ml-2 text-xs">
                                                                                Default
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs flex items-center"
                                                                    >
                                                                        {getAddressIcon(address.type)}
                                                                        <span className="ml-1 capitalize">{address.type || 'Other'}</span>
                                                                    </Badge>
                                                                </div>
                                                                <div className="text-sm text-gray-500 mt-1">
                                                                    <p>
                                                                        {address.address_line_1}
                                                                        {address.address_line_2 && (
                                                                            <>, {address.address_line_2}</>
                                                                        )}
                                                                    </p>
                                                                    <p>{address.city}, {address.state} {address.postal_code}</p>
                                                                    <p className="mt-1">{address.phone}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 text-gray-500"
                                                                >
                                                                    <FileEdit className="h-4 w-4" />
                                                                    <span className="sr-only">Edit</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            {(localErrors.address || errors.shipping_address_id) && (
                                                <p className="text-sm text-red-500 mt-2">
                                                    {localErrors.address || errors.shipping_address_id}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 border border-dashed rounded-lg">
                                            <MapPin className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                            <p className="text-gray-500">No saved addresses. Please add a new address.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Delivery Options */}
                                <div className="pt-2">
                                    <h4 className="font-medium mb-3">Delivery Options</h4>

                                    {deliveryOptions.length > 0 ? (
                                        <div>
                                            <RadioGroup
                                                value={localSelectedDeliveryOption?.id || ''}
                                                onValueChange={(value) => {
                                                    const option = deliveryOptions.find(o => o.id === value);
                                                    handleDeliveryOptionSelection(option);
                                                }}
                                                className="space-y-3"
                                            >
                                                {deliveryOptions.map((option) => (
                                                    <div
                                                        key={option.id}
                                                        className={cn(
                                                            "flex items-center border rounded-lg p-4 cursor-pointer",
                                                            localSelectedDeliveryOption?.id === option.id ? "border-primary bg-primary-50" : "border-gray-200"
                                                        )}
                                                        onClick={() => handleDeliveryOptionSelection(option)}
                                                    >
                                                        <RadioGroupItem
                                                            value={option.id}
                                                            id={`delivery-${option.id}`}
                                                            className="mr-3"
                                                        />
                                                        <div className="flex flex-1 items-center">
                                                            <div className="ml-1 flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <Label htmlFor={`delivery-${option.id}`} className="font-medium">
                                                                        {option.name}
                                                                    </Label>
                                                                    <span className="font-semibold">
                                                                        ${option.price.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                                                    <Clock className="h-3 w-3 mr-1" />
                                                                    <span>{option.description}</span>
                                                                </div>
                                                                {option.min_order_free_delivery && (
                                                                    <div className="text-xs text-primary-600 mt-1">
                                                                        Free on orders over ${option.min_order_free_delivery.toFixed(2)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            {(localErrors.deliveryOption || errors.delivery_option_id) && (
                                                <p className="text-sm text-red-500 mt-2">
                                                    {localErrors.deliveryOption || errors.delivery_option_id}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center p-6 border border-dashed rounded-lg">
                                            <Clock className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                                            <p className="text-gray-500">No delivery options available</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={!localSelectedAddress || !localSelectedDeliveryOption}
                                    >
                                        Continue to Payment
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

export default ShippingSection; 