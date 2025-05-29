import React from 'react';
import { motion } from 'framer-motion';
import { Truck, CreditCard, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const Hero = ({ data, currentStep = 1 }) => {
    if (!data) return null;

    const { title, subtitle, description, image, steps = [] } = data;

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
                return Truck;
        }
    };

    return (
        <div className="relative min-h-[350px] md:min-h-[400px] overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 pt-20">
            {/* Background Image with Parallax Effect */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `url(${image || '/images/checkout-bg.jpg'})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    filter: 'blur(2px)'
                }}
            />

            {/* Content */}
            <div className="container mx-auto px-4 relative h-full z-10">
                <div className="flex flex-col h-full justify-center py-16 lg:py-24 max-w-3xl mx-auto">
                    {/* Main Content */}
                    <div className="text-center">
                        <motion.span
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm mb-3"
                        >
                            {subtitle}
                        </motion.span>

                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                        >
                            {title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-300 mb-8"
                        >
                            {description}
                        </motion.p>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex justify-center mt-2">
                        <div className="inline-flex items-center bg-white/5 backdrop-blur-sm rounded-full p-2 border border-white/10">
                            {steps.map((step, index) => {
                                const StepIcon = getStepIcon(step.id);
                                const isActive = currentStep === step.id;
                                const isCompleted = currentStep > step.id;

                                return (
                                    <React.Fragment key={step.id}>
                                        {index > 0 && (
                                            <div className={cn(
                                                "w-10 h-0.5 mx-1",
                                                isCompleted ? "bg-primary" : "bg-gray-600"
                                            )} />
                                        )}
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{
                                                scale: isActive ? 1.1 : 1,
                                                backgroundColor: isActive
                                                    ? 'rgba(var(--primary), 0.3)'
                                                    : isCompleted
                                                        ? 'rgba(var(--primary), 0.2)'
                                                        : 'rgba(255, 255, 255, 0.05)'
                                            }}
                                            className={cn(
                                                "flex flex-col items-center justify-center px-4 py-2 rounded-full transition-all duration-300",
                                                isActive && "bg-primary/30",
                                                isCompleted && "bg-primary/20",
                                                !isActive && !isCompleted && "bg-white/5"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                                                isActive && "bg-primary text-white",
                                                isCompleted && "bg-primary/20 text-primary",
                                                !isActive && !isCompleted && "bg-gray-600/50 text-white/70"
                                            )}>
                                                <StepIcon className="w-4 h-4" />
                                            </div>
                                            <span className={cn(
                                                "text-xs font-medium whitespace-nowrap",
                                                isActive && "text-white",
                                                isCompleted && "text-primary",
                                                !isActive && !isCompleted && "text-gray-400"
                                            )}>
                                                {step.title}
                                            </span>
                                        </motion.div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
        </div>
    );
};

export default Hero; 