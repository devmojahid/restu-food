import { useState, useCallback } from 'react';

/**
 * Hook for managing dynamic table filters
 * @param {Object} options - Configuration options
 * @param {Object} options.initialFilters - Initial filter values
 * @param {Object} options.filterConfigs - Filter configurations
 * @param {Function} options.onFilterChange - Callback when filters change
 */
export const useTableFilters = ({
  initialFilters = {},
  filterConfigs = {},
  onFilterChange
}) => {
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [availableFilters] = useState(filterConfigs);

  // Handle filter value changes
  const handleFilterChange = useCallback((key, value) => {
    const config = availableFilters[key];
    
    // Transform value if transformer exists
    const transformedValue = config?.transform ? config.transform(value) : value;
    
    setActiveFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: transformedValue
      };

      // Remove empty filters
      if (transformedValue === '' || transformedValue === null || transformedValue === undefined) {
        delete newFilters[key];
      }

      onFilterChange?.(newFilters);
      return newFilters;
    });
  }, [availableFilters, onFilterChange]);

  // Reset filters to initial state
  const resetFilters = useCallback(() => {
    setActiveFilters(initialFilters);
    onFilterChange?.(initialFilters);
  }, [initialFilters, onFilterChange]);

  // Add a new filter dynamically
  const addFilter = useCallback((key, config) => {
    availableFilters[key] = config;
  }, [availableFilters]);

  // Remove a filter
  const removeFilter = useCallback((key) => {
    const { [key]: removed, ...rest } = activeFilters;
    setActiveFilters(rest);
    delete availableFilters[key];
    onFilterChange?.(rest);
  }, [activeFilters, availableFilters, onFilterChange]);

  // Get current filter value
  const getFilterValue = useCallback((key) => {
    return activeFilters[key];
  }, [activeFilters]);

  // Check if filter is active
  const isFilterActive = useCallback((key) => {
    return activeFilters[key] !== undefined && activeFilters[key] !== '';
  }, [activeFilters]);

  // Get active filter count
  const getActiveFilterCount = useCallback(() => {
    return Object.keys(activeFilters).length;
  }, [activeFilters]);

  return {
    filters: activeFilters,
    availableFilters,
    handleFilterChange,
    resetFilters,
    addFilter,
    removeFilter,
    getFilterValue,
    isFilterActive,
    getActiveFilterCount
  };
}; 