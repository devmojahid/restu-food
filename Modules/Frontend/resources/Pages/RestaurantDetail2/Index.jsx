import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Import all partial components
import Hero from './Partials/Hero';
import QuickInfo from './Partials/QuickInfo';
import Highlights from './Partials/Highlights';
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
import TestimonialsSection from './Partials/TestimonialsSection';
import AwardsSection from './Partials/AwardsSection';
import EventsSection from './Partials/EventsSection';
import Cart from './Partials/Cart';

// Virtual scroll spy for navigation
import { useScrollSpy } from '@/hooks/useScrollSpy';

const RestaurantDetail2 = ({
    hero = null,
    restaurant = null,
    highlights = null,
    menu = null,
    gallery = null,
    reviews = null,
    about = null,
    location = null,
    bookingInfo = null,
    schedule = null,
    chefs = null,
    offers = null,
    faqs = null,
    similarRestaurants = null,
    insights = null,
    testimonials = null,
    awards = null,
    events = null,
    error = null
}) => {
    // State for the cart sidebar
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    // State for active section (for scroll spy)
    const activeSection = useScrollSpy([
        'hero',
        'menu',
        'gallery',
        'reviews',
        'about',
        'location',
        'booking',
        'chefs',
        'offers',
        'faqs',
        'testimonials',
        'awards',
        'events'
    ], {
        offset: 100
    });

    // Handle adding item to cart
    const handleAddToCart = (item) => {
        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            const updatedItems = [...cartItems];
            updatedItems[existingItemIndex].quantity += 1;
            setCartItems(updatedItems);
        } else {
            // Add new item with quantity 1
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }

        // Show cart after adding item
        setShowCart(true);
    };

    // Handle removing item from cart
    const handleRemoveFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    // Handle updating item quantity in cart
    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveFromCart(itemId);
            return;
        }

        setCartItems(cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
    };

    // Calculate cart total whenever items change
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        setCartTotal(total.toFixed(2));
    }, [cartItems]);

    // Check if we have the necessary data to render the page
    if (!restaurant) {
        return (
            <Layout>
                <Head title="Restaurant Not Found" />
                <div className="container mx-auto py-12 px-4">
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error || "Sorry, we couldn't find this restaurant. It may have been removed or you have entered an incorrect URL."}
                        </AlertDescription>
                    </Alert>
                    <div className="text-center py-12">
                        <h1 className="text-3xl font-bold mb-4">Restaurant Not Found</h1>
                        <p className="mb-8">Please check our other restaurants or try again later.</p>
                        <a href="/restaurants" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
                            Browse Restaurants
                        </a>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head title={restaurant?.name || 'Restaurant Details'} />

            {error && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Hero Section */}
            <section id="hero">
                <Hero hero={hero} restaurant={restaurant} />
            </section>

            {/* Quick Info Bar */}
            <QuickInfo restaurant={restaurant} />

            <div className="container mx-auto px-4 space-y-16 sm:space-y-24 mb-24">
                {/* Highlights Section */}
                {highlights?.items?.length > 0 && (
                    <section id="highlights">
                        <Highlights highlights={highlights} />
                    </section>
                )}

                {/* Menu Section */}
                {menu?.categories?.length > 0 && (
                    <section id="menu">
                        <MenuSection
                            menu={menu}
                            onAddToCart={handleAddToCart}
                        />
                    </section>
                )}

                {/* Gallery Section */}
                {gallery?.images?.length > 0 && (
                    <section id="gallery">
                        <GallerySection gallery={gallery} />
                    </section>
                )}

                {/* Testimonials Section - New */}
                {testimonials?.testimonials?.length > 0 && (
                    <section id="testimonials">
                        <TestimonialsSection testimonials={testimonials} />
                    </section>
                )}

                {/* Reviews Section */}
                {reviews?.reviews?.length > 0 && (
                    <section id="reviews">
                        <ReviewsSection reviews={reviews} />
                    </section>
                )}

                {/* About Section */}
                {about && (
                    <section id="about">
                        <AboutSection about={about} />
                    </section>
                )}

                {/* Awards Section - New */}
                {awards?.awards?.length > 0 && (
                    <section id="awards">
                        <AwardsSection awards={awards} />
                    </section>
                )}

                {/* Chefs Section */}
                {chefs?.length > 0 && (
                    <section id="chefs">
                        <ChefsSection chefs={chefs} />
                    </section>
                )}

                {/* Events Section - New */}
                {events?.events?.length > 0 && (
                    <section id="events">
                        <EventsSection events={events} />
                    </section>
                )}

                {/* Location Section */}
                {location && (
                    <section id="location">
                        <LocationSection location={location} />
                    </section>
                )}

                {/* Booking Section */}
                {bookingInfo && (
                    <section id="booking">
                        <BookingSection
                            bookingInfo={bookingInfo}
                            restaurant={restaurant}
                        />
                    </section>
                )}

                {/* Offers Section */}
                {offers?.length > 0 && (
                    <section id="offers">
                        <OffersSection offers={offers} />
                    </section>
                )}

                {/* FAQs Section */}
                {faqs?.length > 0 && (
                    <section id="faqs">
                        <FaqsSection faqs={faqs} />
                    </section>
                )}

                {/* Similar Restaurants */}
                {similarRestaurants?.length > 0 && (
                    <section id="similar-restaurants">
                        <SimilarRestaurants similarRestaurants={similarRestaurants} />
                    </section>
                )}
            </div>

            {/* Cart Sidebar */}
            <Cart
                show={showCart}
                onClose={() => setShowCart(false)}
                items={cartItems}
                total={cartTotal}
                restaurant={restaurant}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
            />

            {/* Cart Button for Mobile */}
            {cartItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 md:hidden z-10">
                    <button
                        onClick={() => setShowCart(true)}
                        className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium"
                    >
                        View Cart ({cartItems.length}) · ${cartTotal}
                    </button>
                </div>
            )}
        </Layout>
    );
};

export default RestaurantDetail2; 