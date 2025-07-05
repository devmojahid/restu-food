import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '../Frontend/Layout';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import MenuGrid from './Partials/MenuGrid';
import MenuFilters from './Partials/MenuFilters';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

const Category = ({
    category = null,
    items = [],
    filters = {},
    error = null
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        dietary: [],
        price: [],
        meal_type: [],
        preparation_time: [],
        sort: 'recommended'
    });
    const [filteredItems, setFilteredItems] = useState(items);
    const [viewMode, setViewMode] = useState('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Get dynamic icon component
    const DynamicIcon = (iconName) => {
        if (!iconName) return Icons.Utensils;
        return Icons[iconName] || Icons.Utensils;
    };

    // Apply filters when filter state or search query changes
    useEffect(() => {
        // Filter items based on search query and active filters
        let filtered = [...items];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
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

        setFilteredItems(filtered);
    }, [searchQuery, activeFilters, items]);

    const handleFilterChange = (type, value) => {
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
    };

    const clearFilters = () => {
        setActiveFilters({
            dietary: [],
            price: [],
            meal_type: [],
            preparation_time: [],
            sort: 'recommended'
        });
        setSearchQuery('');
    };

    // If we have an error or no category, show error page
    if (error || !category) {
        return (
            <Layout>
                <Head title="Category Not Found" />
                <div className="container mx-auto py-16 px-4">
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>
                            {error || "The category you're looking for could not be found."}
                        </AlertDescription>
                    </Alert>

                    <Link href="/food-menu">
                        <Button variant="outline" className="flex items-center">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Menu
                        </Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    // Icon component for category
    const CategoryIcon = DynamicIcon(category.icon);

    return (
        <Layout>
            <Head title={`${category.name} Menu`} />

            {/* Category Hero */}
            <div
                className="relative py-16 px-4 bg-cover bg-center text-white"
                style={{
                    backgroundImage: `url(${category.image || '/images/food-menu/category-banner.jpg'})`,
                }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="container mx-auto relative z-10">
                    <div className="flex items-start">
                        <Link href="/food-menu" className="mb-6 md:mb-0">
                            <Button variant="secondary" size="sm" className="flex items-center">
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                    </div>

                    <div className="max-w-3xl mx-auto text-center mt-8">
                        <div className="bg-primary/20 backdrop-blur-sm p-3 rounded-full inline-flex mb-4">
                            <CategoryIcon className="h-8 w-8" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
                        <p className="text-lg text-white/80 mb-6">{category.description}</p>

                        {category.dietary_options && category.dietary_options.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2">
                                {category.dietary_options.map((option, index) => (
                                    <span
                                        key={index}
                                        className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                                    >
                                        {option}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 sticky top-16 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-full md:w-auto flex-1 max-w-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <Input
                                type="text"
                                placeholder={`Search ${category.name}...`}
                                className="pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Button
                                variant="outline"
                                className="flex items-center md:hidden flex-1"
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                            >
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Filters
                                {Object.values(activeFilters).flat().filter(v => v !== 'recommended').length > 0 && (
                                    <span className="ml-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {Object.values(activeFilters).flat().filter(v => v !== 'recommended').length}
                                    </span>
                                )}
                            </Button>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "rounded-md",
                                        viewMode === 'grid' && "bg-gray-100 dark:bg-gray-800"
                                    )}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Icons.LayoutGrid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "rounded-md",
                                        viewMode === 'list' && "bg-gray-100 dark:bg-gray-800"
                                    )}
                                    onClick={() => setViewMode('list')}
                                >
                                    <Icons.List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Mobile Filters (Collapsible) */}
                    <div className={cn(
                        "lg:hidden",
                        !showMobileFilters && "hidden"
                    )}>
                        <div className="mb-6">
                            <MenuFilters
                                filters={filters}
                                activeFilters={activeFilters}
                                handleFilterChange={handleFilterChange}
                                clearFilters={clearFilters}
                            />
                        </div>
                    </div>

                    {/* Desktop Filters Sidebar */}
                    <div className="hidden lg:block lg:w-1/4">
                        <div className="sticky top-32">
                            <MenuFilters
                                filters={filters}
                                activeFilters={activeFilters}
                                handleFilterChange={handleFilterChange}
                                clearFilters={clearFilters}
                            />
                        </div>
                    </div>

                    {/* Menu Items Grid */}
                    <div className="w-full lg:w-3/4">
                        {/* Results Summary */}
                        <div className="mb-6 flex justify-between items-center">
                            <div className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">{filteredItems.length}</span> items found
                                {searchQuery && (
                                    <span> for "<span className="font-medium">{searchQuery}</span>"</span>
                                )}
                            </div>

                            {Object.values(activeFilters).flat().filter(v => v !== 'recommended').length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary"
                                    onClick={clearFilters}
                                >
                                    Clear All Filters
                                </Button>
                            )}
                        </div>

                        {/* Menu Grid */}
                        <MenuGrid
                            items={filteredItems}
                            viewMode={viewMode}
                            searchQuery={searchQuery}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Category; 