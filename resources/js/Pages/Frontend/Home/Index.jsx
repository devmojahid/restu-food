import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import HeroSlider from './Partials/HeroSlider';
import FeaturedRestaurants from './Partials/FeaturedRestaurants';
import PopularDishes from './Partials/PopularDishes';
import SpecialOffers from './Partials/SpecialOffers';

const Index = ({ heroSlides, featuredRestaurants, popularDishes, specialOffers }) => {
    return (
        <Layout>
            <Head title="Home" />
            
            <HeroSlider slides={heroSlides} />
            
            <div className="container mx-auto px-4 py-12 space-y-16">
                <FeaturedRestaurants restaurants={featuredRestaurants} />
                <PopularDishes dishes={popularDishes} />
                <SpecialOffers offers={specialOffers} />
            </div>
        </Layout>
    );
};

export default Index; 