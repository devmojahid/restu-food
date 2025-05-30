import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import Hero from './Partials/Hero';
import RestaurantHeader from './Partials/RestaurantHeader';
import MenuSection from './Partials/MenuSection';
import GallerySection from './Partials/GallerySection';
import ReviewsSection from './Partials/ReviewsSection';
import AboutSection from './Partials/AboutSection';
import LocationSection from './Partials/LocationSection';
import BookingSection from './Partials/BookingSection';
import ChefsSection from './Partials/ChefsSection';
import OffersSection from './Partials/OffersSection';
import FaqsSection from './Partials/FaqsSection';
import SimilarRestaurants from './Partials/SimilarRestaurants';
import InsightsSection from './Partials/InsightsSection';
import Cart from './Partials/Cart';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/ui/alert';

const Index = ({
    hero = {},
    restaurant = {},
    menu = {},
    gallery = {},
    reviews = {},
    about = {},
    location = {},
    bookingInfo = {},
    schedule = {},
    chefs = [],
    offers = [],
    faqs = [],
    similarRestaurants = [],
    insights = {},
    error = null
}) => {
    const [activeTab, setActiveTab] = useState('menu');
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isCartEmpty, setIsCartEmpty] = useState(true);

    const handleAddToCart = (item) => {
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            // Item exists, update quantity
            const updatedCart = [...cartItems];
            updatedCart[existingItemIndex].quantity += 1;
            setCartItems(updatedCart);
        } else {
            // Add new item
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }

        setIsCartEmpty(false);
    };

    const handleRemoveFromCart = (itemId) => {
        const updatedCart = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedCart);
        setIsCartEmpty(updatedCart.length === 0);
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            handleRemoveFromCart(itemId);
            return;
        }

        const updatedCart = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );

        setCartItems(updatedCart);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0).toFixed(2);
    };

    return (
        <Layout>
            <Head title={restaurant?.name || 'Restaurant Detail'} />

            {error && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            <Hero data={hero} restaurant={restaurant} />

            <div className="container mx-auto px-4 py-8">
                <RestaurantHeader restaurant={restaurant} />

                <Tabs
                    defaultValue="menu"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="mt-8"
                >
                    <div className="border-b border-gray-200 dark:border-gray-800 sticky top-16 bg-white dark:bg-gray-900 z-20 pb-0">
                        <div className="container mx-auto px-4">
                            <TabsList className="h-12 bg-transparent rounded-none -mb-px space-x-8">
                                <TabsTrigger
                                    value="menu"
                                    className="h-12 px-4 py-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-gray-600 data-[state=active]:text-primary hover:text-primary"
                                >
                                    Menu
                                </TabsTrigger>
                                <TabsTrigger
                                    value="gallery"
                                    className="h-12 px-4 py-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-gray-600 data-[state=active]:text-primary hover:text-primary"
                                >
                                    Gallery
                                </TabsTrigger>
                                <TabsTrigger
                                    value="reviews"
                                    className="h-12 px-4 py-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-gray-600 data-[state=active]:text-primary hover:text-primary"
                                >
                                    Reviews
                                </TabsTrigger>
                                <TabsTrigger
                                    value="about"
                                    className="h-12 px-4 py-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-gray-600 data-[state=active]:text-primary hover:text-primary"
                                >
                                    About
                                </TabsTrigger>
                                <TabsTrigger
                                    value="location"
                                    className="h-12 px-4 py-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-gray-600 data-[state=active]:text-primary hover:text-primary"
                                >
                                    Location
                                </TabsTrigger>
                                <TabsTrigger
                                    value="booking"
                                    className="h-12 px-4 py-2 font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none text-gray-600 data-[state=active]:text-primary hover:text-primary"
                                >
                                    Booking
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    <TabsContent value="menu" className="mt-6">
                        <MenuSection
                            menu={menu}
                            onAddToCart={handleAddToCart}
                        />
                        {chefs?.length > 0 && <ChefsSection chefs={chefs} />}
                        {offers?.length > 0 && <OffersSection offers={offers} />}
                    </TabsContent>

                    <TabsContent value="gallery" className="mt-6">
                        <GallerySection gallery={gallery} />
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-6">
                        <ReviewsSection reviews={reviews} />
                    </TabsContent>

                    <TabsContent value="about" className="mt-6">
                        <AboutSection about={about} />
                        <InsightsSection insights={insights} />
                        <FaqsSection faqs={faqs} />
                    </TabsContent>

                    <TabsContent value="location" className="mt-6">
                        <LocationSection location={location} schedule={schedule} />
                    </TabsContent>

                    <TabsContent value="booking" className="mt-6">
                        <BookingSection bookingInfo={bookingInfo} restaurant={restaurant} />
                    </TabsContent>
                </Tabs>

                {similarRestaurants?.length > 0 && (
                    <div className="mt-16">
                        <SimilarRestaurants similarRestaurants={similarRestaurants} />
                    </div>
                )}
            </div>

            {/* Floating Cart Button (Mobile) */}
            {!isCartEmpty && (
                <div className="fixed bottom-4 right-4 z-50 md:hidden">
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => setShowCart(true)}
                        className="flex items-center justify-center bg-primary text-white p-4 rounded-full shadow-lg"
                    >
                        <span className="font-medium">View Cart • ${getCartTotal()}</span>
                    </motion.button>
                </div>
            )}

            {/* Cart Sheet */}
            <Cart
                show={showCart}
                onClose={() => setShowCart(false)}
                items={cartItems}
                onRemove={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateQuantity}
                restaurant={restaurant}
            />
        </Layout>
    );
};

export default Index; 