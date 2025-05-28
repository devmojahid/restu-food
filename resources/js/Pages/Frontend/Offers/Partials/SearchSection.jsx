import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const SearchSection = ({
    searchQuery = '',
    setSearchQuery,
    activeCategory,
    setActiveCategory
}) => {
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [showClearButton, setShowClearButton] = useState(false);

    // Sync local state with props
    useEffect(() => {
        setLocalQuery(searchQuery);
        setShowClearButton(searchQuery?.length > 0);
    }, [searchQuery]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocalQuery(value);
        setShowClearButton(value.length > 0);
    };

    const handleSearch = () => {
        setSearchQuery(localQuery);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClearSearch = () => {
        setLocalQuery('');
        setSearchQuery('');
        setShowClearButton(false);
    };

    const handleClearAll = () => {
        handleClearSearch();
        setActiveCategory(null);
    };

    const categories = [
        'New User Offers',
        'Weekend Specials',
        'Buy One Get One',
        'Free Delivery',
        'Happy Hour',
        'Seasonal Promotions'
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 py-4 sticky top-0 z-10 shadow-md"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Search Input */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                        <Input
                            type="text"
                            placeholder="Search offers, restaurants, or deals..."
                            className="pl-10 pr-10 py-2 h-12"
                            value={localQuery}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        />

                        {showClearButton && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
                                onClick={handleClearSearch}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Dropdown */}
                    <div className="flex gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="min-w-[120px]">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <span>{activeCategory || "All Categories"}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                    onClick={() => setActiveCategory(null)}
                                    className={cn(
                                        activeCategory === null && "bg-primary/10 text-primary"
                                    )}
                                >
                                    All Categories
                                </DropdownMenuItem>

                                {categories.map((category) => (
                                    <DropdownMenuItem
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={cn(
                                            activeCategory === category && "bg-primary/10 text-primary"
                                        )}
                                    >
                                        {category}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Search Button */}
                        <Button onClick={handleSearch} className="min-w-[80px]">
                            Search
                        </Button>

                        {/* Reset Button - Only show if filters are applied */}
                        {(activeCategory || searchQuery) && (
                            <Button
                                variant="ghost"
                                onClick={handleClearAll}
                                className="min-w-[40px]"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                        )}
                    </div>
                </div>

                {/* Active Filters Display */}
                {(activeCategory || searchQuery) && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Active Filters:</span>
                        {activeCategory && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                                Category: {activeCategory}
                            </span>
                        )}
                        {searchQuery && (
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                                Search: "{searchQuery}"
                            </span>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SearchSection; 