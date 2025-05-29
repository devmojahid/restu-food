import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    CheckCircle,
    MapPin,
    CreditCard,
    ClipboardCheck,
    ShoppingBag
} from 'lucide-react';

const Hero = ({ data, currentStep = 1 }) => {
    // Handle case when data is missing
    const safeData = data || {
        title: 'Checkout',
        subtitle: 'Complete Your Order',
        description: 'You\'re just a few steps away from enjoying your delicious meal.',
        image: '/images/checkout-hero.jpg',
        steps: []
    };

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

    return (
        <div className="relative bg-gray-900 overflow-hidden pt-20 md:pt-16 pb-10 md:pb-12">
            {/* Background Image with Parallax Effect */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `url(${safeData.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            />

            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/90 dark:from-black/95 dark:via-black/85 dark:to-black/95 backdrop-blur-sm" />

            {/* Content */}
            <div className="relative container mx-auto px-4 py-8 md:py-12">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className={cn(
                            "inline-flex items-center space-x-2",
                            "bg-white/10 dark:bg-gray-900/50",
                            "backdrop-blur-md border border-white/20 dark:border-gray-700/50",
                            "text-white px-4 py-2 rounded-full text-sm mb-6",
                            "shadow-lg"
                        )}
                    >
                        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-white/90">{safeData.subtitle}</span>
                    </motion.div>

                    {/* Title with Enhanced Animation */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white leading-tight"
                    >
                        {safeData.title}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
                    >
                        {safeData.description}
                    </motion.p>

                    {/* Checkout Steps */}
                    {safeData.steps && safeData.steps.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="hidden md:flex justify-center items-center space-x-8 mt-8"
                        >
                            {safeData.steps.map((step, index) => {
                                const StepIcon = getStepIcon(step.id);
                                const isActive = currentStep === step.id;
                                const isCompleted = currentStep > step.id;

                                return (
                                    <div
                                        key={step.id}
                                        className={cn(
                                            "flex flex-col items-center relative",
                                            isActive ? "text-primary" : isCompleted ? "text-green-500" : "text-gray-400"
                                        )}
                                    >
                                        {/* Connector Line */}
                                        {index > 0 && (
                                            <div
                                                className={cn(
                                                    "absolute top-7 -left-12 w-10 h-0.5",
                                                    isCompleted ? "bg-green-500" : "bg-gray-600"
                                                )}
                                            />
                                        )}

                                        {/* Step Icon */}
                                        <div
                                            className={cn(
                                                "w-14 h-14 rounded-full mb-2 flex items-center justify-center",
                                                "border-2 transition-colors duration-300",
                                                isActive
                                                    ? "border-primary bg-primary/10"
                                                    : isCompleted
                                                        ? "border-green-500 bg-green-500/10"
                                                        : "border-gray-600 bg-gray-700/30"
                                            )}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-6 h-6" />
                                            ) : (
                                                <StepIcon className="w-6 h-6" />
                                            )}
                                        </div>

                                        {/* Step Name */}
                                        <span className="font-medium text-sm">{step.name}</span>

                                        {/* Step Number */}
                                        <span
                                            className={cn(
                                                "text-xs mt-1",
                                                isActive ? "text-white/80" : "text-gray-500"
                                            )}
                                        >
                                            Step {step.id}
                                        </span>
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hero; 