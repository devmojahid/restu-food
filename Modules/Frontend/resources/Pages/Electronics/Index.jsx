import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import HeroSlider from './Partials/HeroSlider';
import FeaturedProducts from './Partials/FeaturedProducts';
import PopularCategories from './Partials/PopularCategories';
import NewArrivals from './Partials/NewArrivals';
import DealOfTheDay from './Partials/DealOfTheDay';
import TrendingProducts from './Partials/TrendingProducts';
import BrandsShowcase from './Partials/BrandsShowcase';
import CustomerTestimonials from './Partials/CustomerTestimonials';
import PromoSections from './Partials/PromoSections';
import Newsletter from './Partials/Newsletter';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Index = ({
    hero = {},
    featuredProducts = {},
    popularCategories = {},
    newArrivals = {},
    dealOfTheDay = {},
    trendingProducts = {},
    brands = {},
    testimonials = {},
    stats = [],
    newsletterSection = {},
    promoSections = [],
    error = null,
}) => {
    return (
        <Layout>
            <Head title="Electronics Store" />

            {error && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Hero Section */}
            {hero?.slides?.length > 0 && (
                <HeroSlider slides={hero.slides} type={hero.type || 'slider'} />
            )}

            <div className="space-y-16 py-8 md:py-16">
                {/* Featured Products Section */}
                {featuredProducts?.products?.length > 0 && (
                    <FeaturedProducts data={featuredProducts} />
                )}

                {/* Popular Categories Section */}
                {popularCategories?.categories?.length > 0 && (
                    <PopularCategories data={popularCategories} />
                )}

                {/* Deal of the Day */}
                {dealOfTheDay?.product && (
                    <DealOfTheDay data={dealOfTheDay} />
                )}

                {/* New Arrivals Section */}
                {newArrivals?.products?.length > 0 && (
                    <NewArrivals data={newArrivals} />
                )}

                {/* Promo Sections */}
                {promoSections?.length > 0 && (
                    <PromoSections sections={promoSections} />
                )}

                {/* Trending Products */}
                {trendingProducts?.products?.length > 0 && (
                    <TrendingProducts data={trendingProducts} />
                )}

                {/* Brands Showcase */}
                {brands?.brands?.length > 0 && (
                    <BrandsShowcase data={brands} />
                )}

                {/* Customer Testimonials */}
                {testimonials?.testimonials?.length > 0 && (
                    <CustomerTestimonials data={testimonials} />
                )}

                {/* Newsletter Section */}
                {newsletterSection && Object.keys(newsletterSection).length > 0 && (
                    <Newsletter data={newsletterSection} />
                )}
            </div>
        </Layout>
    );
};

export default Index; 