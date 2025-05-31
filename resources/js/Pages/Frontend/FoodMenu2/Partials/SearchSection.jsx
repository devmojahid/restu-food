import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';

const SearchSection = ({
    searchQuery = '',
    setSearchQuery,
    viewMode = 'grid',
    setViewMode
}) => {
    const [isSticky, setIsSticky] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const searchSectionRef = useRef(null);
    const inputRef = useRef(null);

    // Handle scroll events to make the search sticky
    useEffect(() => {
        const handleScroll = () => {
            if (!searchSectionRef.current) return;

            const categoryNav = document.querySelector('#category-navigation');
            const categoryNavBottom = categoryNav ? categoryNav.getBoundingClientRect().bottom : 0;

            // Make search sticky when scrolled past category navigation
            setIsSticky(window.scrollY > categoryNavBottom - 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    // Clear search query
    const handleClearSearch = () => {
        setSearchQuery('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Handle view mode change
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };

    return (
        <motion.div
            ref={searchSectionRef}
            className={cn(
                "bg-white dark:bg-gray-900 py-4 transition-all duration-300",
                "border-b border-gray-200 dark:border-gray-800",
                isSticky && "sticky top-16 z-10 shadow-md"
            )}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className={cn(
                        "relative w-full max-w-md transition-all duration-300",
                        inputFocused && "ring-2 ring-primary/50 rounded-lg"
                    )}>
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for dishes, ingredients..."
                            className="pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 w-full"
                            value={searchQuery}
                            onChange={handleSearch}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => setInputFocused(false)}
                        />
                        {searchQuery && (
                            <button
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={handleClearSearch}
                            >
                                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>

                    {/* View Mode Toggles */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">View:</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "rounded-md",
                                viewMode === 'grid' && "bg-gray-100 dark:bg-gray-800"
                            )}
                            onClick={() => handleViewModeChange('grid')}
                        >
                            <Grid className="w-4 h-4 mr-1" />
                            <span className="text-sm">Grid</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "rounded-md",
                                viewMode === 'list' && "bg-gray-100 dark:bg-gray-800"
                            )}
                            onClick={() => handleViewModeChange('list')}
                        >
                            <List className="w-4 h-4 mr-1" />
                            <span className="text-sm">List</span>
                        </Button>
                    </div>
                </div>

                {/* Search Results Indicators */}
                {searchQuery && (
                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Showing results for: <span className="font-medium text-primary">{searchQuery}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SearchSection; 