import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import HeroSlider from './Partials/HeroSlider';
import FeaturedRestaurants from './Partials/FeaturedRestaurants';
import FeaturedDishes from './Partials/FeaturedDishes';
import PopularDishes from './Partials/PopularDishes';
import SpecialOffers from './Partials/SpecialOffers';
import PopularCategories from './Partials/PopularCategories';
import LocationBasedSuggestions from './Partials/LocationBasedSuggestions';
import CustomerTestimonials from './Partials/CustomerTestimonials';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Index = ({
    heroSlides = [],
    featuredRestaurants = [],
    featuredDishes = [],
    popularDishes = [],
    specialOffers = [],
    popularCategories = [],
    testimonials = [],
    nearbyRestaurants = [],
    error
}) => {
    console.log(featuredRestaurants);
    return (
        <Layout>
            <Head title="Home" />

            {error && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Only render the hero slider if we have slides */}
            {heroSlides?.length > 0 && (
                <HeroSlider slides={heroSlides} type="slider" />
            )}

            <div className="space-y-0">
                {featuredRestaurants?.restaurants?.length > 0 && (
                    <FeaturedRestaurants data={featuredRestaurants} />
                )}

                {featuredDishes?.length > 0 && (
                    <FeaturedDishes dishes={featuredDishes} />
                )}

                {popularCategories?.length > 0 && (
                    <PopularCategories categories={popularCategories} />
                )}

                {testimonials?.length > 0 && (
                    <CustomerTestimonials testimonials={testimonials} />
                )}

                {nearbyRestaurants?.length > 0 && (
                    <LocationBasedSuggestions restaurants={nearbyRestaurants} />
                )}

                {popularDishes?.length > 0 && (
                    <PopularDishes dishes={popularDishes} />
                )}

                {specialOffers?.length > 0 && (
                    <SpecialOffers offers={specialOffers} />
                )}
            </div>
        </Layout>
    );
};

export default Index;
