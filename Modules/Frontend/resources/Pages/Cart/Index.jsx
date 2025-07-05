import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShoppingCart, AlertCircle, ChevronRight } from 'lucide-react';
import Layout from '@/Layouts/Frontend/Layout';

import Hero from './Partials/Hero';
import CartItems from './Partials/CartItems';
import OrderSummary from './Partials/OrderSummary';
import AddressSelection from './Partials/AddressSelection';
import PaymentMethods from './Partials/PaymentMethods';
import RecommendedItems from './Partials/RecommendedItems';

import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Separator } from '@/Components/ui/separator';
import { useToast } from '@/Components/ui/use-toast';

const Index = ({
    hero = {},
    cart_items = [],
    summary = {},
    addresses = [],
    payment_methods = [],
    promo_codes = [],
    recommended_items = [],
    error = null
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
    const { toast } = useToast();

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Handle updating cart item quantity
    const handleUpdateQuantity = async (itemId, quantity) => {
        try {
            // In a real app, you would make an API call to update the cart
            await new Promise(resolve => setTimeout(resolve, 800));

            // For demo purposes, show success toast
            toast({
                title: "Cart Updated",
                description: `Item quantity updated to ${quantity}`,
            });
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Failed to update item quantity",
                variant: "destructive",
            });
            throw error; // Re-throw to handle in the component
        }
    };

    // Handle removing cart item
    const handleRemoveItem = async (itemId) => {
        try {
            // In a real app, you would make an API call to remove the item
            await new Promise(resolve => setTimeout(resolve, 800));

            // For demo purposes, show success toast
            toast({
                title: "Item Removed",
                description: "Item removed from your cart",
            });
        } catch (error) {
            toast({
                title: "Remove Failed",
                description: "Failed to remove item from cart",
                variant: "destructive",
            });
            throw error; // Re-throw to handle in the component
        }
    };

    // Handle applying promo code
    const handleApplyPromoCode = async (code) => {
        try {
            // Check if code exists in available promo codes
            const validCode = promo_codes.find(
                promo => promo.code.toLowerCase() === code.toLowerCase()
            );

            if (!validCode) {
                throw new Error("Invalid promo code");
            }

            // In a real app, you would make an API call to apply the code
            await new Promise(resolve => setTimeout(resolve, 800));

            // For demo purposes, show success toast
            toast({
                title: "Promo Code Applied",
                description: `${validCode.discount_amount}% discount applied to your order`,
            });
        } catch (error) {
            toast({
                title: "Invalid Code",
                description: error.message || "Failed to apply promo code",
                variant: "destructive",
            });
            throw error; // Re-throw to handle in the component
        }
    };

    // Handle adding item instructions
    const handleInstructionsChange = (itemId, instructions) => {
        // In a real app, you would make an API call to update instructions
        console.log('Updated instructions for item', itemId, instructions);
    };

    // Handle adding recommended item to cart
    const handleAddRecommendedItem = async (item) => {
        try {
            // In a real app, you would make an API call to add the item
            await new Promise(resolve => setTimeout(resolve, 800));

            // For demo purposes, show success toast
            toast({
                title: "Item Added",
                description: `${item.name} added to your cart`,
            });
        } catch (error) {
            toast({
                title: "Add Failed",
                description: "Failed to add item to cart",
                variant: "destructive",
            });
            throw error;
        }
    };

    return (
        <>
            <Layout>
                <Head title="Your Cart" />

                {/* Hero Section */}
                <Hero data={hero} />

                {/* Page Content */}
                <section className="py-12 bg-gray-50 dark:bg-gray-900">
                    <div className="container">
                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Breadcrumbs */}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                            <Link href="/" className="hover:text-primary">Home</Link>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span className="font-medium text-gray-900 dark:text-white">
                                Your Cart
                            </span>
                        </div>

                        {/* If cart is empty */}
                        {Array.isArray(cart_items) && cart_items.length === 0 && !isLoading ? (
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                                <CartItems items={[]} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Left Column - Cart Items */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                        <CartItems
                                            items={cart_items}
                                            onUpdateQuantity={handleUpdateQuantity}
                                            onRemove={handleRemoveItem}
                                            onInstructionsChange={handleInstructionsChange}
                                        />
                                    </div>
                                </div>

                                {/* Right Column - Checkout Information */}
                                <div className="space-y-6">
                                    {/* Order Summary */}
                                    <OrderSummary
                                        summary={summary}
                                        onApplyPromoCode={handleApplyPromoCode}
                                        isCheckoutDisabled={
                                            isLoading ||
                                            !selectedAddressId ||
                                            !selectedPaymentMethodId
                                        }
                                    />

                                    {/* Address Selection */}
                                    <AddressSelection
                                        addresses={addresses}
                                        selectedAddressId={selectedAddressId}
                                        onAddressSelect={setSelectedAddressId}
                                    />

                                    {/* Payment Methods */}
                                    <PaymentMethods
                                        methods={payment_methods}
                                        selectedMethodId={selectedPaymentMethodId}
                                        onMethodSelect={setSelectedPaymentMethodId}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Recommended Items */}
                        <div className="mt-12">
                            <Separator className="mb-8" />
                            <RecommendedItems
                                items={recommended_items}
                                onAddToCart={handleAddRecommendedItem}
                            />
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default Index; 