import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    MapPin,
    Edit,
    Trash2,
    CheckCircle,
    Clock,
    CalendarClock,
    Home,
    Building2,
    Briefcase,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { Badge } from '@/Components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/Components/ui/tooltip';

const DeliveryStep = ({
    addresses = [],
    selectedAddress = null,
    onAddressSelect,
    deliveryOptions = [],
    selectedDeliveryOption = null,
    onDeliveryOptionSelect
}) => {
    const [scheduledTime, setScheduledTime] = useState('');
    const [scheduledDay, setScheduledDay] = useState('today');

    // Function to get address icon based on address name
    const getAddressIcon = (addressName) => {
        const name = addressName?.toLowerCase() || '';
        if (name.includes('home')) return Home;
        if (name.includes('apartment')) return Building2;
        if (name.includes('work') || name.includes('office')) return Briefcase;
        return MapPin;
    };

    // Handle scheduled delivery time selection
    const handleScheduledTimeChange = (value) => {
        setScheduledTime(value);
    };

    // Handle scheduled delivery day selection
    const handleScheduledDayChange = (value) => {
        setScheduledDay(value);
        setScheduledTime(''); // Reset time when day changes
    };

    // Get the selected delivery option's schedule options
    const getScheduleOptions = () => {
        const option = deliveryOptions.find(opt => opt.id === 'scheduled');
        return option?.schedule_options || {
            today: [],
            tomorrow: []
        };
    };

    // Check if the selected delivery option is scheduled
    const isScheduledDelivery = selectedDeliveryOption === 'scheduled';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => {
                        const isSelected = selectedAddress === address.id;
                        const AddressIcon = getAddressIcon(address.name);

                        return (
                            <motion.div
                                key={address.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className={cn(
                                        "cursor-pointer transition-all duration-200 h-full",
                                        "hover:border-primary/50 hover:shadow-md",
                                        isSelected && "border-primary ring-1 ring-primary/20"
                                    )}
                                    onClick={() => onAddressSelect(address.id)}
                                >
                                    <CardHeader className="pb-2 flex flex-row items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <AddressIcon className={cn(
                                                    "w-5 h-5",
                                                    isSelected ? "text-primary" : "text-gray-500 dark:text-gray-400"
                                                )} />
                                                <CardTitle className="text-lg">{address.name}</CardTitle>
                                                {address.is_default && (
                                                    <Badge variant="outline" className="ml-2 text-xs">
                                                        Default
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription>{address.recipient}</CardDescription>
                                        </div>
                                        {isSelected && (
                                            <CheckCircle className="w-5 h-5 text-primary" />
                                        )}
                                    </CardHeader>
                                    <CardContent className="pb-4">
                                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <p>{address.address_line1}</p>
                                            {address.address_line2 && <p>{address.address_line2}</p>}
                                            <p>{address.city}, {address.state} {address.postal_code}</p>
                                            <p>{address.country}</p>
                                            <p className="font-medium mt-2">{address.phone}</p>
                                        </div>
                                        {address.delivery_instructions && (
                                            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                <p className="font-medium mb-1">Delivery Instructions:</p>
                                                <p>{address.delivery_instructions}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="pt-0 flex justify-end">
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="ghost">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}

                    {/* Add New Address Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Card className="border-dashed border-2 cursor-pointer h-full flex flex-col justify-center items-center p-6 hover:border-primary/50 transition-colors">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Plus className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Add New Address</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Add a new delivery location
                                </p>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>

            <Separator className="my-8" />

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Delivery Options</h2>
                    {isScheduledDelivery && scheduledTime && (
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                            <CalendarClock className="w-3 h-3 mr-1" />
                            {scheduledDay === 'today' ? 'Today' : 'Tomorrow'}, {scheduledTime}
                        </Badge>
                    )}
                </div>

                <RadioGroup
                    value={selectedDeliveryOption}
                    onValueChange={onDeliveryOptionSelect}
                    className="space-y-4"
                >
                    {deliveryOptions.map((option) => (
                        <div key={option.id} className="relative">
                            <div
                                className={cn(
                                    "flex items-start space-x-4 p-4 rounded-lg border transition-all",
                                    "hover:border-primary/50 hover:shadow-sm",
                                    selectedDeliveryOption === option.id && "border-primary ring-1 ring-primary/20"
                                )}
                            >
                                <RadioGroupItem
                                    id={option.id}
                                    value={option.id}
                                    className="mt-1"
                                />
                                <div className="flex-1">
                                    <Label
                                        htmlFor={option.id}
                                        className="text-base font-medium flex items-center cursor-pointer"
                                    >
                                        <Clock className="w-4 h-4 mr-2 text-primary" />
                                        {option.name}

                                        {option.min_order_free_delivery > 0 && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="w-4 h-4 ml-2 text-gray-400" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Free delivery on orders over ${option.min_order_free_delivery}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </Label>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {option.description}
                                    </p>

                                    {option.id === 'scheduled' && selectedDeliveryOption === 'scheduled' && (
                                        <AnimatePresence>
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 space-y-4"
                                            >
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="flex-1">
                                                        <Label htmlFor="delivery-day" className="text-sm mb-2 block">
                                                            Delivery Day
                                                        </Label>
                                                        <Select value={scheduledDay} onValueChange={handleScheduledDayChange}>
                                                            <SelectTrigger id="delivery-day">
                                                                <SelectValue placeholder="Select day" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="today">Today</SelectItem>
                                                                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex-1">
                                                        <Label htmlFor="delivery-time" className="text-sm mb-2 block">
                                                            Delivery Time
                                                        </Label>
                                                        <Select value={scheduledTime} onValueChange={handleScheduledTimeChange}>
                                                            <SelectTrigger id="delivery-time">
                                                                <SelectValue placeholder="Select time" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {getScheduleOptions()[scheduledDay]?.map((time) => (
                                                                    <SelectItem key={time} value={time}>
                                                                        {time}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold">
                                        {option.price > 0 ? `$${option.price.toFixed(2)}` : 'Free'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    );
};

export default DeliveryStep; 