import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Grid, 
    List,
    Mic,
    History,
    TrendingUp,
    X,
    Filter,
    ChevronRight
} from 'lucide-react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { useToast } from '@/Components/ui/use-toast';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const SearchSection = ({ searchQuery, setSearchQuery, view, setView }) => {
    const [isListening, setIsListening] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const { toast } = useToast();
    const debouncedSearch = useDebounce(searchQuery, 300);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Load recent searches from localStorage on mount
    useEffect(() => {
        const savedSearches = localStorage.getItem('menu_recent_searches');
        if (savedSearches) {
            try {
                setRecentSearches(JSON.parse(savedSearches));
            } catch (error) {
                console.error('Error loading recent searches:', error);
            }
        }
    }, []);

    // Handle click outside
    useClickOutside(searchRef, () => {
        setShowSuggestions(false);
    });

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setShowSuggestions(false);
                inputRef.current?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Popular search suggestions
    const popularSearches = [
        { text: 'Pizza', count: '250+ items' },
        { text: 'Burger', count: '180+ items' },
        { text: 'Sushi', count: '120+ items' },
        { text: 'Vegetarian', count: '150+ items' }
    ];

    // Trending searches
    const trendingSearches = [
        { text: 'Healthy Bowls', trend: '+120%' },
        { text: 'Spicy Ramen', trend: '+85%' },
        { text: 'Vegan Options', trend: '+65%' }
    ];

    const handleVoiceSearch = useCallback(() => {
        if (!('webkitSpeechRecognition' in window)) {
            toast({
                title: "Voice Search Unavailable",
                description: "Your browser doesn't support voice search.",
                variant: "destructive"
            });
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            addToRecentSearches(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            toast({
                title: "Voice Search Error",
                description: "There was an error with voice recognition. Please try again.",
                variant: "destructive"
            });
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    }, [setSearchQuery]);

    const addToRecentSearches = useCallback((search) => {
        setRecentSearches(prev => {
            const newSearches = [search, ...prev.filter(s => s !== search)].slice(0, 5);
            localStorage.setItem('menu_recent_searches', JSON.stringify(newSearches));
            return newSearches;
        });
    }, []);

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        localStorage.removeItem('menu_recent_searches');
    }, []);

    const handleSearchSelect = useCallback((search) => {
        setSearchQuery(search);
        addToRecentSearches(search);
        setShowSuggestions(false);
    }, [setSearchQuery, addToRecentSearches]);

    return (
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-96" ref={searchRef}>
                        <div className="relative">
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder={isMobile ? "Search..." : "Search menu items..."}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                className={cn(
                                    "pl-10 pr-20",
                                    "transition-all duration-200",
                                    "focus:ring-2 focus:ring-primary/20",
                                    isMobile && showSuggestions && "rounded-b-none"
                                )}
                                aria-expanded={showSuggestions}
                                aria-controls="search-suggestions"
                                aria-label="Search menu items"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            
                            {/* Clear & Voice Search Buttons */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <AnimatePresence>
                                    {searchQuery && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setShowSuggestions(false);
                                                    inputRef.current?.focus();
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800",
                                        "transition-colors duration-200",
                                        isListening && "text-primary animate-pulse"
                                    )}
                                    onClick={handleVoiceSearch}
                                    aria-label="Voice search"
                                >
                                    <Mic className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Search Suggestions Dropdown */}
                        <AnimatePresence>
                            {showSuggestions && (
                                <motion.div
                                    id="search-suggestions"
                                    initial={isMobile ? { opacity: 1, y: -1 } : { opacity: 0, y: -10 }}
                                    animate={isMobile ? { opacity: 1, y: -1 } : { opacity: 1, y: 0 }}
                                    exit={isMobile ? { opacity: 0, y: -10 } : { opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className={cn(
                                        "absolute left-0 right-0",
                                        "bg-white dark:bg-gray-800",
                                        "border border-gray-200 dark:border-gray-700",
                                        "overflow-hidden",
                                        isMobile ? [
                                            "border-t-0",
                                            "rounded-b-lg",
                                            "shadow-lg",
                                            "max-h-[80vh]",
                                            "overflow-y-auto"
                                        ] : [
                                            "mt-2",
                                            "rounded-lg",
                                            "shadow-lg"
                                        ]
                                    )}
                                >
                                    {/* Recent Searches */}
                                    {recentSearches.length > 0 && (
                                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <History className="w-4 h-4 mr-2" />
                                                    Recent Searches
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={clearRecentSearches}
                                                    className="text-xs hover:text-primary"
                                                >
                                                    Clear All
                                                </Button>
                                            </div>
                                            <div className="space-y-1">
                                                {recentSearches.map((search, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSearchSelect(search)}
                                                        className="w-full text-left px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        {search}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Popular Searches */}
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            <Search className="w-4 h-4 mr-2" />
                                            Popular Searches
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {popularSearches.map((search, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSearchSelect(search.text)}
                                                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <span>{search.text}</span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {search.count}
                                                    </Badge>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Trending Searches */}
                                    <div className="p-4">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            <TrendingUp className="w-4 h-4 mr-2" />
                                            Trending Now
                                        </div>
                                        <div className="space-y-2">
                                            {trendingSearches.map((search, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSearchSelect(search.text)}
                                                    className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <span>{search.text}</span>
                                                    <span className="text-green-500 text-xs font-medium">
                                                        {search.trend}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                        <motion.div 
                            className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant={view === 'grid' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setView('grid')}
                                className={cn(
                                    "w-9 h-9",
                                    "transition-all duration-200"
                                )}
                                aria-label="Grid view"
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={view === 'list' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setView('list')}
                                className={cn(
                                    "w-9 h-9",
                                    "transition-all duration-200"
                                )}
                                aria-label="List view"
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchSection; 