import { useState, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';
import debounce from 'lodash/debounce';

/**
 * Custom hook for handling data table operations
 * @param {Object} options - Hook options
 * @param {string} options.routeName - Base route name for the table
 * @param {Object} options.initialFilters - Initial filter values
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 */
export const useDataTable = ({
    routeName,
    initialFilters = {},
    onSuccess,
    onError,
}) => {
    const { toast } = useToast();
    const [selectedItems, setSelectedItems] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState(initialFilters.search || '');
    const [sorting, setSorting] = useState({
        column: initialFilters.sort || '',
        direction: initialFilters.direction || 'desc'
    });

    // Create a debounced search with longer delay
    const debouncedSearch = useRef(
        debounce((value, currentFilters) => {
            performSearch(value, currentFilters);
        }, 800)
    ).current;

    // Separate function to perform the search with current filters
    const performSearch = (value, currentFilters = filters) => {
        const newFilters = {
            ...currentFilters,
            search: value,
            page: 1
        };
        setIsLoading(true);

        router.get(
            route(routeName),
            newFilters,
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsLoading(false);
                    onSuccess?.();
                },
                onError: () => {
                    setIsLoading(false);
                    onError?.();
                }
            }
        );
    };

    const handleFilterChange = useCallback((key, value, immediate = false) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);

        if (key === 'search') {
            setSearchValue(value);
            if (immediate) {
                performSearch(value, newFilters);
            } else {
                debouncedSearch(value, newFilters);
            }
            return;
        }

        // For non-search filters, include current search value
        setIsLoading(true);
        router.get(
            route(routeName),
            { ...newFilters, search: searchValue },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsLoading(false);
                    onSuccess?.();
                },
                onError: () => {
                    setIsLoading(false);
                    onError?.();
                }
            }
        );
    }, [filters, searchValue, routeName, debouncedSearch]);

    // Function to handle immediate search
    const handleImmediateSearch = () => {
        performSearch(searchValue, filters);
    };

    const handleBulkAction = async (action, ids) => {
        try {
            setIsLoading(true);
            await router.post(route(`${routeName}.${action}`), { ids });
            setSelectedItems([]);
            onSuccess?.();
        } catch (error) {
            onError?.(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectionChange = (items) => {
        setSelectedItems(items);
    };

    const handlePageChange = (page) => {
        setIsLoading(true);
        router.get(
            route(routeName),
            { ...filters, search: searchValue, page },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setIsLoading(false),
                onError: () => setIsLoading(false)
            }
        );
    };

    const handleSort = useCallback((column) => {
        const direction = column === sorting.column && sorting.direction === 'asc' ? 'desc' : 'asc';

        setSorting({ column, direction });
        setIsLoading(true);

        const newFilters = {
            ...filters,
            search: searchValue,
            sort: column,
            direction,
            page: 1
        };

        router.get(
            route(routeName),
            newFilters,
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsLoading(false);
                    onSuccess?.();
                },
                onError: () => {
                    setIsLoading(false);
                    onError?.();
                }
            }
        );
    }, [filters, searchValue, sorting, routeName]);

    return {
        selectedItems,
        filters: { ...filters, search: searchValue },
        sorting,
        isLoading,
        handleFilterChange,
        handleImmediateSearch,
        handleBulkAction,
        handleSelectionChange,
        handlePageChange,
        handleSort,
    };
}; 