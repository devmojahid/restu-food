import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import FeaturedProducts from './Partials/FeaturedProducts';
import ProductGrid from './Partials/ProductGrid';
import Filters from './Partials/Filters';
import PopularProducts from './Partials/PopularProducts';
import NewArrivals from './Partials/NewArrivals';
import DealOfTheDay from './Partials/DealOfTheDay';
import Testimonials from './Partials/Testimonials';
import Banner from './Partials/Banner';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Index = ({
    hero = null,
    featuredProducts = [],
    products = [],
    categories = [],
    brands = [],
    filters = {},
    popularProducts = [],
    newArrivals = [],
    dealOfTheDay = null,
    testimonials = [],
    banner = null,
    error = null
}) => {
    const [activeFilters, setActiveFilters] = useState({
        category: '',
        brand: '',
        price: '',
        dietary: [],
        rating: null,
        sort: 'popular'
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('grid'); // 'grid' or 'list'

    return (
        <Layout>
            <Head title="Shop" />

            {error && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Hero Section */}
            {hero && <Hero data={hero} />}

            {/* Featured Products Slider */}
            {featuredProducts?.length > 0 && (
                <FeaturedProducts products={featuredProducts} />
            )}

            {/* Main Shop Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <Filters
                            categories={categories}
                            brands={brands}
                            filters={filters}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                        />
                    </div>

                    {/* Product Grid */}
                    <div className="w-full lg:w-3/4">
                        <ProductGrid
                            products={products}
                            view={view}
                            setView={setView}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            activeFilters={activeFilters}
                        />
                    </div>
                </div>
            </div>

            {/* Deal of the Day */}
            {dealOfTheDay && <DealOfTheDay deal={dealOfTheDay} />}

            {/* Popular Products Section */}
            {popularProducts?.length > 0 && (
                <PopularProducts products={popularProducts} />
            )}

            {/* Banner */}
            {banner && <Banner data={banner} />}

            {/* New Arrivals Section */}
            {newArrivals?.length > 0 && (
                <NewArrivals products={newArrivals} />
            )}

            {/* Testimonials */}
            {testimonials?.length > 0 && (
                <Testimonials testimonials={testimonials} />
            )}
        </Layout>
    );
};

export default Index; 