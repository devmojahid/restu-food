import { useState, useRef, useMemo, useEffect } from "react";

/**
 * Custom hook for managing infinite scroll data with filtering
 * @param {Object} data - The paginated data object from server
 * @param {Object} filters - Current filters applied
 * @returns {Array} - Accumulated data with unique IDs
 */
export function useInfiniteScrollData(data, filters = {}) {
    const [allData, setAllData] = useState([]);
    const currentPageRef = useRef(1);
    const prevFiltersRef = useRef({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Memoize the data to prevent unnecessary re-renders
    const currentData = useMemo(() => data?.data || [], [data?.data]);
    const currentPage = useMemo(() => data?.current_page || 1, [data?.current_page]);

    // Add unique identifiers to prevent key collisions
    const addUniqueIds = (items, page) => {
        return items.map(item => ({
            ...item,
            _uniqueKey: `${item.id}-p${page}`
        }));
    };

    // Helper function to check if filters have changed
    const filtersChanged = (currentFilters, prevFilters) => {
        const currentKeys = Object.keys(currentFilters).sort();
        const prevKeys = Object.keys(prevFilters).sort();

        if (currentKeys.length !== prevKeys.length) return true;

        return currentKeys.some(key => currentFilters[key] !== prevFilters[key]);
    };

    // Update allData when new data comes in
    useEffect(() => {
        if (!data?.data) return;

        const newPage = data.current_page || 1;
        const hasFiltersChanged = filtersChanged(filters, prevFiltersRef.current);

        // If filters changed, or it's the first page, or we're resetting - replace all data
        if (hasFiltersChanged || newPage === 1 || !isInitialized) {
            setAllData(addUniqueIds(data.data, newPage));
            currentPageRef.current = newPage;
            prevFiltersRef.current = { ...filters };

            if (!isInitialized) {
                setIsInitialized(true);
            }
        } else if (newPage > currentPageRef.current) {
            // Only append data if it's a new page we haven't seen before (infinite scroll)
            setAllData(prev => [
                ...prev,
                ...addUniqueIds(data.data, newPage)
            ]);
            currentPageRef.current = newPage;
        }
    }, [data, filters, isInitialized]);

    // Reset when component unmounts or major changes
    useEffect(() => {
        return () => {
            setAllData([]);
            setIsInitialized(false);
            currentPageRef.current = 1;
            prevFiltersRef.current = {};
        };
    }, []);

    return allData;
}