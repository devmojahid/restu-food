import React from 'react';
import { motion } from 'framer-motion';
import {
    Truck,
    Store,
    Clock,
    Info
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Label } from "@/Components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { cn } from '@/lib/utils';

const DeliveryOptions = ({
    options = [],
    selectedOption = {},
    onSelectOption
}) => {
    // Default delivery options if none provided
    const defaultOptions = [
        {
            id: 'standard-delivery',
            name: 'Standard Delivery',
            description: 'Delivery in 30-45 min',
            price: 3.99,
            icon: Truck,
            is_default: true,
        },
        {
            id: 'express-delivery',
            name: 'Express Delivery',
            description: 'Delivery in 15-20 min',
            price: 6.99,
            icon: Truck,
        },
        {
            id: 'pickup',
            name: 'Pickup',
            description: 'Ready in 20-25 min',
            price: 0,
            icon: Store,
        }
    ];

    const displayOptions = options?.length > 0 ? options : defaultOptions;
    const selected = selectedOption?.id ? selectedOption : displayOptions.find(opt => opt.is_default) || displayOptions[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Delivery Options</h2>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="cursor-help">
                                <Info className="h-4 w-4 text-gray-400" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs max-w-xs">
                                Choose how you'd like to receive your order. Delivery times may vary based on your location and restaurant preparation times.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <RadioGroup
                defaultValue={selected.id}
                value={selected.id}
                onValueChange={(value) => {
                    const option = displayOptions.find(opt => opt.id === value);
                    if (option) {
                        onSelectOption(option);
                    }
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                {displayOptions.map((option) => {
                    const Icon = option.icon || Truck;
                    const isSelected = selected.id === option.id;

                    return (
                        <div
                            key={option.id}
                            className={cn(
                                "relative rounded-xl overflow-hidden cursor-pointer",
                                "border transition-all duration-300",
                                isSelected
                                    ? "border-primary/70 ring-2 ring-primary/30 bg-primary/5 dark:bg-primary/10"
                                    : "border-gray-200 dark:border-gray-700 hover:border-primary/40"
                            )}
                        >
                            <RadioGroupItem
                                value={option.id}
                                id={option.id}
                                className="sr-only"
                            />
                            <Label
                                htmlFor={option.id}
                                className="flex flex-col items-center p-4 cursor-pointer h-full"
                            >
                                <Icon className={cn(
                                    "h-8 w-8 mb-3",
                                    isSelected ? "text-primary" : "text-gray-500"
                                )} />

                                <span className="font-medium text-center mb-1">
                                    {option.name}
                                </span>

                                <div className="flex items-center text-xs text-gray-500 mb-3">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>{option.description}</span>
                                </div>

                                <span className={cn(
                                    "text-sm font-semibold",
                                    isSelected ? "text-primary" : ""
                                )}>
                                    {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                                </span>

                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="white"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </motion.div>
                                )}
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>
        </motion.div>
    );
};

export default DeliveryOptions; 