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

const Index = ({ heroSlides, featuredRestaurants, featuredDishes, popularDishes, specialOffers, popularCategories, testimonials, nearbyRestaurants }) => {
    return (
        <Layout>
            <Head title="Home" />
            
            <HeroSlider slides={heroSlides} type="slider" />
            
            <div className="space-y-0">
                <FeaturedRestaurants restaurants={featuredRestaurants} />
                <FeaturedDishes dishes={featuredDishes} />
                <PopularCategories categories={popularCategories} />
                <CustomerTestimonials testimonials={testimonials} />
                <LocationBasedSuggestions restaurants={nearbyRestaurants} />
                <PopularDishes dishes={popularDishes} />
                <SpecialOffers offers={specialOffers} />
            </div>
        </Layout>
    );
};

export default Index; 