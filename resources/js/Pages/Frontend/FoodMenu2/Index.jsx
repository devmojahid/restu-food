import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '@/Layouts/Frontend/Layout';
import Hero from './Partials/Hero';
import CategoryNavigation from './Partials/CategoryNavigation';
import SearchSection from './Partials/SearchSection';
import MenuFilters from './Partials/MenuFilters';
import FeaturedItems from './Partials/FeaturedItems';
import PopularCombos from './Partials/PopularCombos';
import NutritionalGuide from './Partials/NutritionalGuide';
import MenuGrid from './Partials/MenuGrid';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Index = ({
    hero = {},
    categories = [],
    menuItems = [],
    featuredItems = [],
    popularCombos = [],
    nutritionalGuide = {},
    filters = {},
    stats = {},
    error
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeFilters, setActiveFilters] = useState({
        dietary: [],
        price: [],
        meal_type: [],
        preparation_time: [],
        sort: 'recommended'
    });
    const [filteredItems, setFilteredItems] = useState(menuItems);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [isLoading, setIsLoading] = useState(false);
    const [filterError, setFilterError] = useState(null);

    // Apply filters when filter state or search query changes
    useEffect(() => {
        try {
            setIsLoading(true);
            setFilterError(null);

            // Filter items based on search query and active filters
            let filtered = [...menuItems];

            // Apply search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    (item.description && item.description.toLowerCase().includes(query))
                );
            }

            // Apply category filter
            if (activeCategory !== 'all') {
                filtered = filtered.filter(item =>
                    item.category && item.category.slug === activeCategory
                );
            }

            // Apply dietary filters
            if (activeFilters.dietary.length > 0) {
                filtered = filtered.filter(item => {
                    // Check if item matches any of the selected dietary filters
                    return activeFilters.dietary.some(diet => {
                        switch (diet) {
                            case 'vegetarian': return item.is_vegetarian;
                            case 'vegan': return item.is_vegetarian && !item.allergens.includes('Dairy');
                            case 'gluten_free': return !item.allergens.includes('Gluten');
                            case 'dairy_free': return !item.allergens.includes('Dairy');
                            case 'spicy': return item.is_spicy;
                            default: return true;
                        }
                    });
                });
            }

            // Apply price range filters
            if (activeFilters.price.length > 0) {
                filtered = filtered.filter(item => {
                    return activeFilters.price.some(range => {
                        const [min, max] = range.split('-').map(Number);
                        return max ? (item.price >= min && item.price < max) : (item.price >= min);
                    });
                });
            }

            // Apply meal type filters if any
            if (activeFilters.meal_type.length > 0) {
                // For demo purposes, we'll just randomly filter some items
                // In a real app, this would check against actual meal type properties
                filtered = filtered.filter(item =>
                    item.id % (activeFilters.meal_type.length + 2) !== 0
                );
            }

            // Apply preparation time filters if any
            if (activeFilters.preparation_time.length > 0) {
                filtered = filtered.filter(item => {
                    const prepTimeMinutes = parseInt(item.preparation_time.split('-')[0]);

                    return activeFilters.preparation_time.some(time => {
                        switch (time) {
                            case 'quick': return prepTimeMinutes < 15;
                            case 'medium': return prepTimeMinutes >= 15 && prepTimeMinutes <= 30;
                            case 'slow': return prepTimeMinutes > 30;
                            default: return true;
                        }
                    });
                });
            }

            // Apply sorting
            if (activeFilters.sort) {
                switch (activeFilters.sort) {
                    case 'price_asc':
                        filtered.sort((a, b) => a.price - b.price);
                        break;
                    case 'price_desc':
                        filtered.sort((a, b) => b.price - a.price);
                        break;
                    case 'rating':
                        filtered.sort((a, b) => b.rating - a.rating);
                        break;
                    case 'popularity':
                        filtered.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
                        break;
                    case 'newest':
                        filtered.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
                        break;
                    // recommended is default order
                    default:
                        break;
                }
            }

            // Short timeout to prevent immediate update and reduce flickering
            setTimeout(() => {
                setFilteredItems(filtered);
                setIsLoading(false);
            }, 50);
        } catch (err) {
            console.error("Error applying filters:", err);
            setFilterError("Error applying filters. Please try again.");
            setIsLoading(false);
        }
    }, [searchQuery, activeCategory, activeFilters, menuItems]);

    const handleFilterChange = (type, value) => {
        try {
            setActiveFilters(prev => {
                if (type === 'sort') {
                    return { ...prev, sort: value };
                }

                const currentValues = [...prev[type]];
                const valueIndex = currentValues.indexOf(value);

                if (valueIndex === -1) {
                    // Add the value
                    currentValues.push(value);
                } else {
                    // Remove the value
                    currentValues.splice(valueIndex, 1);
                }

                return { ...prev, [type]: currentValues };
            });
        } catch (err) {
            console.error("Error changing filters:", err);
            setFilterError("Error changing filters. Please try again.");
        }
    };

    const clearFilters = () => {
        try {
            setActiveFilters({
                dietary: [],
                price: [],
                meal_type: [],
                preparation_time: [],
                sort: 'recommended'
            });
            setSearchQuery('');
            setActiveCategory('all');
            setFilterError(null);
        } catch (err) {
            console.error("Error clearing filters:", err);
            setFilterError("Error clearing filters. Please try again.");
        }
    };

    // Error message to display (backend error or filter error)
    const displayError = error || filterError;

    return (
        <Layout>
            <Head title="Food Menu" />

            {/* Error Alert */}
            {displayError && (
                <div className="container mx-auto py-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{displayError}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Hero Section */}
            <Hero data={hero} />

            {/* Category Navigation */}
            <div id="category-navigation">
                <CategoryNavigation
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
            </div>

            {/* Search & Filters */}
            <SearchSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <MenuFilters
                            key="menu-filters"
                            filters={filters}
                            activeFilters={activeFilters}
                            handleFilterChange={handleFilterChange}
                            clearFilters={clearFilters}
                        />
                    </div>

                    {/* Menu Items Grid */}
                    <div className="w-full lg:w-3/4">
                        <MenuGrid
                            key={`menu-grid-${viewMode}-${filteredItems.length}`}
                            items={filteredItems}
                            viewMode={viewMode}
                            searchQuery={searchQuery}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Featured Items */}
            {featuredItems?.length > 0 && (
                <FeaturedItems key="featured-items" items={featuredItems} />
            )}

            {/* Popular Combos */}
            {popularCombos?.length > 0 && (
                <PopularCombos key="popular-combos" combos={popularCombos} />
            )}

            {/* Nutritional Guide */}
            {nutritionalGuide?.categories?.length > 0 && (
                <NutritionalGuide key="nutritional-guide" data={nutritionalGuide} />
            )}
        </Layout>
    );
};

export default Index; 