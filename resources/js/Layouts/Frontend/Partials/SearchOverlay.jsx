import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState([]);
    const debouncedQuery = useDebounce(query, 300);

    const popularSearches = [
        { id: 1, term: 'Pizza', category: 'Italian' },
        { id: 2, term: 'Burger', category: 'Fast Food' },
        { id: 3, term: 'Sushi', category: 'Japanese' },
        { id: 4, term: 'Pasta', category: 'Italian' },
        { id: 5, term: 'Chinese', category: 'Asian' },
    ];

    useEffect(() => {
        const handleSearch = async () => {
            if (!debouncedQuery) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                // Replace with your actual search API endpoint
                const response = await fetch(`/api/search?q=${debouncedQuery}`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        handleSearch();
    }, [debouncedQuery]);

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white pt-20"
                onClick={e => e.stopPropagation()}
            >
                <div className="container mx-auto px-4 py-6">
                    <div className="relative max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for food, restaurants..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                autoFocus
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                                ) : (
                                    <Search className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                        </div>

                        {/* Search Results */}
                        <div className="mt-6">
                            {query ? (
                                <div className="space-y-4">
                                    {results.map((result) => (
                                        <div 
                                            key={result.id}
                                            className="p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            {/* Render your search results here */}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">
                                        Popular Searches
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {popularSearches.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setQuery(item.term)}
                                                className="group px-3 py-1.5 bg-gray-100 hover:bg-primary/10 rounded-full transition-colors"
                                            >
                                                <span className="text-sm text-gray-700 group-hover:text-primary">
                                                    {item.term}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-1">
                                                    {item.category}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SearchOverlay; 