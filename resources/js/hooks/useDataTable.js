import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';
import DOMPurify from 'dompurify';

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

    // Debounced search handler
    const debouncedSearch = useCallback(
        debounce((newFilters) => {
            router.get(
                route(routeName),
                newFilters,
                { preserveState: true, preserveScroll: true }
            );
        }, 300),
        [routeName]
    );

    const handleFilterChange = (key, value) => {
        // Sanitize input
        const sanitizedValue = DOMPurify.sanitize(value);
        const newFilters = { ...filters, [key]: sanitizedValue };
        setFilters(newFilters);

        // Use existing debounced search
        if (key === 'search') {
            debouncedSearch(newFilters);
        } else {
            router.get(
                route(routeName),
                newFilters,
                { preserveState: true, preserveScroll: true }
            );
        }
    };

    const handleBulkAction = async (action, ids) => {
        try {
            await router.post(route(`${routeName}.${action}`), { ids });
            setSelectedItems([]);
            onSuccess?.();
        } catch (error) {
            onError?.(error);
        }
    };

    const handleSelectionChange = (items) => {
        setSelectedItems(items);
    };

    const handlePageChange = (page) => {
        router.get(
            route(routeName),
            { ...filters, page },
            { preserveState: true, preserveScroll: true }
        );
    };

    return {
        selectedItems,
        filters,
        handleFilterChange,
        handleBulkAction,
        handleSelectionChange,
        handlePageChange,
    };
}; 