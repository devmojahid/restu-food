import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/Layouts/Frontend/Layout';
import Hero from './Partials/Hero';
import OrderSummary from './Partials/OrderSummary';
import CustomerInfoSection from './Partials/CustomerInfoSection';
import ShippingSection from './Partials/ShippingSection';
import PaymentSection from './Partials/PaymentSection';
import RecommendedItems from './Partials/RecommendedItems';
import ReviewSection from './Partials/ReviewSection';
import {
    CreditCard,
    Truck,
    ShoppingBag,
    Check,
    ArrowRight,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { useToast } from '@/Components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { cn } from '@/lib/utils';

const Index = ({
    hero = {},
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openSection, setOpenSection] = useState(null);
    const [formComplete, setFormComplete] = useState({
        customerInfo: false,
        shipping: false,
        payment: false
    });
    const { toast } = useToast();
    const [appliedPromoCode, setAppliedPromoCode] = useState(null);

    // Form state
    const [customerInfo, setCustomerInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [selectedAddress, setSelectedAddress] = useState(default_address);
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(
        delivery_options?.find(option => option.is_default) || delivery_options?.[0] || null
    );
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(default_payment_method);
    const [tipAmount, setTipAmount] = useState(0);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Section visibility control
    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Form for checkout submission
    const { data, setData, post, processing, errors } = useForm({
        shipping_address_id: default_address?.id || '',
        payment_method_id: default_payment_method?.id || '',
        delivery_option_id: selectedDeliveryOption?.id || '',
        tip_amount: tipAmount,
        special_instructions: specialInstructions,
        promo_code: appliedPromoCode?.code || '',
        customer_info: customerInfo
    });

    // Update form data when selections change
    useEffect(() => {
        setData({
            shipping_address_id: selectedAddress?.id || '',
            payment_method_id: selectedPaymentMethod?.id || '',
            delivery_option_id: selectedDeliveryOption?.id || '',
            tip_amount: tipAmount,
            special_instructions: specialInstructions,
            promo_code: appliedPromoCode?.code || '',
            customer_info: customerInfo
        });
    }, [selectedAddress, selectedPaymentMethod, selectedDeliveryOption,
        tipAmount, specialInstructions, appliedPromoCode, customerInfo]);

    // Handle customer info update
    const handleCustomerInfoUpdate = (info) => {
        setCustomerInfo(info);
        setFormComplete(prev => ({ ...prev, customerInfo: true }));
        setOpenSection('shipping');
    };

    // Handle shipping selection
    const handleShippingUpdate = (address, deliveryOption) => {
        setSelectedAddress(address);
        setSelectedDeliveryOption(deliveryOption);
        setFormComplete(prev => ({ ...prev, shipping: true }));
        setOpenSection('payment');
    };

    // Handle payment method selection
    const handlePaymentUpdate = (paymentMethod, tipAmt) => {
        setSelectedPaymentMethod(paymentMethod);
        setTipAmount(tipAmt);
        setFormComplete(prev => ({ ...prev, payment: true }));
        setOpenSection('review');
    };

    // Handle promo code application
    const handleApplyPromoCode = (code) => {
        // In a real app, we would validate the promo code server-side
        // For now, we'll just set it directly
        const foundPromoCode = promo_codes.find(p =>
            p.code.toLowerCase() === code.toLowerCase());

        if (foundPromoCode) {
            setAppliedPromoCode(foundPromoCode);
            toast({
                title: "Promo code applied!",
                description: `${foundPromoCode.description}`,
                variant: "success",
            });
        } else {
            toast({
                title: "Invalid promo code",
                description: "The promo code you entered is not valid.",
                variant: "destructive",
            });
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        if (!formComplete.customerInfo || !formComplete.shipping || !formComplete.payment) {
            toast({
                title: "Please complete all sections",
                description: "Fill out all required information before placing your order.",
                variant: "destructive",
            });
            return;
        }

        if (!agreedToTerms) {
            toast({
                title: "Terms agreement required",
                description: "Please agree to the terms and conditions to complete your order.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        post(route('checkout3.process'), {
            onSuccess: () => {
                // Success will redirect to the success page
                // This is handled by the controller
            },
            onError: (errors) => {
                console.error(errors);
                setIsSubmitting(false);
                toast({
                    title: "Error processing order",
                    description: "Please check your information and try again.",
                    variant: "destructive",
                });
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    // Calculate if all sections are complete
    const allSectionsComplete =
        formComplete.customerInfo &&
        formComplete.shipping &&
        formComplete.payment &&
        agreedToTerms;

    return (
        <Layout>
            <Head title="Express Checkout" />

            {/* Hero Section */}
            <Hero data={hero} />

            <div className="container mx-auto px-4 py-8">
                {/* Error Alert */}
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <AlertTitle>Please fix the following errors:</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5 mt-2">
                                {Object.entries(errors).map(([key, value]) => (
                                    <li key={key}>{value}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Checkout Flow */}
                    <div className="w-full lg:w-2/3">
                        {/* Progress Indicators - Desktop */}
                        <div className="hidden md:flex items-center justify-between mb-6">
                            <div className="flex items-center w-full">
                                <div className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-full",
                                    formComplete.customerInfo ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                                )}>
                                    {formComplete.customerInfo ? <Check className="w-5 h-5" /> : "1"}
                                </div>
                                <div className={cn(
                                    "flex-1 h-1 mx-2",
                                    formComplete.customerInfo ? "bg-primary" : "bg-gray-200"
                                )} />
                                <div className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-full",
                                    formComplete.shipping ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                                )}>
                                    {formComplete.shipping ? <Check className="w-5 h-5" /> : "2"}
                                </div>
                                <div className={cn(
                                    "flex-1 h-1 mx-2",
                                    formComplete.shipping ? "bg-primary" : "bg-gray-200"
                                )} />
                                <div className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-full",
                                    formComplete.payment ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                                )}>
                                    {formComplete.payment ? <Check className="w-5 h-5" /> : "3"}
                                </div>
                                <div className={cn(
                                    "flex-1 h-1 mx-2",
                                    allSectionsComplete ? "bg-primary" : "bg-gray-200"
                                )} />
                                <div className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-full",
                                    allSectionsComplete ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                                )}>
                                    {allSectionsComplete ? <Check className="w-5 h-5" /> : "4"}
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center justify-between mb-8 text-sm text-gray-600">
                            <div className="text-center">
                                <span className={formComplete.customerInfo ? "text-primary font-medium" : ""}>
                                    Customer Info
                                </span>
                            </div>
                            <div className="text-center">
                                <span className={formComplete.shipping ? "text-primary font-medium" : ""}>
                                    Shipping
                                </span>
                            </div>
                            <div className="text-center">
                                <span className={formComplete.payment ? "text-primary font-medium" : ""}>
                                    Payment
                                </span>
                            </div>
                            <div className="text-center">
                                <span className={allSectionsComplete ? "text-primary font-medium" : ""}>
                                    Review
                                </span>
                            </div>
                        </div>

                        {/* Customer Information Section */}
                        <CustomerInfoSection
                            isOpen={openSection === 'customerInfo'}
                            toggleSection={() => toggleSection('customerInfo')}
                            onComplete={handleCustomerInfoUpdate}
                            initialValues={customerInfo}
                            isComplete={formComplete.customerInfo}
                            errors={errors}
                        />

                        {/* Shipping Section */}
                        <ShippingSection
                            isOpen={openSection === 'shipping'}
                            toggleSection={() => toggleSection('shipping')}
                            onComplete={handleShippingUpdate}
                            addresses={addresses}
                            deliveryOptions={delivery_options}
                            selectedAddress={selectedAddress}
                            selectedDeliveryOption={selectedDeliveryOption}
                            isComplete={formComplete.shipping}
                            errors={errors}
                        />

                        {/* Payment Section */}
                        <PaymentSection
                            isOpen={openSection === 'payment'}
                            toggleSection={() => toggleSection('payment')}
                            onComplete={handlePaymentUpdate}
                            paymentMethods={payment_methods}
                            selectedPaymentMethod={selectedPaymentMethod}
                            tipAmount={tipAmount}
                            isComplete={formComplete.payment}
                            errors={errors}
                        />

                        {/* Review Section */}
                        <ReviewSection
                            isOpen={openSection === 'review'}
                            toggleSection={() => toggleSection('review')}
                            customerInfo={customerInfo}
                            selectedAddress={selectedAddress}
                            selectedDeliveryOption={selectedDeliveryOption}
                            selectedPaymentMethod={selectedPaymentMethod}
                            cartItems={cart_items}
                            tipAmount={tipAmount}
                            specialInstructions={specialInstructions}
                            onSpecialInstructionsChange={setSpecialInstructions}
                            agreedToTerms={agreedToTerms}
                            setAgreedToTerms={setAgreedToTerms}
                            isComplete={allSectionsComplete}
                        />

                        {/* Place Order Button */}
                        <div className="mt-8">
                            <Button
                                onClick={handleSubmit}
                                disabled={!allSectionsComplete || isSubmitting || processing}
                                className="w-full py-6 text-lg"
                            >
                                {isSubmitting || processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Place Order
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-24">
                            <OrderSummary
                                cartItems={cart_items}
                                summary={summary}
                                selectedDeliveryOption={selectedDeliveryOption}
                                tipAmount={tipAmount}
                                appliedPromoCode={appliedPromoCode}
                                onApplyPromoCode={handleApplyPromoCode}
                                onRemovePromoCode={() => setAppliedPromoCode(null)}
                            />

                            {/* Payment Security Info */}
                            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="flex items-center mb-2">
                                    <CreditCard className="w-5 h-5 text-primary mr-2" />
                                    <h4 className="font-medium">Secure Checkout</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    All transactions are secure and encrypted. Your personal information is protected.
                                </p>
                            </div>

                            {/* Recommended Items (Mobile Only) */}
                            <div className="lg:hidden mt-6">
                                <RecommendedItems items={recommended_items} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommended Items (Desktop) */}
                <div className="hidden lg:block mt-16">
                    <RecommendedItems items={recommended_items} />
                </div>
            </div>
        </Layout>
    );
};

export default Index; 