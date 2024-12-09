import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, History, TrendingUp, X, Mic, ChevronRight } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Backdrop from '@/Components/ui/backdrop';

const popularCategories = [
    { id: 1, name: 'Pizza', icon: '🍕', count: '250+ items' },
    { id: 2, name: 'Burger', icon: '🍔', count: '180+ items' },
    { id: 3, name: 'Sushi', icon: '🍱', count: '120+ items' },
    { id: 4, name: 'Italian', icon: '🍝', count: '200+ items' },
    { id: 5, name: 'Chinese', icon: '🥡', count: '300+ items' },
    { id: 6, name: 'Indian', icon: '🍛', count: '150+ items' },
];

const trendingSearches = [
    { id: 1, term: 'Pepperoni Pizza', count: '+250% searches' },
    { id: 2, term: 'Chicken Wings', count: '+180% searches' },
    { id: 3, term: 'Vegan Burger', count: '+120% searches' },
];

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const debouncedQuery = useDebounce(query, 300);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Lock scroll when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsLoading(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsLoading(false);
            };

            recognition.onend = () => {
                setIsLoading(false);
            };

            recognition.start();
        }
    };

    const addToRecentSearches = (term) => {
        const newSearch = { term, timestamp: new Date().toISOString() };
        const updatedSearches = [
            newSearch,
            ...recentSearches.filter(s => s.term !== term)
        ].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        const handleSearch = async () => {
            if (!debouncedQuery) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                // Simulated API call - replace with your actual API
                await new Promise(resolve => setTimeout(resolve, 500));
                const mockResults = [
                    {
                        id: 1,
                        type: 'restaurant',
                        name: `Restaurant matching "${debouncedQuery}"`,
                        image: '/images/restaurants/1.jpg',
                        rating: 4.5,
                        cuisine: 'Italian'
                    },
                    {
                        id: 2,
                        type: 'dish',
                        name: `Dish matching "${debouncedQuery}"`,
                        image: '/images/dishes/1.jpg',
                        price: 12.99,
                        restaurant: 'Sample Restaurant'
                    }
                ];
                setResults(mockResults);

                if (debouncedQuery.length > 2) {
                    addToRecentSearches(debouncedQuery);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        handleSearch();
    }, [debouncedQuery]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const SearchResults = () => (
        <div className="space-y-4">
            {results.map((result) => (
                <Link
                    key={result.id}
                    href={result.type === 'restaurant' ? `/restaurants/${result.id}` : `/dishes/${result.id}`}
                    className={cn(
                        "flex items-start space-x-4 p-4",
                        "rounded-xl",
                        "bg-white dark:bg-gray-800/50",
                        "border border-gray-100 dark:border-gray-800",
                        "hover:shadow-md transition-shadow",
                        "group"
                    )}
                    onClick={onClose}
                >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                            src={result.image}
                            alt={result.name}
                            className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                            {result.name}
                        </h4>
                        {result.type === 'restaurant' ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {result.cuisine} • {result.rating} ⭐
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ${result.price} • {result.restaurant}
                            </p>
                        )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </Link>
            ))}
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <Backdrop isOpen={isOpen} onClose={onClose} />

                    <motion.div
                        initial={isMobile ? { y: '100%' } : { opacity: 0, y: -20 }}
                        animate={isMobile ? { y: 0 } : { opacity: 1, y: 0 }}
                        exit={isMobile ? { y: '100%' } : { opacity: 0, y: -20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
                        className={cn(
                            "fixed z-50",
                            isMobile ? [
                                "inset-x-0 bottom-0 top-20",
                                "rounded-t-3xl",
                            ] : [
                                "inset-x-0 top-0",
                            ],
                            "bg-white dark:bg-gray-900",
                            "overflow-hidden"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-full flex flex-col">
                            {/* Search Input Section */}
                            <div className={cn(
                                "flex-shrink-0",
                                "px-4 py-4",
                                "border-b dark:border-gray-800",
                                "bg-white dark:bg-gray-900",
                                "sticky top-0 z-10"
                            )}>
                                <div className="max-w-3xl mx-auto relative">
                                    <div className="relative flex items-center">
                                        <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search for food, restaurants..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className={cn(
                                                "w-full pl-12 pr-20 py-3",
                                                "bg-gray-50 dark:bg-gray-800",
                                                "border border-gray-200 dark:border-gray-700",
                                                "rounded-xl",
                                                "text-base",
                                                "placeholder-gray-500 dark:placeholder-gray-400",
                                                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                                                "dark:text-white",
                                                "transition-all duration-200"
                                            )}
                                            autoFocus
                                        />
                                        <div className="absolute right-3 flex items-center space-x-2">
                                            {query && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-700"
                                                    onClick={() => setQuery('')}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn(
                                                    "h-8 w-8",
                                                    "hover:bg-gray-200 dark:hover:bg-gray-700",
                                                    isLoading && "animate-pulse"
                                                )}
                                                onClick={handleVoiceSearch}
                                            >
                                                <Mic className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Content */}
                            <div className="flex-1 overflow-y-auto overscroll-contain">
                                <div className={cn(
                                    "max-w-3xl mx-auto",
                                    "px-4 py-6",
                                    "space-y-6"
                                )}>
                                    {query ? (
                                        <div className="space-y-4">
                                            {isLoading ? (
                                                <div className="flex justify-center py-8">
                                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                </div>
                                            ) : results.length > 0 ? (
                                                <SearchResults />
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500 dark:text-gray-400">
                                                        No results found for "{query}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Recent Searches */}
                                            {recentSearches.length > 0 && (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-base font-medium flex items-center">
                                                            <History className="h-4 w-4 mr-2" />
                                                            Recent Searches
                                                        </h3>
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
                                                                onClick={() => setQuery(search.term)}
                                                                className={cn(
                                                                    "w-full text-left px-4 py-2",
                                                                    "rounded-lg",
                                                                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                                                                    "transition-colors"
                                                                )}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                        {search.term}
                                                                    </span>
                                                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Popular Categories */}
                                            <div className="space-y-3">
                                                <h3 className="text-base font-medium">Popular Categories</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {popularCategories.map((category) => (
                                                        <Link
                                                            key={category.id}
                                                            href={`/menu?category=${category.name.toLowerCase()}`}
                                                            className={cn(
                                                                "flex items-center space-x-3 p-3",
                                                                "rounded-xl",
                                                                "hover:bg-gray-100 dark:hover:bg-gray-800",
                                                                "transition-colors group"
                                                            )}
                                                            onClick={onClose}
                                                        >
                                                            <span className="text-2xl">{category.icon}</span>
                                                            <div>
                                                                <div className="font-medium group-hover:text-primary">
                                                                    {category.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {category.count}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay; 