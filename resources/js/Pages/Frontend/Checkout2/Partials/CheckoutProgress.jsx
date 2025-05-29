import React from 'react';
import { motion } from 'framer-motion';
import { Check, Truck, CreditCard, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const CheckoutProgress = ({ currentStep = 1, steps = [] }) => {
    if (!steps?.length) {
        // Default steps if none provided
        steps = [
            { id: 1, title: 'Shipping' },
            { id: 2, title: 'Payment' },
            { id: 3, title: 'Review' }
        ];
    }

    // Function to get the appropriate icon for each step
    const getStepIcon = (stepId) => {
        switch (stepId) {
            case 1:
                return Truck;
            case 2:
                return CreditCard;
            case 3:
                return ClipboardCheck;
            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <div className="hidden md:flex justify-between items-center">
                {steps.map((step, index) => {
                    const StepIcon = getStepIcon(step.id);
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <motion.div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                                        isActive && "bg-primary text-white",
                                        isCompleted && "bg-primary/20 text-primary",
                                        !isActive && !isCompleted && "bg-gray-200 dark:bg-gray-800 text-gray-400"
                                    )}
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: isActive ? 1.2 : 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isCompleted ? (
                                        <Check className="w-6 h-6" />
                                    ) : (
                                        StepIcon && <StepIcon className="w-6 h-6" />
                                    )}
                                </motion.div>

                                <motion.span
                                    className={cn(
                                        "font-medium text-sm",
                                        isActive && "text-primary font-semibold",
                                        isCompleted && "text-primary",
                                        !isActive && !isCompleted && "text-gray-500"
                                    )}
                                    initial={{ opacity: 0.7 }}
                                    animate={{ opacity: isActive ? 1 : 0.7 }}
                                >
                                    {step.title}
                                </motion.span>
                            </div>

                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-4">
                                    <div className="relative h-0.5 bg-gray-200 dark:bg-gray-700">
                                        <motion.div
                                            className="absolute inset-y-0 left-0 bg-primary"
                                            initial={{ width: "0%" }}
                                            animate={{ width: isCompleted ? "100%" : "0%" }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Mobile version */}
            <div className="flex md:hidden justify-between items-center">
                {steps.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;

                    return (
                        <React.Fragment key={step.id}>
                            <motion.div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                    isActive && "bg-primary text-white",
                                    isCompleted && "bg-primary/20 text-primary",
                                    !isActive && !isCompleted && "bg-gray-200 dark:bg-gray-800 text-gray-400"
                                )}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: isActive ? 1.1 : 1 }}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <span className="text-xs font-medium">{step.id}</span>
                                )}
                            </motion.div>

                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-2">
                                    <div className="relative h-0.5 bg-gray-200 dark:bg-gray-700">
                                        <motion.div
                                            className="absolute inset-y-0 left-0 bg-primary"
                                            initial={{ width: "0%" }}
                                            animate={{ width: isCompleted ? "100%" : "0%" }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Mobile titles */}
            <div className="mt-2 flex justify-between md:hidden">
                {steps.map((step) => {
                    const isActive = currentStep === step.id;
                    return (
                        <span
                            key={`title-${step.id}`}
                            className={cn(
                                "text-xs text-center",
                                isActive ? "text-primary font-medium" : "text-gray-500"
                            )}
                        >
                            {step.title}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckoutProgress; 