import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import FeaturedOffers from './Partials/FeaturedOffers';
import OfferCategories from './Partials/OfferCategories';
import LatestOffers from './Partials/LatestOffers';
import PopularOffers from './Partials/PopularOffers';
import SearchSection from './Partials/SearchSection';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Index = ({
    hero = {},
    featured_offers = [],
    categories = [],
    latest_offers = [],
    popular_offers = [],
    stats = [],
    error
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);

    // Function to filter offers based on search query and active category
    const filterOffers = (offers) => {
        if (!offers || !Array.isArray(offers)) return [];

        return offers.filter(offer => {
            const matchesSearch = !searchQuery ||
                offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                offer.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                offer.restaurant?.name?.toLowerCase().includes(searchQuery.toLowerCase());

            // Handle both string and object cases for activeCategory
            const categoryName = typeof activeCategory === 'string'
                ? activeCategory
                : activeCategory?.name;

            const matchesCategory = !activeCategory ||
                offer.category?.toLowerCase() === categoryName?.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    };

    // Apply filters to each offer type
    const filteredFeatured = filterOffers(featured_offers);
    const filteredLatest = filterOffers(latest_offers);
    const filteredPopular = filterOffers(popular_offers);

    return (
        <Layout>
            <Head title="Special Offers & Discounts" />

            {error && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Hero Section */}
            <Hero data={hero} />

            {/* Search & Filter Section */}
            <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
            />

            {/* Featured Offers Section */}
            {filteredFeatured?.length > 0 && (
                <FeaturedOffers offers={filteredFeatured} />
            )}

            {/* Offer Categories */}
            {categories?.length > 0 && (
                <OfferCategories
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
            )}

            {/* Latest Offers Section */}
            {filteredLatest?.length > 0 && (
                <LatestOffers offers={filteredLatest} />
            )}

            {/* Popular Offers Section */}
            {filteredPopular?.length > 0 && (
                <PopularOffers offers={filteredPopular} stats={stats} />
            )}
        </Layout>
    );
};

export default Index; 