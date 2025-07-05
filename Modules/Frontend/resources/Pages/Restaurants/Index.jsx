import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import RestaurantGrid from './Partials/RestaurantGrid';
import Filters from './Partials/Filters';
import FeaturedRestaurants from './Partials/FeaturedRestaurants';
import PopularCuisines from './Partials/PopularCuisines';
import SearchSection from './Partials/SearchSection';
import { motion } from 'framer-motion';

const Index = ({
    restaurants,
    featuredRestaurants,
    popularCuisines,
    filters,
    stats
}) => {
    const [activeFilters, setActiveFilters] = useState({
        cuisine: [],
        rating: null,
        price: [],
        dietary: [],
        sort: 'recommended'
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('grid'); // 'grid' or 'list'

    return (
        <Layout>
            <Head title="Restaurants" />

            {/* Hero Section */}
            <Hero stats={stats} />

            {/* Search & Filter Section */}
            <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                view={view}
                setView={setView}
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <Filters
                            filters={filters}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                        />
                    </div>

                    {/* Restaurant Grid */}
                    <div className="w-full lg:w-3/4">
                        <RestaurantGrid
                            restaurants={restaurants}
                            view={view}
                            searchQuery={searchQuery}
                            activeFilters={activeFilters}
                        />
                    </div>
                </div>
            </div>

            {/* Featured Restaurants Section */}
            <FeaturedRestaurants restaurants={featuredRestaurants} />

            {/* Popular Cuisines Section */}
            <PopularCuisines cuisines={popularCuisines} />
        </Layout>
    );
};

export default Index; 