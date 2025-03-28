import { Card, CardContent } from "@/Components/ui/card";
import { TableHeader } from "./TableHeader";
import { TableActions } from "./TableActions";
import { TableFilters } from "./TableFilters";
import { TableContent } from "./TableContent";
import { TableSkeleton } from "./TableSkeleton";
import { useCallback, useEffect, useState, memo, useRef, useMemo } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import NoData from "@/Components/ui/no-data";
import { Badge } from "@/Components/ui/badge";

// Memoized table components for better performance
const MemoizedTableHeader = memo(TableHeader);
const MemoizedTableContent = memo(TableContent);
const MemoizedTableActions = memo(TableActions);
const MemoizedTableFilters = memo(TableFilters);

/**
 * Generate unique keys for each row based on ID and page to avoid React duplicate key warnings
 * @param {Array} data - The data array
 * @param {Number} page - Current page number
 * @param {String} keyField - Field to use as the key
 * @returns {Array} - Data with unique keys
 */
const addUniqueKeysToData = (data, page = 1, keyField = 'id') => {
  if (!data) return [];
  
  return data.map((item, index) => ({
    ...item,
    // Add a unique key property that combines the ID, page number, and index
    _uniqueKey: `${item[keyField] || index}-p${page}-i${index}`
  }));
};

/**
 * Generic DataTable component that can be used for any data type
 * @param {Object} props - Component props
 * @param {Array} props.data - Data to display in table
 * @param {Array} props.columns - Column definitions
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Filter change handler
 * @param {Array} props.selectedItems - Currently selected items
 * @param {Function} props.onSelectionChange - Selection change handler
 * @param {Array} props.bulkActions - Available bulk actions
 * @param {Function} props.onBulkAction - Bulk action handler
 * @param {Boolean} props.isLoading - Initial loading state
 * @param {Boolean} props.isLoadingMore - Loading more data state
 * @param {Boolean} props.hasMoreData - Whether there is more data to load
 * @param {Function} props.onLoadMore - Function to load more data
 * @param {Number} props.currentPage - Current page number
 * @param {Object} props.meta - Metadata about the table data
 * @param {Function} props.onRefresh - Function to refresh table data
 * @param {String} props.keyField - Field to use as the key, defaults to 'id'
 * @param {Map} props.dataCache - Optional data cache for optimized rendering
 * @param {Boolean} props.disableAnimation - Disable animations for better performance
 * @param {Boolean} props.showLastUpdated - Whether to show last updated timestamp
 */
export const DataTable = ({
  data,
  columns,
  filters,
  onFilterChange,
  selectedItems,
  onSelectionChange,
  bulkActions,
  onBulkAction,
  isLoading,
  isLoadingMore,
  hasMoreData,
  onLoadMore,
  sorting,
  onSort,
  currentPage = 1,
  meta = {},
  onRefresh,
  keyField = 'id',
  dataCache,
  disableAnimation = false,
  showLastUpdated = false,
}) => {
  const observerTarget = useRef(null);
  const lastLoadedTime = useRef(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Process data to have unique keys
  const processedData = useMemo(() => {
    return addUniqueKeysToData(data, currentPage, keyField);
  }, [data, currentPage, keyField]);
  
  // Handle cached data for improved rendering
  const allData = useCallback(() => {
    if (!dataCache || !processedData) {
      return processedData;
    }
    
    // Combine current data with cached data
    let combinedData = [...processedData];
    
    // Start from page 2 (page 1 is already in processedData)
    for (let page = 2; page <= currentPage; page++) {
      const cachedPageData = dataCache.get(page);
      if (cachedPageData) {
        // Add unique keys to cached data
        const processedCachedData = addUniqueKeysToData(cachedPageData, page, keyField);
        combinedData = [...combinedData, ...processedCachedData];
      }
    }
    
    return combinedData;
  }, [processedData, dataCache, currentPage, keyField]);
  
  // Format last updated time
  const formatLastUpdated = (isoString) => {
    if (!isoString) return '';
    
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(date);
    } catch (e) {
      return '';
    }
  };
  
  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    if (onRefresh && !isLoading && !isLoadingMore) {
      setIsRefreshing(true);
      lastLoadedTime.current = Date.now();
      
      // Call refresh with a callback to reset the refreshing state
      Promise.resolve(onRefresh()).finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
      });
    }
  }, [onRefresh, isLoading, isLoadingMore]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!hasMoreData || isLoading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreData && !isLoadingMore && !isLoading) {
          // Throttle loading to prevent too many requests
          const now = Date.now();
          if (now - lastLoadedTime.current > 200) {
            lastLoadedTime.current = now;
            onLoadMore?.();
          }
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: "400px" // Increased margin for earlier loading
      }
    );

    const currentObserverTarget = observerTarget.current;

    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, [hasMoreData, isLoadingMore, isLoading, onLoadMore]);

  // Show full skeleton for initial loading
  if (isLoading && (!data || data.length === 0)) {
    return <TableSkeleton columns={columns} rowCount={5} />;
  }

  const renderLastUpdated = () => {
    if (!showLastUpdated || !meta.lastUpdated) return null;
    
    return (
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
        <span>Last updated: {formatLastUpdated(meta.lastUpdated)}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-2 p-1 h-6"
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
        >
          <RefreshCw 
            className={cn(
              "h-3 w-3", 
              (isRefreshing || isLoading) && "animate-spin"
            )} 
          />
        </Button>
      </div>
    );
  };

  const renderMetaInfo = () => {
    if (!meta.total) return null;
    
    return (
      <div className="flex items-center">
        <Badge variant="outline" className="text-xs font-normal">
          {meta.total} {meta.total === 1 ? 'item' : 'items'}
        </Badge>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="shadow-md transition-colors duration-300 p-2">
        <div className="space-y-4">
          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            <div className="flex-1">
              <MemoizedTableActions
                selectedItems={selectedItems}
                bulkActions={bulkActions}
                onBulkAction={onBulkAction}
              />
            </div>
            <div className="flex-1">
              <MemoizedTableFilters
                filters={filters}
                onFilterChange={onFilterChange}
                isLoading={isLoading}
              />
            </div>
          </div>
          
          {/* Meta Info Section */}
          <div className="flex justify-between px-4 hidden">
            {renderMetaInfo()}
            {renderLastUpdated()}
          </div>

          {/* Loading Overlay - Show when filters are changing but we have existing data */}
          {isLoading && data && data.length > 0 && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm font-medium">Loading...</span>
              </div>
            </div>
          )}

          {/* Table Section */}
          <div className="relative rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <MemoizedTableHeader
                  columns={columns}
                  selectedItems={selectedItems}
                  onSelectAll={onSelectionChange}
                  data={allData()}
                  sorting={sorting}
                  onSort={onSort}
                />
                <MemoizedTableContent
                  data={processedData}
                  columns={columns}
                  selectedItems={selectedItems}
                  onSelectionChange={onSelectionChange}
                  keyField="_uniqueKey"
                  disableAnimation={disableAnimation}
                />
              </table>

              {/* Infinite Scroll Loading Skeleton */}
              {isLoadingMore && (
                <TableSkeleton 
                  columns={columns} 
                  rowCount={3} 
                  className="border-t border-gray-200 dark:border-gray-700" 
                  hideHeader={true}
                />
              )}

              {/* Infinite Scroll Observer Element */}
              <div 
                ref={observerTarget} 
                className={cn(
                  "h-20", // Give height to ensure it's visible for intersection
                  !hasMoreData && "hidden"
                )}
              />

              {/* No More Data Message */}
              {!hasMoreData && data?.length > 0 && !isLoading && (
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
                  You've reached the end of the list
                </div>
              )}

              {/* Empty State */}
              {!isLoading && (!data || data.length === 0) && (
                <NoData 
                  title="No results found"
                  description="Try adjusting your search or filters."
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
