import React, { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import Hero from './Partials/Hero';
import MenuGrid from './Partials/MenuGrid';
import MenuFilters from './Partials/MenuFilters';
import SearchSection from './Partials/SearchSection';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/Components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';

const Index = ({ categories, menuItems, filters, stats }) => {
    const [activeFilters, setActiveFilters] = useState({
        category: [],
        price: [],
        dietary: [],
        sort: 'recommended'
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('grid');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const handleFilterChange = useCallback((newFilters) => {
        setActiveFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    return (
        <Layout>
            <Head title="Menu" />

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
                    {/* Mobile Filter Button */}
                    {isMobile && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="mb-4 w-full flex items-center justify-center gap-2"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <MenuFilters
                                    filters={filters}
                                    activeFilters={activeFilters}
                                    onFilterChange={handleFilterChange}
                                />
                            </SheetContent>
                        </Sheet>
                    )}

                    {/* Desktop Filters Sidebar */}
                    {!isMobile && (
                        <div className="w-full lg:w-1/4">
                            <MenuFilters
                                filters={filters}
                                activeFilters={activeFilters}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    )}

                    {/* Menu Grid */}
                    <div className="w-full lg:w-3/4">
                        <MenuGrid
                            categories={categories}
                            menuItems={menuItems}
                            view={view}
                            searchQuery={searchQuery}
                            activeFilters={activeFilters}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Index; 