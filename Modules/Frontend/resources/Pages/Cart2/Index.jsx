import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import CartItems from './Partials/CartItems';
import CartSummary from './Partials/CartSummary';
import SavedItems from './Partials/SavedItems';
import RecommendedItems from './Partials/RecommendedItems';
import DeliveryOptions from './Partials/DeliveryOptions';
import PaymentMethods from './Partials/PaymentMethods';
import AddressSelector from './Partials/AddressSelector';
import PromoCodeSection from './Partials/PromoCodeSection';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { useToast } from '@/Components/ui/use-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const Index = ({
    hero = {},
    cart_items = [],
    recommended_items = [],
    recent_items = [],
    saved_for_later = [],
    user_addresses = [],
    payment_methods = [],
    summary = {},
    promocodes = [],
    delivery_options = [],
    error
}) => {
    const { toast } = useToast();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [cartItems, setCartItems] = useState(cart_items);
    const [savedItems, setSavedItems] = useState(saved_for_later);
    const [cartSummary, setCartSummary] = useState(summary);
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(
        delivery_options.find(option => option.is_default) || delivery_options[0] || {}
    );
    const [selectedAddress, setSelectedAddress] = useState(
        user_addresses.find(address => address.is_default) || user_addresses[0] || null
    );
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
        payment_methods.find(method => method.is_default) || payment_methods[0] || null
    );
    const [promoCode, setPromoCode] = useState('');
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Flash messages from the server
    useEffect(() => {
        const flash = window.flash;
        if (flash?.success) {
            toast({
                title: "Success",
                description: flash.success,
            });
        }
        if (flash?.error) {
            toast({
                title: "Error",
                description: flash.error,
                variant: "destructive",
            });
        }
    }, []);

    // Handle applying promo code
    const handleApplyPromoCode = async () => {
        if (!promoCode.trim()) return;

        setIsApplyingPromo(true);
        try {
            // In a real application, this would be an actual API call
            // For demo purposes, we'll simulate a successful promo code application
            await new Promise(resolve => setTimeout(resolve, 1000));

            const discount = 5.00; // Simulate $5 discount
            setCartSummary(prev => ({
                ...prev,
                promo_applied: true,
                promo_code: promoCode,
                promo_discount: discount,
                total: Math.max(0, prev.total - discount)
            }));

            toast({
                title: "Promo code applied!",
                description: `You saved $${discount.toFixed(2)}`,
            });
        } catch (error) {
            toast({
                title: "Invalid promo code",
                description: error.message || "Please try again with a valid code",
                variant: "destructive",
            });
        } finally {
            setIsApplyingPromo(false);
        }
    };

    // Handle updating item quantity
    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            return handleRemoveItem(itemId);
        }

        try {
            // Update UI immediately for better UX
            const updatedItems = cartItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedItems);

            // Recalculate cart summary
            updateCartSummary(updatedItems);

            // In a real application, this would be an actual API call
            // For demo purposes, we'll simulate a successful update
            await new Promise(resolve => setTimeout(resolve, 300));

            toast({
                title: "Quantity updated",
                description: "Your cart has been updated",
            });
        } catch (error) {
            // Revert to original state on error
            setCartItems(cart_items);
            updateCartSummary(cart_items);

            toast({
                title: "Failed to update quantity",
                description: error.message || "Please try again",
                variant: "destructive",
            });
        }
    };

    // Handle removing item from cart
    const handleRemoveItem = async (itemId) => {
        try {
            // Update UI immediately for better UX
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedItems);

            // Recalculate cart summary
            updateCartSummary(updatedItems);

            // In a real application, this would be an actual API call
            // For demo purposes, we'll simulate a successful removal
            await new Promise(resolve => setTimeout(resolve, 300));

            toast({
                title: "Item removed",
                description: "Item has been removed from your cart",
            });
        } catch (error) {
            // Revert to original state on error
            setCartItems(cart_items);
            updateCartSummary(cart_items);

            toast({
                title: "Failed to remove item",
                description: error.message || "Please try again",
                variant: "destructive",
            });
        }
    };

    // Handle saving item for later
    const handleSaveForLater = async (itemId) => {
        try {
            const itemToSave = cartItems.find(item => item.id === itemId);
            if (!itemToSave) return;

            // Update UI immediately for better UX
            const updatedCartItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedCartItems);
            setSavedItems([...savedItems, itemToSave]);

            // Recalculate cart summary
            updateCartSummary(updatedCartItems);

            // In a real application, this would be an actual API call
            // For demo purposes, we'll simulate a successful save
            await new Promise(resolve => setTimeout(resolve, 300));

            toast({
                title: "Saved for later",
                description: "Item has been saved for later",
            });
        } catch (error) {
            // Revert to original state on error
            setCartItems(cart_items);
            setSavedItems(saved_for_later);
            updateCartSummary(cart_items);

            toast({
                title: "Failed to save item",
                description: error.message || "Please try again",
                variant: "destructive",
            });
        }
    };

    // Handle moving item to cart
    const handleMoveToCart = async (itemId) => {
        try {
            const itemToMove = savedItems.find(item => item.id === itemId);
            if (!itemToMove) return;

            // Update UI immediately for better UX
            const updatedSavedItems = savedItems.filter(item => item.id !== itemId);
            setSavedItems(updatedSavedItems);
            setCartItems([...cartItems, { ...itemToMove, quantity: 1 }]);

            // Recalculate cart summary
            updateCartSummary([...cartItems, { ...itemToMove, quantity: 1 }]);

            // In a real application, this would be an actual API call
            // For demo purposes, we'll simulate a successful move
            await new Promise(resolve => setTimeout(resolve, 300));

            toast({
                title: "Moved to cart",
                description: "Item has been moved to your cart",
            });
        } catch (error) {
            // Revert to original state on error
            setCartItems(cart_items);
            setSavedItems(saved_for_later);
            updateCartSummary(cart_items);

            toast({
                title: "Failed to move item",
                description: error.message || "Please try again",
                variant: "destructive",
            });
        }
    };

    // Handle checkout
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast({
                title: "Cart is empty",
                description: "Please add items to your cart before checking out",
                variant: "destructive",
            });
            return;
        }

        if (!selectedAddress) {
            toast({
                title: "No delivery address",
                description: "Please select a delivery address",
                variant: "destructive",
            });
            return;
        }

        if (!selectedPaymentMethod) {
            toast({
                title: "No payment method",
                description: "Please select a payment method",
                variant: "destructive",
            });
            return;
        }

        setIsCheckingOut(true);
        try {
            // In a real application, this would be an actual API call
            // For demo purposes, we'll simulate a successful checkout
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast({
                title: "Order placed!",
                description: "Your order has been placed successfully",
            });

            // Clear cart after successful checkout
            setCartItems([]);
            updateCartSummary([]);
        } catch (error) {
            toast({
                title: "Checkout failed",
                description: error.message || "Please try again",
                variant: "destructive",
            });
        } finally {
            setIsCheckingOut(false);
        }
    };

    // Update cart summary based on current cart items
    const updateCartSummary = (items) => {
        let subtotal = 0;
        let discount = 0;

        items.forEach(item => {
            const itemTotal = item.price * item.quantity;

            // Add addons
            if (item.addons && Array.isArray(item.addons)) {
                item.addons.forEach(addon => {
                    const addonTotal = addon.price * addon.quantity;
                    subtotal += addonTotal;
                });
            }

            subtotal += itemTotal;

            // Calculate discounts
            if (item.discount && item.discount > 0) {
                const itemDiscount = (itemTotal * item.discount) / 100;
                discount += itemDiscount;
            }
        });

        const tax = subtotal * 0.08; // 8% tax
        const deliveryFee = selectedDeliveryOption?.price || 3.99;
        const serviceFee = 1.99;
        const promoDiscount = cartSummary.promo_applied ? cartSummary.promo_discount : 0;
        const total = subtotal - discount - promoDiscount + tax + deliveryFee + serviceFee;

        setCartSummary(prev => ({
            ...prev,
            subtotal: parseFloat(subtotal.toFixed(2)),
            discount: parseFloat(discount.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            delivery_fee: parseFloat(deliveryFee.toFixed(2)),
            service_fee: parseFloat(serviceFee.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        }));
    };

    // Handle delivery option change
    const handleDeliveryOptionChange = (option) => {
        setSelectedDeliveryOption(option);

        // Recalculate cart summary with new delivery fee
        let total = cartSummary.subtotal - cartSummary.discount;

        if (cartSummary.promo_applied) {
            total -= cartSummary.promo_discount;
        }

        total += cartSummary.tax + option.price + cartSummary.service_fee;

        setCartSummary(prev => ({
            ...prev,
            delivery_fee: option.price,
            total: parseFloat(total.toFixed(2))
        }));
    };

    return (
        <Layout>
            <Head title="Your Cart" />

            {/* Hero Section */}
            <Hero data={hero} />

            {error && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="w-full lg:w-8/12 space-y-8">
                        {/* Cart Items */}
                        <CartItems
                            items={cartItems}
                            onUpdateQuantity={handleUpdateQuantity}
                            onRemoveItem={handleRemoveItem}
                            onSaveForLater={handleSaveForLater}
                        />

                        {/* Delivery Options */}
                        <DeliveryOptions
                            options={delivery_options}
                            selectedOption={selectedDeliveryOption}
                            onSelectOption={handleDeliveryOptionChange}
                        />

                        {/* Address Selector */}
                        <AddressSelector
                            addresses={user_addresses}
                            selectedAddress={selectedAddress}
                            onSelectAddress={setSelectedAddress}
                        />

                        {/* Saved Items */}
                        {savedItems.length > 0 && (
                            <SavedItems
                                items={savedItems}
                                onMoveToCart={handleMoveToCart}
                            />
                        )}

                        {/* Recommended Items */}
                        <RecommendedItems
                            title="Recommended for You"
                            items={recommended_items}
                        />

                        {/* Recently Viewed Items */}
                        {recent_items.length > 0 && (
                            <RecommendedItems
                                title="Recently Viewed"
                                items={recent_items}
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-4/12 space-y-6">
                        {/* Cart Summary */}
                        <CartSummary
                            summary={cartSummary}
                            isCheckingOut={isCheckingOut}
                            onCheckout={handleCheckout}
                        />

                        {/* Promo Code Section */}
                        <PromoCodeSection
                            promocodes={promocodes}
                            promoCode={promoCode}
                            setPromoCode={setPromoCode}
                            onApply={handleApplyPromoCode}
                            isApplying={isApplyingPromo}
                            appliedCode={cartSummary.promo_code}
                        />

                        {/* Payment Methods */}
                        <PaymentMethods
                            methods={payment_methods}
                            selectedMethod={selectedPaymentMethod}
                            onSelectMethod={setSelectedPaymentMethod}
                        />
                    </div>
                </div>

                {/* Empty Cart Message */}
                <AnimatePresence>
                    {cartItems.length === 0 && !error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center justify-center py-16 text-center"
                        >
                            <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                            <p className="text-gray-600 max-w-md mb-6">
                                It looks like you haven't added any items to your cart yet.
                                Browse our menu to find something delicious!
                            </p>
                            <a
                                href="/menu"
                                className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-full font-medium"
                            >
                                Browse Menu
                            </a>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default Index; 