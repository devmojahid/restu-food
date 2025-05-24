import { useState, useCallback, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useToast } from '@/Components/ui/use-toast';
import debounce from 'lodash/debounce';

/**
 * Custom hook for handling data table operations
 * @param {Object} options - Hook options
 * @param {string} options.routeName - Base route name for the table
 * @param {Object} options.initialFilters - Initial filter values
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {Object} options.pollingOptions - Optional polling configuration
 * @param {boolean} options.enablePrefetch - Enable data prefetching
 */
export const useDataTable = ({
    routeName,
    initialFilters = {},
    onSuccess,
    onError,
    pollingOptions = null, // { interval: 30000 }
    enablePrefetch = true,
    dataKey = 'data',
}) => {
    const page = usePage();
    const { toast } = useToast();
    const [selectedItems, setSelectedItems] = useState([]);
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [searchValue, setSearchValue] = useState(initialFilters.search || '');
    const [sorting, setSorting] = useState({
        column: initialFilters.sort || '',
        direction: initialFilters.direction || 'desc'
    });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [meta, setMeta] = useState(page.props.meta || {});
    const currentPage = useRef(initialFilters.page || 1);
    const dataCache = useRef(new Map()); // Cache for storing data by page
    const pollingTimerRef = useRef(null);
    const prefetchControllerRef = useRef(null);

    // Create a debounced search with longer delay
    const debouncedSearch = useRef(
        debounce((value, currentFilters) => {
            performSearch(value, currentFilters);
        }, 500)
    ).current;

    // Update meta when page props change
    useEffect(() => {
        if (page.props.meta) {
            setMeta(page.props.meta);
            setHasMoreData(page.props.meta.hasMorePages || false);
        }
    }, [page.props.meta]);

    // Setup polling if enabled
    useEffect(() => {
        // Clean up any existing timer
        if (pollingTimerRef.current) {
            clearInterval(pollingTimerRef.current);
            pollingTimerRef.current = null;
        }

        // Check if polling is enabled from props or options
        const serverPolling = page.props.polling;
        const clientPolling = pollingOptions;

        if (serverPolling?.interval || clientPolling?.interval) {
            const interval = serverPolling?.interval || clientPolling.interval;
            const endpoint = serverPolling?.endpoint || route(routeName, getCleanedParams({
                ...filters,
                search: searchValue,
                only: `${dataKey},meta` // Use dynamic dataKey
            }));

            pollingTimerRef.current = setInterval(() => {
                // Don't poll if we're already loading data
                if (isLoading || isLoadingMore) return;

                // Use fetch instead of Inertia to avoid unnecessary re-renders
                fetch(endpoint, {
                    headers: {
                        'X-Inertia': true,
                        'X-Inertia-Partial-Data': `${dataKey},meta`,
                        'X-Inertia-Partial-Component': page.component,
                        'Accept': 'application/json',
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.props) {
                            // Update meta
                            if (data.props.meta) {
                                setMeta(data.props.meta);
                            }

                            // Check if data has changed by comparing lastUpdated
                            const newLastUpdated = data.props.meta?.lastUpdated;
                            const currentLastUpdated = meta.lastUpdated;

                            if (newLastUpdated && newLastUpdated !== currentLastUpdated) {
                                // Data has changed, trigger a reload
                                router.reload({
                                    only: [`${dataKey}`, 'meta'],
                                    preserveScroll: true,
                                    preserveState: true
                                });
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Polling error:', error);
                    });
            }, interval);
        }

        return () => {
            if (pollingTimerRef.current) {
                clearInterval(pollingTimerRef.current);
            }
        };
    }, [filters, searchValue, page.props.polling, pollingOptions, meta.lastUpdated]);

    // Update prefetch logic
    // useEffect(() => {
    //     if (!enablePrefetch || !hasMoreData || isLoading || isLoadingMore) return;

    //     // Check for existing prefetch info from the server
    //     const prefetchUrl = page.props.prefetch?.next_page;

    //     if (prefetchUrl && !dataCache.current.has(currentPage.current + 1)) {
    //         // Cancel any existing prefetch
    //         if (prefetchControllerRef.current) {
    //             prefetchControllerRef.current.abort();
    //         }

    //         // Create a new controller for this prefetch
    //         prefetchControllerRef.current = new AbortController();

    //         // Use fetch to prefetch data with proper error handling
    //         fetch(prefetchUrl, {
    //             signal: prefetchControllerRef.current.signal,
    //             headers: {
    //                 'X-Inertia': true,
    //                 'X-Inertia-Partial-Data': 'users,meta',
    //                 'X-Inertia-Partial-Component': page.component,
    //                 'Accept': 'application/json',
    //                 'X-Requested-With': 'XMLHttpRequest',
    //                 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    //             },
    //             credentials: 'same-origin'
    //         })
    //         .then(async response => {
    //             if (!response.ok) {
    //                 const errorData = await response.json().catch(() => ({}));
    //                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             if (data.props?.users?.data) {
    //                 // Store in cache with timestamp
    //                 dataCache.current.set(currentPage.current + 1, {
    //                     data: data.props.users.data,
    //                     timestamp: Date.now()
    //                 });
    //             }
    //         })
    //         .catch(error => {
    //             // Ignore abort errors
    //             if (error.name !== 'AbortError') {
    //                 console.error('Prefetch error:', error);
    //                 // Clear the cache entry if it exists
    //                 dataCache.current.delete(currentPage.current + 1);
    //             }
    //         });
    //     }

    //     return () => {
    //         if (prefetchControllerRef.current) {
    //             prefetchControllerRef.current.abort();
    //         }
    //     };
    // }, [page.props.prefetch, hasMoreData, isLoading, isLoadingMore, enablePrefetch]);

    // Add cache cleanup function
    const cleanupCache = useCallback(() => {
        const now = Date.now();
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

        for (const [key, value] of dataCache.current.entries()) {
            if (now - value.timestamp > CACHE_DURATION) {
                dataCache.current.delete(key);
            }
        }
    }, []);

    // Add periodic cache cleanup
    useEffect(() => {
        const cleanupInterval = setInterval(cleanupCache, 60000); // Clean up every minute
        return () => clearInterval(cleanupInterval);
    }, [cleanupCache]);

    // Reset when filters change significantly
    useEffect(() => {
        // Reset pagination when filters (except page) change
        if (filters !== initialFilters) {
            currentPage.current = 1;
            setHasMoreData(true);
            dataCache.current.clear(); // Clear cache when filters change
        }
    }, [filters.search, filters.sort, filters.direction, filters.per_page, filters.role, filters.status]);

    // Clean up URL parameters to only include essential ones
    const getCleanedParams = (params) => {
        const essentialParams = ['search', 'sort', 'direction', 'page', 'per_page'];
        const cleanedParams = {};

        Object.keys(params).forEach(key => {
            // Only include non-empty essential params or full non-empty objects
            if (essentialParams.includes(key)) {
                if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
                    cleanedParams[key] = params[key];
                }
            } else if (typeof params[key] === 'object' && params[key] !== null) {
                // For objects like date_range, only include if it has non-empty values
                const hasNonEmptyValue = Object.values(params[key]).some(
                    v => v !== '' && v !== null && v !== undefined
                );
                if (hasNonEmptyValue) {
                    cleanedParams[key] = params[key];
                }
            } else if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
                cleanedParams[key] = params[key];
            }
        });

        return cleanedParams;
    };

    // Separate function to perform the search with current filters
    const performSearch = (value, currentFilters = filters) => {
        const newFilters = {
            ...currentFilters,
            search: value,
            page: 1
        };

        currentPage.current = 1;
        setHasMoreData(true);
        setIsLoading(true);
        dataCache.current.clear(); // Clear cache when search changes

        const cleanedParams = getCleanedParams(newFilters);

        // Use router.get with proper error handling
        router.get(
            route(routeName),
            cleanedParams,
            {
                preserveState: true,
                preserveScroll: true,
                only: [`${dataKey}`, 'meta'],
                onBefore: () => {
                    setIsLoading(true);
                },
                onSuccess: (page) => {
                    setIsLoading(false);
                    if (page.props.meta) {
                        setMeta(page.props.meta);
                    }
                    onSuccess?.();
                },
                onError: (errors) => {
                    setIsLoading(false);
                    toast({
                        title: 'Error',
                        description: errors.message || 'Failed to perform search',
                        variant: 'destructive',
                    });
                    onError?.(errors);
                }
            }
        );
    };

    // Update handleFilterChange to handle immediate search better
    const handleFilterChange = useCallback((key, value, immediate = false) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);
        currentPage.current = 1;
        setHasMoreData(true);
        dataCache.current.clear();

        if (key === 'search') {
            setSearchValue(value);
            if (immediate) {
                performSearch(value, newFilters);
            } else {
                debouncedSearch(value, newFilters);
            }
            return;
        }

        // For non-search filters
        setIsLoading(true);

        const cleanedParams = getCleanedParams({
            ...newFilters,
            search: searchValue
        });

        router.get(
            route(routeName),
            cleanedParams,
            {
                preserveState: true,
                preserveScroll: true,
                only: [`${dataKey}`, 'meta'],
                onBefore: () => {
                    setIsLoading(true);
                },
                onSuccess: (page) => {
                    setIsLoading(false);
                    if (page.props.meta) {
                        setMeta(page.props.meta);
                    }
                    onSuccess?.();
                },
                onError: (errors) => {
                    setIsLoading(false);
                    toast({
                        title: 'Error',
                        description: errors.message || 'Failed to update filters',
                        variant: 'destructive',
                    });
                    onError?.(errors);
                }
            }
        );
    }, [filters, searchValue, routeName, debouncedSearch]);

    // Function to handle immediate search
    const handleImmediateSearch = () => {
        performSearch(searchValue, filters);
    };

    // Update bulk action handling
    // Update bulk action handling
    const handleBulkAction = async (action) => {
        if (!selectedItems.length) return;

        try {
            setIsLoading(true);

            let routeSuffix;
            let payload = { ids: selectedItems };

            // Map action to appropriate route and payload
            switch (action) {
                case 'delete':
                    routeSuffix = 'bulk-delete';
                    // For DELETE requests with Inertia.js, pass data in the options object
                    await router.delete(route(`${routeName}.${routeSuffix}`), {
                        data: payload, // Data goes in the options object for DELETE requests
                        preserveScroll: true,
                        onSuccess: () => {
                            setSelectedItems([]);
                            dataCache.current.clear(); // Clear cache after bulk action
                            toast({
                                title: 'Success',
                                description: `Bulk deletion completed successfully`,
                            });
                            onSuccess?.();
                        },
                        onError: (errors) => {
                            toast({
                                title: 'Error',
                                description: errors.message || 'Failed to delete items',
                                variant: 'destructive',
                            });
                            onError?.(errors);
                        }
                    });
                    break;
                case 'activate':
                case 'deactivate':
                    routeSuffix = 'bulk-status';
                    // For PUT requests, data is passed as the second parameter
                    await router.put(route(`${routeName}.${routeSuffix}`), {
                        ids: selectedItems,
                        status: action === 'activate'
                    }, {
                        preserveScroll: true,
                        onSuccess: () => {
                            setSelectedItems([]);
                            dataCache.current.clear(); // Clear cache after bulk action
                            toast({
                                title: 'Success',
                                description: `Status updated successfully for ${selectedItems.length} items`,
                            });
                            onSuccess?.();
                        },
                        onError: (errors) => {
                            toast({
                                title: 'Error',
                                description: errors.message || 'Failed to update status',
                                variant: 'destructive',
                            });
                            onError?.(errors);
                        }
                    });
                    break;
                default:
                    throw new Error(`Unknown bulk action: ${action}`);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'An unexpected error occurred',
                variant: 'destructive',
            });
            onError?.(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectionChange = (items) => {
        setSelectedItems(items);
    };

    // Load more data (infinite scroll)
    const loadMoreData = useCallback(() => {
        if (isLoading || isLoadingMore || !hasMoreData) return;

        const nextPage = currentPage.current + 1;

        // Check cache first
        if (dataCache.current.has(nextPage)) {
            // Use cached data - signal to parent component
            currentPage.current = nextPage;
            return true; // Indicate we're using cached data
        }

        setIsLoadingMore(true);
        currentPage.current = nextPage;

        const loadMoreFilters = {
            ...filters,
            search: searchValue,
            page: nextPage,
            sort: sorting.column || 'created_at',
            direction: sorting.direction || 'desc'
        };

        const cleanedParams = getCleanedParams(loadMoreFilters);

        router.get(
            route(routeName),
            cleanedParams,
            {
                preserveState: true,
                preserveScroll: true,
                only: [`${dataKey}`, 'meta'],
                onSuccess: (page) => {
                    setIsLoadingMore(false);

                    const pageData = page.props[dataKey];
                    if (pageData && pageData.data) {
                        // Store in cache
                        dataCache.current.set(nextPage, pageData.data);

                        // Update meta and check if we have more pages
                        if (page.props.meta) {
                            setMeta(page.props.meta);
                            setHasMoreData(page.props.meta.hasMorePages || false);
                        } else {
                            // Fallback if meta is not available
                            setHasMoreData(
                                pageData.data.length > 0 &&
                                pageData.current_page < pageData.last_page
                            );
                        }
                    }
                    return false;  // Indicate we're not using cached data

                    // Check if we have more data
                    // if (page.props.users && page.props.users.data) {
                    //     // Store in cache
                    //     dataCache.current.set(nextPage, page.props.users.data);

                    //     // Update meta and check if we have more pages
                    //     if (page.props.meta) {
                    //         setMeta(page.props.meta);
                    //         setHasMoreData(page.props.meta.hasMorePages || false);
                    //     } else {
                    //         // Fallback if meta is not available
                    //         setHasMoreData(
                    //             page.props.users.data.length > 0 &&
                    //             page.props.users.current_page < page.props.users.last_page
                    //         );
                    //     }
                    // }
                    // return false; // Indicate we're not using cached data
                },
                onError: () => {
                    setIsLoadingMore(false);
                    setHasMoreData(false);
                    return false; // Indicate error
                }
            }
        );

        return false; // Default - not using cached data
    }, [filters, searchValue, sorting, isLoading, isLoadingMore, hasMoreData, routeName]);

    const handleSort = useCallback((column) => {
        const direction = column === sorting.column && sorting.direction === 'asc' ? 'desc' : 'asc';

        setSorting({ column, direction });
        setIsLoading(true);
        currentPage.current = 1;
        setHasMoreData(true);
        dataCache.current.clear(); // Clear cache when sorting changes

        const newFilters = {
            ...filters,
            search: searchValue,
            sort: column,
            direction,
            page: 1
        };

        const cleanedParams = getCleanedParams(newFilters);

        router.get(
            route(routeName),
            cleanedParams,
            {
                preserveState: true,
                preserveScroll: true,
                only: [dataKey, 'meta'],
                onSuccess: (page) => {
                    setIsLoading(false);
                    if (page.props.meta) {
                        setMeta(page.props.meta);
                    }
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
        isLoadingMore,
        hasMoreData,
        currentPage: currentPage.current,
        dataCache: dataCache.current,
        meta,
        handleFilterChange,
        handleImmediateSearch,
        handleBulkAction,
        handleSelectionChange,
        loadMoreData,
        handleSort,
    };
}; 