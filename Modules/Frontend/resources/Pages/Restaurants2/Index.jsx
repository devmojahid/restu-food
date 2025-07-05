import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import RestaurantGrid from './Partials/RestaurantGrid';
import SearchSection from './Partials/SearchSection';
import FiltersSection from './Partials/FiltersSection';
import FeaturedRestaurants from './Partials/FeaturedRestaurants';
import PopularCuisines from './Partials/PopularCuisines';
import TopRatedRestaurants from './Partials/TopRatedRestaurants';
import TrendingRestaurants from './Partials/TrendingRestaurants';
import NearbyRestaurants from './Partials/NearbyRestaurants';
import CategoriesSection from './Partials/CategoriesSection';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const Index = ({
    hero = null,
    restaurants = {},
    featuredRestaurants = [],
    popularCuisines = [],
    topRatedRestaurants = [],
    nearbyRestaurants = [],
    trendingRestaurants = [],
    filters = {},
    stats = [],
    categories = []
}) => {
    const [activeFilters, setActiveFilters] = useState({
        cuisine: [],
        rating: null,
        price: [],
        dietary: [],
        features: [],
        distance: null,
        sort: 'recommended',
        page: 1
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('grid'); // 'grid' or 'list'
    const [isLoading, setIsLoading] = useState(false);
    const [hasLocation, setHasLocation] = useState(false);
    const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants?.data || []);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [error, setError] = useState(null);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setHasLocation(true);
                },
                (error) => {
                    console.warn("Error getting location:", error.message);
                }
            );
        }
    }, []);

    // Apply filters
    useEffect(() => {
        if (!restaurants?.data?.length) return;

        setIsLoading(true);

        // Simulate API call for filtering
        const timer = setTimeout(() => {
            try {
                let filtered = [...(restaurants.data || [])];

                // Apply search query
                if (searchQuery) {
                    filtered = filtered.filter(restaurant =>
                        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        restaurant.categories.some(category =>
                            category.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                    );
                }

                // Apply cuisine filter
                if (activeFilters.cuisine.length) {
                    filtered = filtered.filter(restaurant =>
                        restaurant.categories.some(category =>
                            activeFilters.cuisine.includes(category)
                        )
                    );
                }

                // Apply price filter
                if (activeFilters.price.length) {
                    filtered = filtered.filter(restaurant =>
                        activeFilters.price.includes(restaurant.price_range)
                    );
                }

                // Apply rating filter
                if (activeFilters.rating) {
                    filtered = filtered.filter(restaurant =>
                        restaurant.rating >= activeFilters.rating
                    );
                }

                // Apply distance filter
                if (activeFilters.distance) {
                    filtered = filtered.filter(restaurant =>
                        restaurant.distance <= activeFilters.distance
                    );
                }

                // Apply sorting
                switch (activeFilters.sort) {
                    case 'rating_desc':
                        filtered.sort((a, b) => b.rating - a.rating);
                        break;
                    case 'delivery_time_asc':
                        filtered.sort((a, b) => {
                            const aTime = parseInt(a.delivery_time.split('-')[0]);
                            const bTime = parseInt(b.delivery_time.split('-')[0]);
                            return aTime - bTime;
                        });
                        break;
                    case 'distance_asc':
                        filtered.sort((a, b) => a.distance - b.distance);
                        break;
                    case 'price_asc':
                        filtered.sort((a, b) => {
                            const priceToValue = price => price.length;
                            return priceToValue(a.price_range) - priceToValue(b.price_range);
                        });
                        break;
                    case 'price_desc':
                        filtered.sort((a, b) => {
                            const priceToValue = price => price.length;
                            return priceToValue(b.price_range) - priceToValue(a.price_range);
                        });
                        break;
                    default:
                        // Default sorting is recommended (no change)
                        break;
                }

                setFilteredRestaurants(filtered);
                setError(null);
            } catch (err) {
                console.error("Error filtering restaurants:", err);
                setError("Unable to filter restaurants. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, activeFilters, restaurants.data]);

    const toggleFilters = () => {
        setIsFiltersVisible(!isFiltersVisible);
    };

    const clearFilters = () => {
        setActiveFilters({
            cuisine: [],
            rating: null,
            price: [],
            dietary: [],
            features: [],
            distance: null,
            sort: 'recommended',
            page: 1
        });
        setSearchQuery('');
    };

    return (
        <Layout>
            <Head title="Restaurants" />

            {/* Hero Section */}
            {hero && <Hero data={hero} stats={stats} />}

            {/* Search & Filter Section */}
            <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                view={view}
                setView={setView}
                toggleFilters={toggleFilters}
                isFiltersVisible={isFiltersVisible}
                activeFilters={activeFilters}
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className={`w-full lg:w-1/4 ${!isFiltersVisible && isMobile ? 'hidden' : 'block'}`}>
                        <FiltersSection
                            filters={filters}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                            clearFilters={clearFilters}
                        />
                    </div>

                    {/* Restaurant Grid */}
                    <div className={`w-full ${isFiltersVisible && isMobile ? 'hidden' : 'block'} ${isFiltersVisible ? 'lg:w-3/4' : 'lg:w-full'}`}>
                        <RestaurantGrid
                            restaurants={filteredRestaurants}
                            view={view}
                            searchQuery={searchQuery}
                            loading={isLoading}
                            page={activeFilters.page}
                            setPage={(page) => setActiveFilters({ ...activeFilters, page })}
                            totalPages={Math.ceil((filteredRestaurants?.length || 0) / 12)}
                        />
                    </div>
                </div>

                {/* Always show toggle filters button on mobile */}
                {isMobile && (
                    <div className="fixed bottom-6 right-6 z-10">
                        <Button
                            className="rounded-full shadow-lg"
                            onClick={toggleFilters}
                        >
                            {isFiltersVisible ? 'Show Results' : 'Show Filters'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Featured Sections */}
            {featuredRestaurants?.length > 0 && (
                <FeaturedRestaurants restaurants={featuredRestaurants} />
            )}

            {/* Top Rated Restaurants */}
            {topRatedRestaurants?.length > 0 && (
                <TopRatedRestaurants restaurants={topRatedRestaurants} />
            )}

            {/* Nearby Restaurants (only if user has shared location) */}
            {nearbyRestaurants?.length > 0 && hasLocation && (
                <NearbyRestaurants restaurants={nearbyRestaurants} />
            )}

            {/* Trending Restaurants */}
            {trendingRestaurants?.length > 0 && (
                <TrendingRestaurants restaurants={trendingRestaurants} />
            )}

            {/* Categories Section */}
            {categories?.length > 0 && (
                <CategoriesSection categories={categories} />
            )}

            {/* Popular Cuisines Section */}
            {popularCuisines?.length > 0 && (
                <PopularCuisines cuisines={popularCuisines} />
            )}
        </Layout>
    );
};

export default Index; 