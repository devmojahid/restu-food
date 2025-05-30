import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, Filter, X, MapPin } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/Components/ui/toggle-group';
import { Badge } from '@/Components/ui/badge';
import { cn } from '@/lib/utils';

const SearchSection = ({
    searchQuery,
    setSearchQuery,
    view,
    setView,
    toggleFilters,
    isFiltersVisible,
    activeFilters
}) => {
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Calculate active filter count
    const getActiveFilterCount = () => {
        let count = 0;
        if (activeFilters.cuisine?.length) count += activeFilters.cuisine.length;
        if (activeFilters.price?.length) count += activeFilters.price.length;
        if (activeFilters.dietary?.length) count += activeFilters.dietary.length;
        if (activeFilters.features?.length) count += activeFilters.features.length;
        if (activeFilters.rating) count += 1;
        if (activeFilters.distance) count += 1;
        if (activeFilters.sort && activeFilters.sort !== 'recommended') count += 1;
        return count;
    };

    const activeFilterCount = getActiveFilterCount();

    // Handle search input clear
    const handleClearSearch = () => {
        setSearchQuery('');
    };

    // Display active filter summary
    const getActiveFilterSummary = () => {
        const summary = [];

        if (activeFilters.price?.length) {
            summary.push(`${activeFilters.price.join(', ')}`);
        }

        if (activeFilters.cuisine?.length) {
            if (activeFilters.cuisine.length === 1) {
                summary.push(activeFilters.cuisine[0]);
            } else {
                summary.push(`${activeFilters.cuisine.length} cuisines`);
            }
        }

        if (activeFilters.rating) {
            summary.push(`${activeFilters.rating}+ stars`);
        }

        if (activeFilters.distance) {
            summary.push(`Within ${activeFilters.distance}km`);
        }

        if (activeFilters.dietary?.length) {
            if (activeFilters.dietary.length === 1) {
                summary.push(activeFilters.dietary[0]);
            } else {
                summary.push(`${activeFilters.dietary.length} dietary options`);
            }
        }

        if (activeFilters.features?.length) {
            if (activeFilters.features.length === 1) {
                summary.push(activeFilters.features[0]);
            } else {
                summary.push(`${activeFilters.features.length} features`);
            }
        }

        if (activeFilters.sort && activeFilters.sort !== 'recommended') {
            const sortMap = {
                'rating_desc': 'Highest rated',
                'delivery_time_asc': 'Fastest delivery',
                'distance_asc': 'Nearest first',
                'price_asc': 'Price low to high',
                'price_desc': 'Price high to low',
            };

            summary.push(sortMap[activeFilters.sort]);
        }

        return summary;
    };

    const activeFilterSummary = getActiveFilterSummary();

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "sticky top-16 z-30 bg-white dark:bg-gray-900 shadow-sm border-b",
                isSearchFocused ? "shadow-md" : ""
            )}
        >
            <div className="container mx-auto p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search restaurants, cuisines, dishes..."
                            className="pl-9 pr-9 py-2 h-11 text-sm md:text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        {searchQuery && (
                            <button
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                onClick={handleClearSearch}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Filter Button (Mobile) */}
                        <div className="block md:hidden">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleFilters}
                                className={isFiltersVisible ? "border-primary text-primary" : ""}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                <span>Filters</span>
                                {activeFilterCount > 0 && (
                                    <Badge variant="default" className="ml-1 h-5 min-w-5 p-0 flex items-center justify-center">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </div>

                        {/* Filter Toggle (Desktop) */}
                        <div className="hidden md:block">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleFilters}
                                className={isFiltersVisible ? "border-primary text-primary" : ""}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                <span>{isFiltersVisible ? "Hide Filters" : "Show Filters"}</span>
                                {activeFilterCount > 0 && (
                                    <Badge variant="default" className="ml-1 h-5 min-w-5 p-0 flex items-center justify-center">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </div>

                        {/* View Toggle */}
                        <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value)}>
                            <ToggleGroupItem value="grid" aria-label="Toggle grid view">
                                <Grid className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="list" aria-label="Toggle list view">
                                <List className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>

                {/* Active Filters */}
                {activeFilterSummary.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {activeFilterSummary.map((filter, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                {filter}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SearchSection; 