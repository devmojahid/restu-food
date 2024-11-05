import { Card, CardContent } from "@/Components/ui/card";
import { TableHeader } from "./TableHeader";
import { TableActions } from "./TableActions";
import { TableFilters } from "./TableFilters";
import { TableContent } from "./TableContent";
import { TablePagination } from "./TablePagination";
import { TableSkeleton } from "./TableSkeleton";
import { useCallback, useEffect, useState, memo, useRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Memoized table components for better performance
const MemoizedTableHeader = memo(TableHeader);
const MemoizedTableContent = memo(TableContent);
const MemoizedTableActions = memo(TableActions);
const MemoizedTableFilters = memo(TableFilters);

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
  pagination,
  onPageChange,
  isLoading,
  sorting,
  onSort,
  rowSelection,
}) => {
  const [visibleData, setVisibleData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // Progressive loading with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [hasMore, isLoadingMore, loadingRef]);

  // Load more items function
  const loadMoreItems = useCallback(() => {
    if (!data || isLoadingMore) return;

    setIsLoadingMore(true);
    const currentLength = visibleData.length;
    const nextItems = data.slice(currentLength, currentLength + 10);

    setTimeout(() => {
      setVisibleData((prev) => [...prev, ...nextItems]);
      setHasMore(currentLength + 10 < data.length);
      setIsLoadingMore(false);
    }, 300); // Small delay for smooth loading
  }, [data, visibleData.length, isLoadingMore]);

  // Reset visible data when data changes
  useEffect(() => {
    if (data) {
      setVisibleData(data.slice(0, 10));
      setHasMore(data.length > 10);
    }
  }, [data]);

  if (isLoading) {
    return <TableSkeleton columns={columns} />;
  }

  return (
    <Card>
      <CardContent className="shadow-md transition-colors duration-300 p-2">
        <div className="space-y-4">
          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            <MemoizedTableActions
              selectedItems={selectedItems}
              bulkActions={bulkActions}
              onBulkAction={onBulkAction}
            />
            <MemoizedTableFilters
              filters={filters}
              onFilterChange={onFilterChange}
            />
          </div>

          {/* Table Section */}
          <div className="relative rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <MemoizedTableHeader
                  columns={columns}
                  selectedItems={selectedItems}
                  onSelectAll={onSelectionChange}
                  data={visibleData}
                  sorting={sorting}
                  onSort={onSort}
                />
                <MemoizedTableContent
                  data={visibleData}
                  columns={columns}
                  selectedItems={selectedItems}
                  onSelectionChange={onSelectionChange}
                />
              </table>

              {/* Progressive Loading Indicator */}
              {hasMore && (
                <div ref={loadingRef} className="flex justify-center py-4">
                  {isLoadingMore && (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="px-4">
            <TablePagination
              pagination={pagination}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
