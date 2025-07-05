import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import RestaurantHero from './Partials/RestaurantHero';
import MenuSection from './Partials/MenuSection';
import ReviewsSection from './Partials/ReviewsSection';
import GallerySection from './Partials/GallerySection';
import LocationSection from './Partials/LocationSection';
import FeaturesSection from './Partials/FeaturesSection';
import SimilarRestaurants from './Partials/SimilarRestaurants';
import OffersSection from './Partials/OffersSection';
import Cart from './Partials/Cart';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/useCart';

const Show = ({ restaurant = {} }) => {
    const [showCart, setShowCart] = useState(false);
    const { items: cartItems = [], cartTotal = '0.00' } = useCart() || {};

    // Create a safe version of the restaurant data with all required fields
    const restaurantData = {
        ...restaurant,
        name: restaurant?.name || 'Restaurant',
        menu: Array.isArray(restaurant?.menu) ? restaurant.menu : [],
        offers: Array.isArray(restaurant?.offers) ? restaurant.offers : [],
        gallery: Array.isArray(restaurant?.gallery) ? restaurant.gallery : [],
        reviews: Array.isArray(restaurant?.reviews) ? restaurant.reviews : [],
        location: restaurant?.location || {},
        features: Array.isArray(restaurant?.features) ? restaurant.features : [],
        similarRestaurants: Array.isArray(restaurant?.similarRestaurants) ? restaurant.similarRestaurants : [],
        cuisine_types: Array.isArray(restaurant?.cuisine_types) ? restaurant.cuisine_types : [],
        badges: Array.isArray(restaurant?.badges) ? restaurant.badges : []
    };

    return (
        <Layout>
            <Head title={restaurantData.name} />

            <div className="min-h-screen">
                <RestaurantHero restaurant={restaurantData} />

                <div className="container mx-auto px-4 space-y-12 mb-24">
                    <MenuSection
                        menu={restaurantData.menu}
                        offers={restaurantData.offers}
                    />
                    <OffersSection offers={restaurantData.offers} />
                    <GallerySection gallery={restaurantData.gallery} />
                    <ReviewsSection reviews={restaurantData.reviews} />
                    <LocationSection location={restaurantData.location} />
                    <FeaturesSection features={restaurantData.features} />
                    <SimilarRestaurants restaurants={restaurantData.similarRestaurants} />
                </div>

                {/* Cart Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 md:hidden">
                    <button
                        onClick={() => setShowCart(true)}
                        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium"
                    >
                        View Cart ({cartItems.length || 0}) · ${cartTotal}
                    </button>
                </div>

                {/* Cart Sheet */}
                <Cart
                    show={showCart}
                    onClose={() => setShowCart(false)}
                    restaurant={restaurantData}
                />
            </div>
        </Layout>
    );
};

export default Show; 