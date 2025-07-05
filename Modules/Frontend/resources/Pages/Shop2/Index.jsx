import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import FeaturedProducts from './Partials/FeaturedProducts';
import ProductGrid from './Partials/ProductGrid';
import MobileFilters from './Partials/MobileFilters';
import Filters from './Partials/Filters';
import PopularProducts from './Partials/PopularProducts';
import NewArrivals from './Partials/NewArrivals';
import DealOfTheDay from './Partials/DealOfTheDay';
import Testimonials from './Partials/Testimonials';
import Banner from './Partials/Banner';
import TrendingProducts from './Partials/TrendingProducts';
import RecentlyViewed from './Partials/RecentlyViewed';
import Stats from './Partials/Stats';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Drawer, DrawerContent, DrawerTrigger } from '@/Components/ui/drawer';
import { ScrollArea } from '@/Components/ui/scroll-area';

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
    trendingProducts = [],
    recentlyViewed = [],
    stats = [],
    error = null
}) => {
    const [activeFilters, setActiveFilters] = useState({
        category: '',
        brand: '',
        price: '',
        dietary: [],
        rating: null,
        sort: 'popular',
        discount: false,
        availability: 'all',
        shipping: [],
        featured: []
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('grid'); // 'grid' or 'list'
    const [filtersOpen, setFiltersOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [filteredProductsCount, setFilteredProductsCount] = useState(products?.length || 0);

    // Filter products client-side for demonstration
    useEffect(() => {
        if (!products?.length) return;

        // Apply filters logic here (simplified for demo)
        let filtered = [...products];

        if (activeFilters.category) {
            filtered = filtered.filter(p => p.category === activeFilters.category);
        }

        if (activeFilters.brand) {
            filtered = filtered.filter(p => p.brand === activeFilters.brand);
        }

        if (activeFilters.rating) {
            filtered = filtered.filter(p => p.rating >= activeFilters.rating);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                p => p.name.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query)
            );
        }

        setFilteredProductsCount(filtered.length);
    }, [products, activeFilters, searchQuery]);

    // Clear all filters
    const handleClearFilters = () => {
        setActiveFilters({
            category: '',
            brand: '',
            price: '',
            dietary: [],
            rating: null,
            sort: 'popular',
            discount: false,
            availability: 'all',
            shipping: [],
            featured: []
        });
        setSearchQuery('');
    };

    return (
        <Layout>
            <Head title="Enhanced Shop" />

            {error && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Hero Section */}
            {hero && <Hero data={hero} stats={stats} />}

            {/* Stats Section */}
            {stats && <Stats data={stats} />}

            {/* Featured Products Slider */}
            {featuredProducts?.length > 0 && (
                <FeaturedProducts products={featuredProducts} />
            )}

            {/* Main Shop Content */}
            <div className="bg-gray-50 dark:bg-gray-900/50 py-8 md:py-12" id="products">
                <div className="container mx-auto px-4">
                    {/* Mobile Filters Drawer */}
                    {isMobile && (
                        <div className="mb-4">
                            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                <DrawerTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full flex items-center justify-between"
                                    >
                                        <div className="flex items-center">
                                            <Filter className="w-4 h-4 mr-2" />
                                            <span>Filters & Sort</span>
                                        </div>
                                        {Object.values(activeFilters).flat().some(v => v) && (
                                            <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                {Object.values(activeFilters).flat().filter(v => v).length}
                                            </span>
                                        )}
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent className="h-[85vh] pt-4">
                                    <ScrollArea className="h-full px-4">
                                        <MobileFilters
                                            categories={categories}
                                            brands={brands}
                                            filters={filters}
                                            activeFilters={activeFilters}
                                            setActiveFilters={setActiveFilters}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                            onClearFilters={handleClearFilters}
                                            productsCount={filteredProductsCount}
                                            onClose={() => setIsDrawerOpen(false)}
                                        />
                                    </ScrollArea>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Desktop Filters Sidebar */}
                        {!isMobile && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="w-full lg:w-1/4"
                            >
                                <Filters
                                    categories={categories}
                                    brands={brands}
                                    filters={filters}
                                    activeFilters={activeFilters}
                                    setActiveFilters={setActiveFilters}
                                    onClearFilters={handleClearFilters}
                                    productsCount={filteredProductsCount}
                                />
                            </motion.div>
                        )}

                        {/* Product Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full lg:w-3/4"
                        >
                            <ProductGrid
                                products={products}
                                view={view}
                                setView={setView}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                                activeFilters={activeFilters}
                                setActiveFilters={setActiveFilters}
                                isMobile={isMobile}
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Deal of the Day */}
            {dealOfTheDay && <DealOfTheDay product={dealOfTheDay} />}

            {/* Banner */}
            {banner && <Banner data={banner} />}

            {/* Trending Products */}
            {trendingProducts?.length > 0 && (
                <TrendingProducts products={trendingProducts} />
            )}

            {/* Popular Products Section */}
            {popularProducts?.length > 0 && (
                <PopularProducts products={popularProducts} />
            )}

            {/* New Arrivals Section */}
            {newArrivals?.length > 0 && (
                <NewArrivals products={newArrivals} />
            )}

            {/* Recently Viewed */}
            {recentlyViewed?.length > 0 && (
                <RecentlyViewed products={recentlyViewed} />
            )}

            {/* Testimonials */}
            {testimonials?.length > 0 && (
                <Testimonials testimonials={testimonials} />
            )}
        </Layout>
    );
};

export default Index; 