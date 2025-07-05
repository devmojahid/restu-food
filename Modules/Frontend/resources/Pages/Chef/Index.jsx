import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle } from 'lucide-react';

import Hero from './Partials/Hero';
import FeaturedChefs from './Partials/FeaturedChefs';
import ChefCategories from './Partials/ChefCategories';
import ChefGrid from './Partials/ChefGrid';
import Testimonials from './Partials/Testimonials';
import JoinSection from './Partials/JoinSection';
import FAQ from './Partials/FAQ';
import ChefStats from './Partials/ChefStats';

const Index = ({
    hero = null,
    featuredChefs = [],
    categories = [],
    chefs = [],
    testimonials = [],
    stats = [],
    joinSection = [],
    faqs = [],
    error = null
}) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('featured');

    // Filter chefs based on search query and active category
    const filteredChefs = chefs?.filter(chef => {
        // Filter by search query
        if (searchQuery && !chef.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !chef.cuisine.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Filter by category
        if (activeCategory !== 'all' && chef.cuisine !== activeCategory) {
            return false;
        }

        return true;
    });

    // Sort chefs based on sortBy
    const sortedChefs = [...filteredChefs].sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'experience':
                return parseInt(b.experience) - parseInt(a.experience);
            case 'name':
                return a.name.localeCompare(b.name);
            case 'featured':
            default:
                return b.featured ? 1 : -1;
        }
    });

    return (
        <Layout>
            <Head title="Our Culinary Masters | Chef Profiles" />

            {error && (
                <div className="container mx-auto px-4 py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            )}

            {hero && <Hero data={hero} />}

            <div className="space-y-16 md:space-y-24 pb-16">
                {featuredChefs?.length > 0 && (
                    <FeaturedChefs chefs={featuredChefs} />
                )}

                {stats?.length > 0 && (
                    <ChefStats stats={stats} />
                )}

                {categories?.length > 0 && (
                    <ChefCategories
                        categories={categories}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                    />
                )}

                <ChefGrid
                    chefs={sortedChefs}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                {testimonials?.length > 0 && (
                    <Testimonials testimonials={testimonials} />
                )}

                {joinSection && Object.keys(joinSection).length > 0 && (
                    <JoinSection data={joinSection} />
                )}

                {faqs?.length > 0 && (
                    <FAQ faqs={faqs} />
                )}
            </div>
        </Layout>
    );
};

export default Index; 