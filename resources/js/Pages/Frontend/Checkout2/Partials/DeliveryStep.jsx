import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Building,
    Briefcase,
    PlusCircle,
    Check,
    MapPin,
    Clock,
    Phone,
    Info,
    CalendarDays,
    CircleDot
} from 'lucide-react';
import {
    RadioGroup,
    RadioGroupItem
} from "@/Components/ui/radio-group";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { cn } from '@/lib/utils';

const DeliveryStep = ({
    addresses = [],
    selectedAddress = null,
    onAddressSelect,
    deliveryOptions = [],
    selectedDeliveryOption = null,
    onDeliveryOptionSelect
}) => {
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [selectedDay, setSelectedDay] = useState('today');
    const [selectedTime, setSelectedTime] = useState('');
    const [showScheduleOptions, setShowScheduleOptions] = useState(false);

    // Get appropriate icon for an address type
    const getAddressIcon = (addressName) => {
        const name = addressName?.toLowerCase() || '';
        if (name.includes('home')) return Home;
        if (name.includes('work') || name.includes('office')) return Briefcase;
        if (name.includes('gym') || name.includes('school')) return Building;
        return MapPin;
    };

    // Handle scheduled time selection
    const handleScheduledTimeChange = (value) => {
        setSelectedTime(value);
    };

    // Handle scheduled day selection
    const handleScheduledDayChange = (value) => {
        setSelectedDay(value);
        setSelectedTime(''); // Reset time when day changes
    };

    // Get available schedule options for the selected delivery option
    const getScheduleOptions = () => {
        if (selectedDeliveryOption?.id === 'scheduled' && selectedDeliveryOption?.available_times) {
            return selectedDeliveryOption.available_times[selectedDay] || [];
        }
        return [];
    };

    // Toggle schedule options visibility when "Scheduled Delivery" is selected
    React.useEffect(() => {
        if (selectedDeliveryOption?.id === 'scheduled') {
            setShowScheduleOptions(true);
        } else {
            setShowScheduleOptions(false);
        }
    }, [selectedDeliveryOption]);

    return (
        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
            <div className="space-y-8">
                {/* Step Title */}
                <div>
                    <h2 className="text-2xl font-bold mb-1">Delivery Information</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Select your delivery address and preferred delivery method
                    </p>
                </div>

                {/* Addresses Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Delivery Address</h3>

                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => setIsAddingAddress(true)}
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Add New</span>
                            </Button>
                        </DialogTrigger>
                    </div>

                    {/* Address Selection */}
                    {addresses.length > 0 ? (
                        <RadioGroup
                            value={selectedAddress?.id?.toString() || ""}
                            onValueChange={(value) => onAddressSelect(parseInt(value))}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {addresses.map((address) => {
                                const AddressIcon = getAddressIcon(address.name);
                                const isSelected = selectedAddress?.id === address.id;

                                return (
                                    <motion.div
                                        key={address.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Label
                                            htmlFor={`address-${address.id}`}
                                            className={cn(
                                                "cursor-pointer block h-full",
                                                isSelected && "cursor-default"
                                            )}
                                        >
                                            <Card className={cn(
                                                "h-full transition-all duration-200 hover:border-primary/50",
                                                isSelected && "border-primary ring-1 ring-primary bg-primary/5"
                                            )}>
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-full flex items-center justify-center",
                                                                isSelected ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-800"
                                                            )}>
                                                                <AddressIcon className="w-4 h-4" />
                                                            </div>
                                                            <CardTitle className="text-base font-semibold">
                                                                {address.name}
                                                            </CardTitle>
                                                        </div>

                                                        <RadioGroupItem
                                                            id={`address-${address.id}`}
                                                            value={address.id.toString()}
                                                            className="mt-1"
                                                        />
                                                    </div>

                                                    {address.is_default && (
                                                        <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                                                            Default
                                                        </Badge>
                                                    )}
                                                </CardHeader>

                                                <CardContent className="pb-4 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                                    <p>{address.address_line1}</p>
                                                    {address.address_line2 && <p>{address.address_line2}</p>}
                                                    <p>
                                                        {address.city}, {address.state} {address.zipcode}
                                                    </p>
                                                    <p>{address.country}</p>

                                                    <div className="flex items-center gap-2 pt-2 text-xs text-gray-500">
                                                        <Phone className="w-3 h-3" />
                                                        <span>{address.phone}</span>
                                                    </div>

                                                    {address.instructions && (
                                                        <div className="flex items-start gap-2 pt-1 text-xs text-gray-500">
                                                            <Info className="w-3 h-3 mt-0.5" />
                                                            <span>{address.instructions}</span>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Label>
                                    </motion.div>
                                );
                            })}
                        </RadioGroup>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                            <h4 className="text-lg font-medium mb-1">No addresses found</h4>
                            <p className="text-gray-500 mb-4">
                                Add a new address to continue with your order
                            </p>
                            <Button
                                onClick={() => setIsAddingAddress(true)}
                                className="flex items-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Add New Address
                            </Button>
                        </div>
                    )}
                </div>

                {/* Delivery Options Section */}
                {selectedAddress && (
                    <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                        <h3 className="text-lg font-semibold">Delivery Method</h3>

                        {/* Delivery Options */}
                        <RadioGroup
                            value={selectedDeliveryOption?.id || ""}
                            onValueChange={onDeliveryOptionSelect}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {deliveryOptions.map((option) => {
                                const isSelected = selectedDeliveryOption?.id === option.id;

                                return (
                                    <motion.div
                                        key={option.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Label
                                            htmlFor={`option-${option.id}`}
                                            className="cursor-pointer block h-full"
                                        >
                                            <Card className={cn(
                                                "h-full transition-all duration-200 hover:border-primary/50",
                                                isSelected && "border-primary ring-1 ring-primary bg-primary/5"
                                            )}>
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-start justify-between">
                                                        <CardTitle className="text-base font-semibold">
                                                            {option.name}
                                                        </CardTitle>
                                                        <RadioGroupItem
                                                            id={`option-${option.id}`}
                                                            value={option.id}
                                                        />
                                                    </div>
                                                </CardHeader>

                                                <CardContent className="space-y-3 pb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span>{option.description}</span>
                                                    </div>

                                                    <div className="font-medium">
                                                        ${option.price.toFixed(2)}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Label>
                                    </motion.div>
                                );
                            })}
                        </RadioGroup>

                        {/* Scheduled Delivery Options */}
                        <AnimatePresence>
                            {showScheduleOptions && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="border dark:border-gray-700 rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50"
                                >
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="w-5 h-5 text-primary" />
                                        <h4 className="text-base font-medium">Choose delivery time</h4>
                                    </div>

                                    {/* Day Selection */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {['today', 'tomorrow', 'day_after_tomorrow'].map((day) => (
                                            <Button
                                                key={day}
                                                type="button"
                                                variant={selectedDay === day ? "default" : "outline"}
                                                onClick={() => handleScheduledDayChange(day)}
                                            >
                                                {day === 'today'
                                                    ? 'Today'
                                                    : day === 'tomorrow'
                                                        ? 'Tomorrow'
                                                        : 'Later'}
                                            </Button>
                                        ))}
                                    </div>

                                    {/* Time Selection */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {getScheduleOptions().map((time) => (
                                            <Button
                                                key={time}
                                                type="button"
                                                variant={selectedTime === time ? "default" : "outline"}
                                                onClick={() => handleScheduledTimeChange(time)}
                                                className="text-sm"
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </div>

                                    {selectedTime && (
                                        <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary p-3 rounded-md">
                                            <CircleDot className="w-4 h-4" />
                                            <span>
                                                {selectedDay === 'today'
                                                    ? 'Today'
                                                    : selectedDay === 'tomorrow'
                                                        ? 'Tomorrow'
                                                        : 'In 2 days'}, {selectedTime}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Add New Address Dialog */}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add a new address</DialogTitle>
                    <DialogDescription>
                        Enter your address details below
                    </DialogDescription>
                </DialogHeader>

                {/* New address form would go here in a real implementation */}
                <div className="grid gap-4 py-4">
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            This is a demo implementation. In a real application, a form would be here.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingAddress(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => setIsAddingAddress(false)}>
                        Save Address
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeliveryStep;