import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import CheckoutProgress from './Partials/CheckoutProgress';
import DeliveryStep from './Partials/DeliveryStep';
import PaymentStep from './Partials/PaymentStep';
import ReviewStep from './Partials/ReviewStep';
import OrderSummary from './Partials/OrderSummary';
import RecommendedItems from './Partials/RecommendedItems';
import { Button } from '@/Components/ui/button';
import { useToast } from '@/Components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';

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
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedAddress, setSelectedAddress] = useState(default_address);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(default_payment_method);
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(
        delivery_options.find(option => option.is_default) || delivery_options[0] || null
    );
    const [tipAmount, setTipAmount] = useState(0);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const { data, setData, post, processing, reset, errors } = useForm({
        shipping_address_id: default_address?.id || '',
        payment_method_id: default_payment_method?.id || '',
        delivery_option_id: selectedDeliveryOption?.id || '',
        tip_amount: 0,
        special_instructions: '',
        promo_code: ''
    });

    useEffect(() => {
        if (selectedAddress) {
            setData('shipping_address_id', selectedAddress.id);
        }
    }, [selectedAddress]);

    useEffect(() => {
        if (selectedPaymentMethod) {
            setData('payment_method_id', selectedPaymentMethod.id);
        }
    }, [selectedPaymentMethod]);

    useEffect(() => {
        if (selectedDeliveryOption) {
            setData('delivery_option_id', selectedDeliveryOption.id);
        }
    }, [selectedDeliveryOption]);

    useEffect(() => {
        setData('tip_amount', tipAmount);
    }, [tipAmount]);

    useEffect(() => {
        setData('special_instructions', specialInstructions);
    }, [specialInstructions]);

    const nextStep = () => {
        if (currentStep < 3) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setCurrentStep(currentStep - 1);
        }
    };

    const handleAddressSelect = (addressId) => {
        const address = addresses.find(addr => addr.id === addressId);
        if (address) {
            setSelectedAddress(address);

            // Update the address in the backend
            const { put } = useForm({
                address_id: address.id
            });

            put(route('checkout2.address'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: "Address updated",
                        description: "Your delivery address has been updated"
                    });
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Failed to update delivery address",
                        variant: "destructive"
                    });
                }
            });
        }
    };

    const handlePaymentMethodSelect = (methodId) => {
        const method = payment_methods.find(m => m.id === methodId);
        if (method) {
            setSelectedPaymentMethod(method);

            // Update the payment method in the backend
            const { put } = useForm({
                payment_method_id: method.id
            });

            put(route('checkout2.payment'), {
                preserveScroll: true,
                onSuccess: () => {
                    toast({
                        title: "Payment method updated",
                        description: "Your payment method has been updated"
                    });
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Failed to update payment method",
                        variant: "destructive"
                    });
                }
            });
        }
    };

    const handleDeliveryOptionSelect = (optionId) => {
        const option = delivery_options.find(o => o.id === optionId);
        if (option) {
            setSelectedDeliveryOption(option);
        }
    };

    const handleTipChange = (amount) => {
        setTipAmount(amount);
    };

    const handleSpecialInstructionsChange = (e) => {
        setSpecialInstructions(e.target.value);
    };

    const handleSubmitOrder = () => {
        setIsSubmitting(true);

        post(route('checkout2.process'), {
            preserveScroll: true,
            onSuccess: () => {
                // Redirect is handled by the controller
            },
            onError: (errors) => {
                setIsSubmitting(false);
                toast({
                    title: "Order Failed",
                    description: "Please check your information and try again.",
                    variant: "destructive"
                });
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    // Check if we can proceed to the next step
    const canProceed = () => {
        if (currentStep === 1 && !selectedAddress) return false;
        if (currentStep === 2 && !selectedPaymentMethod) return false;
        return true;
    };

    // Get the button text for the current step
    const getButtonText = () => {
        if (currentStep === 3) return 'Place Order';
        return 'Continue';
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
                    />
                );
            case 3:
                return (
                    <ReviewStep
                        cartItems={cart_items}
                        selectedAddress={selectedAddress}
                        selectedPaymentMethod={selectedPaymentMethod}
                        selectedDeliveryOption={selectedDeliveryOption}
                        tipAmount={tipAmount}
                        specialInstructions={specialInstructions}
                        onSpecialInstructionsChange={handleSpecialInstructionsChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Layout>
            <Head title="Checkout" />

            {/* Hero Section */}
            <Hero data={hero} currentStep={currentStep} />

            <div className="container mx-auto px-4 py-8">
                {/* Error Message */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Checkout Progress */}
                <div className="mb-8">
                    <CheckoutProgress
                        currentStep={currentStep}
                        steps={[
                            { id: 1, title: 'Shipping' },
                            { id: 2, title: 'Payment' },
                            { id: 3, title: 'Review' }
                        ]}
                    />
                </div>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left column - Current Step */}
                    <div className="w-full lg:w-2/3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className={cn(
                            "flex items-center justify-between mt-8",
                            currentStep === 1 && "justify-end"
                        )}>
                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={prevStep}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </Button>
                            )}

                            {currentStep < 3 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    className="flex items-center gap-2"
                                >
                                    {getButtonText()}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleSubmitOrder}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2"
                                >
                                    {isSubmitting ? 'Processing...' : 'Place Order'}
                                    {!isSubmitting && <Check className="w-4 h-4" />}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Right column - Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <OrderSummary
                            cartItems={cart_items}
                            summary={summary}
                            selectedDeliveryOption={selectedDeliveryOption}
                            tipAmount={tipAmount}
                        />
                    </div>
                </div>

                {/* Recommended Items */}
                {recommended_items?.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                        <RecommendedItems items={recommended_items} />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CheckoutPage; 