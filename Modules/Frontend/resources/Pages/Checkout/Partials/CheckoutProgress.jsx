import React from 'react';
import { cn } from '@/lib/utils';
import {
    CheckCircle,
    MapPin,
    CreditCard,
    ClipboardCheck,
    ShoppingBag
} from 'lucide-react';

const CheckoutProgress = ({ currentStep = 1, steps = [] }) => {
    // Calculate progress percentage
    const totalSteps = steps.length;
    const progress = Math.round((currentStep / totalSteps) * 100);

    // Get icon component by step ID
    const getStepIcon = (stepId) => {
        switch (stepId) {
            case 1:
                return MapPin;
            case 2:
                return CreditCard;
            case 3:
                return ClipboardCheck;
            case 4:
                return ShoppingBag;
            default:
                return CheckCircle;
        }
    };

    // If no steps, don't render
    if (!steps.length) return null;

    return (
        <div className="md:hidden">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Mobile Steps Indicator */}
            <div className="flex items-center justify-between mb-6">
                {steps.map((step, index) => {
                    const StepIcon = getStepIcon(step.id);
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <div key={step.id} className="relative flex-1">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "absolute top-3 left-1/2 w-full h-0.5",
                                        isCompleted ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                                    )}
                                />
                            )}

                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center z-10",
                                        isActive
                                            ? "bg-primary text-white"
                                            : isCompleted
                                                ? "bg-primary text-white"
                                                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <span className="text-xs">{step.id}</span>
                                    )}
                                </div>

                                {/* Step Label - only show for active step */}
                                {isActive && (
                                    <span className="text-xs mt-1 text-primary font-medium">
                                        {step.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Current Step Description */}
            <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold">
                    {steps.find(step => step.id === currentStep)?.name || 'Complete Checkout'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {steps.find(step => step.id === currentStep)?.description || 'Review and confirm your order'}
                </p>
            </div>
        </div>
    );
};

export default CheckoutProgress; 