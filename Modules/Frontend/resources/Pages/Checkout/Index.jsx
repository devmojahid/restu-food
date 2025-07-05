import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import DeliveryStep from './Partials/DeliveryStep';
import PaymentStep from './Partials/PaymentStep';
import ReviewStep from './Partials/ReviewStep';
import OrderSummary from './Partials/OrderSummary';
import CheckoutProgress from './Partials/CheckoutProgress';
import RecommendedItems from './Partials/RecommendedItems';
import { useToast } from '@/Components/ui/use-toast';
import { router } from '@inertiajs/react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { LoadingSpinner } from '@/Components/ui/spinner';
import {
    AlertCircle,
    CheckCircle,
    ChevronLeft
} from 'lucide-react';
import { Separator } from '@/Components/ui/separator';
import { Button } from '@/Components/ui/button';

const CheckoutPage = ({
    hero,
    cart_items = [],
    summary = {},
    addresses = [],
    payment_methods = [],
    default_payment_method = null,
    default_address = null,
    delivery_options = [],
    promo_codes = [],
    recommended_items = [],
    error = null
}) => {
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(default_address?.id || null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(default_payment_method?.id || null);
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(delivery_options.find(option => option.is_default)?.id || null);
    const [tipAmount, setTipAmount] = useState(summary.tip || 0);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive",
            });
        }
    }, [error, toast]);

    // Handle changing steps
    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        } else {
            handleSubmitOrder();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    // Handle address selection
    const handleAddressSelect = (addressId) => {
        setSelectedAddress(addressId);

        // Update the address in the backend
        router.put(route('frontend.checkout.address'), {
            address_id: addressId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Address Updated",
                    description: "Your delivery address has been updated",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to update address",
                    variant: "destructive",
                });
            }
        });
    };

    // Handle payment method selection
    const handlePaymentMethodSelect = (methodId) => {
        setSelectedPaymentMethod(methodId);

        // Update the payment method in the backend
        router.put(route('frontend.checkout.payment'), {
            payment_method_id: methodId
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Payment Method Updated",
                    description: "Your payment method has been updated",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to update payment method",
                    variant: "destructive",
                });
            }
        });
    };

    // Handle delivery option selection
    const handleDeliveryOptionSelect = (optionId) => {
        setSelectedDeliveryOption(optionId);
    };

    // Handle tip amount change
    const handleTipChange = (amount) => {
        setTipAmount(amount);
    };

    // Handle special instructions
    const handleSpecialInstructionsChange = (e) => {
        setSpecialInstructions(e.target.value);
    };

    // Handle order submission
    const handleSubmitOrder = () => {
        if (!selectedAddress) {
            toast({
                title: "Missing Address",
                description: "Please select a delivery address",
                variant: "destructive",
            });
            setCurrentStep(1);
            return;
        }

        if (!selectedPaymentMethod) {
            toast({
                title: "Missing Payment Method",
                description: "Please select a payment method",
                variant: "destructive",
            });
            setCurrentStep(2);
            return;
        }

        setIsSubmitting(true);

        router.post(route('frontend.checkout.process'), {
            shipping_address_id: selectedAddress,
            payment_method_id: selectedPaymentMethod,
            tip_amount: tipAmount,
            special_instructions: specialInstructions
        }, {
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
            onError: (errors) => {
                setIsSubmitting(false);

                // Display validation errors
                if (errors.shipping_address_id) {
                    toast({
                        title: "Invalid Address",
                        description: errors.shipping_address_id,
                        variant: "destructive",
                    });
                    setCurrentStep(1);
                } else if (errors.payment_method_id) {
                    toast({
                        title: "Invalid Payment Method",
                        description: errors.payment_method_id,
                        variant: "destructive",
                    });
                    setCurrentStep(2);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to process order. Please try again.",
                        variant: "destructive",
                    });
                }
            }
        });
    };

    // Determine if the user can proceed to the next step
    const canProceed = () => {
        if (currentStep === 1 && !selectedAddress) {
            return false;
        }
        if (currentStep === 2 && !selectedPaymentMethod) {
            return false;
        }
        return true;
    };

    // Get button text based on current step
    const getButtonText = () => {
        if (currentStep === 3) {
            return isSubmitting ? "Processing..." : "Place Order";
        }
        return "Continue";
    };

    // Render the current step
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <DeliveryStep
                        addresses={addresses}
                        selectedAddress={selectedAddress}
                        onAddressSelect={handleAddressSelect}
                        deliveryOptions={delivery_options}
                        selectedDeliveryOption={selectedDeliveryOption}
                        onDeliveryOptionSelect={handleDeliveryOptionSelect}
                    />
                );
            case 2:
                return (
                    <PaymentStep
                        paymentMethods={payment_methods}
                        selectedPaymentMethod={selectedPaymentMethod}
                        onPaymentMethodSelect={handlePaymentMethodSelect}
                        tipAmount={tipAmount}
                        onTipChange={handleTipChange}
                        tipOptions={summary.tip_options || [0, 2, 3, 5, 10]}
                    />
                );
            case 3:
                return (
                    <ReviewStep
                        cartItems={cart_items}
                        selectedAddress={addresses.find(addr => addr.id === selectedAddress)}
                        selectedPaymentMethod={payment_methods.find(method => method.id === selectedPaymentMethod)}
                        selectedDeliveryOption={delivery_options.find(option => option.id === selectedDeliveryOption)}
                        tipAmount={tipAmount}
                        specialInstructions={specialInstructions}
                        onSpecialInstructionsChange={handleSpecialInstructionsChange}
                    />
                );
            default:
                return null;
        }
    };

    // Handle empty cart
    if (!cart_items || cart_items.length === 0) {
        return (
            <Layout>
                <Head title="Checkout" />
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-yellow-600 dark:text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Add some items to your cart before proceeding to checkout.
                        </p>
                        <Button
                            onClick={() => router.visit(route('frontend.menu'))}
                            className="rounded-full"
                        >
                            Browse Menu
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    // Main render
    return (
        <Layout>
            <Head title="Checkout" />

            {/* Hero Section */}
            <Hero data={hero} currentStep={currentStep} />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Progress Indicators */}
                        <CheckoutProgress currentStep={currentStep} steps={hero.steps} />

                        {/* Step Content */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            {renderStep()}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            {currentStep > 1 ? (
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={isSubmitting}
                                    className="rounded-full"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            ) : (
                                <div></div>
                            )}
                            <Button
                                onClick={nextStep}
                                disabled={!canProceed() || isSubmitting}
                                className="rounded-full"
                            >
                                {isSubmitting ? (
                                    <LoadingSpinner size="sm" text={null} className="mr-2" />
                                ) : currentStep === 3 ? (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                ) : null}
                                {getButtonText()}
                            </Button>
                        </div>
                    </div>

                    {/* Order Summary Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <OrderSummary
                                cartItems={cart_items}
                                summary={summary}
                                selectedDeliveryOption={delivery_options.find(option => option.id === selectedDeliveryOption)}
                                tipAmount={tipAmount}
                            />
                        </div>
                    </div>
                </div>

                {/* Recommended Items */}
                {recommended_items.length > 0 && (
                    <div className="mt-16">
                        <Separator className="my-8" />
                        <RecommendedItems items={recommended_items} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CheckoutPage; 