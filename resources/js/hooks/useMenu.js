import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/Components/ui/use-toast';

export const useMenu = (initialItems = []) => {
    const [items, setItems] = useState(initialItems);
    const [wishlist, setWishlist] = useState(new Set());
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filters, setFilters] = useState({
        sort: 'recommended',
        dietary: [],
        price: [],
        category: null
    });
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    // Load wishlist from localStorage
    useEffect(() => {
        const savedWishlist = localStorage.getItem('menu_wishlist');
        if (savedWishlist) {
            try {
                setWishlist(new Set(JSON.parse(savedWishlist)));
            } catch (error) {
                console.error('Error loading wishlist:', error);
            }
        }
    }, []);

    // Save wishlist to localStorage
    const saveWishlist = useCallback((newWishlist) => {
        localStorage.setItem('menu_wishlist', JSON.stringify([...newWishlist]));
    }, []);

    const toggleWishlist = useCallback((itemId) => {
        setWishlist(prev => {
            const newWishlist = new Set(prev);
            if (newWishlist.has(itemId)) {
                newWishlist.delete(itemId);
                toast({
                    title: "Removed from Wishlist",
                    description: "Item has been removed from your wishlist",
                });
            } else {
                newWishlist.add(itemId);
                toast({
                    title: "Added to Wishlist",
                    description: "Item has been added to your wishlist",
                });
            }
            saveWishlist(newWishlist);
            return newWishlist;
        });
    }, [toast, saveWishlist]);

    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({
            sort: 'recommended',
            dietary: [],
            price: [],
            category: null
        });
        setSelectedCategory(null);
        toast({
            title: "Filters Cleared",
            description: "All filters have been reset",
        });
    }, [toast]);

    const filterItems = useCallback(() => {
        let filtered = [...items];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(item => item.category.id === selectedCategory);
        }

        // Dietary filters
        if (filters.dietary.length > 0) {
            filtered = filtered.filter(item =>
                filters.dietary.some(diet => item[`is_${diet}`])
            );
        }

        // Price filters
        if (filters.price.length > 0) {
            filtered = filtered.filter(item =>
                filters.price.some(range => {
                    const [min, max] = range.split('-').map(Number);
                    return item.price >= min && (!max || item.price <= max);
                })
            );
        }

        // Sorting
        switch (filters.sort) {
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
                filtered.sort((a, b) => b.reviews_count - a.reviews_count);
                break;
            default:
                // Recommended sorting using weighted score
                filtered.sort((a, b) => {
                    const aScore = (a.rating * 0.7) + ((a.reviews_count / 100) * 0.3);
                    const bScore = (b.rating * 0.7) + ((b.reviews_count / 100) * 0.3);
                    return bScore - aScore;
                });
        }

        return filtered;
    }, [items, searchQuery, selectedCategory, filters]);

    return {
        items: filterItems(),
        wishlist,
        selectedCategory,
        filters,
        searchQuery,
        toggleWishlist,
        setSelectedCategory,
        updateFilters,
        clearFilters,
        setSearchQuery,
        isWishlisted: (itemId) => wishlist.has(itemId)
    };
}; 