# DataTable Component Optimization Guide

This guide explains the advanced features and optimizations implemented in our custom DataTable component for improved performance and user experience.

## Table of Contents

1. [Component Architecture](#component-architecture)
2. [Performance Optimizations](#performance-optimizations)
3. [Advanced Features](#advanced-features)
4. [Integration Guide](#integration-guide)
5. [Troubleshooting](#troubleshooting)

## Component Architecture

The DataTable system consists of the following key components:

```
resources/js/Components/Table/
│── DataTable.jsx              # Main container component
│── LazyImage.jsx              # Performance-optimized image loading
│── NoData.jsx                 # Empty state display
│── RowActions.jsx             # Row action menu
│── TableActions.jsx           # Bulk action menu
│── TableContent.jsx           # Table body with rows and cells
│── TableFilters.jsx           # Search and filter controls
│── TableHeader.jsx            # Column headers with sorting
│── TablePagination.jsx        # Pagination controls
│── TableSkeleton.jsx          # Loading state skeleton
```

### Flow Diagram

```
useDataTable Hook (State Management)
      │
      ▼
  DataTable
      │
      ├─► TableHeader (Sorting)
      │
      ├─► TableFilters (Search/Filtering)
      │
      ├─► TableActions (Bulk Actions)
      │
      ├─► TableContent (Rows/Cells)
      │       │
      │       └─► RowActions (Per-row Actions)
      │
      └─► IntersectionObserver (Infinite Scroll)
```

## Performance Optimizations

Our DataTable implements several key optimizations:

### 1. Virtualized Rendering

The component optimizes rendering by only processing visible rows and implementing efficient re-rendering strategies.

```jsx
// Memoized components to prevent unnecessary re-renders
const MemoizedTableHeader = memo(TableHeader);
const MemoizedTableContent = memo(TableContent);
const MemoizedTableActions = memo(TableActions);
const MemoizedTableFilters = memo(TableFilters);
```

### 2. Efficient Data Handling

**Key implementations:**

- **Unique Row Keys**: Prevents React key warnings and improves reconciliation
- **Data Caching**: Stores fetched data to reduce network requests
- **Data Transformation**: Processes data efficiently before rendering

```jsx
// Generate unique keys for each row
const processedData = useMemo(() => {
  return addUniqueKeysToData(data, currentPage, keyField);
}, [data, currentPage, keyField]);
```

### 3. Lazy Loading Images

The `LazyImage` component:
- Defers image loading until needed
- Shows placeholders during loading
- Prevents layout shifts with proper sizing

```jsx
export const LazyImage = ({ src, alt, className, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
  );

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
  }, [src]);
  
  // Rendering with placeholder during loading
};
```

### 4. Optimized Infinite Scrolling

Instead of traditional pagination, the component implements infinite scrolling using:
- Intersection Observer API for efficiency
- Prefetching for smoother transitions
- Throttled loading to prevent excessive API calls

```jsx
// Set up intersection observer for infinite scrolling
useEffect(() => {
  if (!hasMoreData || isLoading) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMoreData && !isLoadingMore) {
        // Throttle loading to prevent too many requests
        const now = Date.now();
        if (now - lastLoadedTime.current > 200) {
          lastLoadedTime.current = now;
          onLoadMore?.();
        }
      }
    },
    { threshold: 0.1, rootMargin: "400px" }
  );
  
  // Observer setup and cleanup
});
```

### 5. Debounced Search

Search operations are optimized with debouncing to reduce unnecessary API calls:

```jsx
// Create a debounced search with longer delay
const debouncedSearch = useRef(
  debounce((value, currentFilters) => {
    performSearch(value, currentFilters);
  }, 500)
).current;
```

### 6. Optimized Loading States

Different loading states are shown depending on the context:
- Full skeleton for initial loading
- Overlay for filter changes
- Bottom loader for infinite scrolling

```jsx
// Show full skeleton for initial loading
if (isLoading && (!data || data.length === 0)) {
  return <TableSkeleton columns={columns} rowCount={5} />;
}
```

## Advanced Features

### 1. Real-time Polling

The component supports real-time data updates using configurable polling:

```jsx
// Setup polling if enabled
useEffect(() => {
  // Clean up any existing timer
  if (pollingTimerRef.current) {
    clearInterval(pollingTimerRef.current);
    pollingTimerRef.current = null;
  }

  const serverPolling = page.props.polling;
  const clientPolling = pollingOptions;

  if (serverPolling?.interval || clientPolling?.interval) {
    const interval = serverPolling?.interval || clientPolling.interval;
    
    pollingTimerRef.current = setInterval(() => {
      // Polling implementation to check for updates
    }, interval);
  }
  
  // Cleanup on unmount
}, [/* dependencies */]);
```

### 2. Advanced Filtering

The component supports multiple filter types:
- Text search
- Select filters
- Date range filters
- Combined filters

Filter configurations can be customized with transformers and formatters:

```jsx
// Define filter configurations
const filterConfigs = {
  status: {
    type: "select",
    label: "Status",
    options: [
      { label: "All Status", value: "" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    defaultValue: "",
    transform: (value) => value?.toLowerCase(),
    format: (value) => value?.charAt(0).toUpperCase() + value?.slice(1),
  },
  // Other filter configurations
};
```

### 3. Dynamic Sorting

Multi-column sorting with configurable priorities:

```jsx
// Enhanced sortable configurations
const sortableConfigs = {
  name: {
    key: "name",
    defaultDirection: "asc",
    transform: (value) => value?.toLowerCase(),
    priority: 1,
  },
  // Other sortable configurations
};
```

### 4. Responsive Design

The component adapts to different screen sizes using configurable responsive behaviors:

```jsx
// Column configuration with responsive behavior
{
  id: "email",
  header: "Email",
  cell: (row) => row.email,
  sortable: true,
  sortConfig: sortableConfigs.email,
  responsive: {
    hidden: "sm",  // Hide on small screens
    priority: 2,   // Priority for display order
  },
  className: "min-w-[200px]",
}
```

### 5. Bulk Actions

Support for selecting multiple items and performing batch operations:

```jsx
// Bulk actions configuration
const bulkActions = [
  {
    label: "Delete Selected",
    icon: Trash2,
    value: "delete",
  },
  // Other bulk actions
];
```

## Integration Guide

### Basic Implementation

To use the DataTable in a new list component:

1. **Import Required Components**

```jsx
import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
```

2. **Define Column Configuration**

```jsx
const columns = [
  {
    id: "name",
    header: "Name",
    cell: (row) => row.name,
    sortable: true,
    // Other options
  },
  // More columns
];
```

3. **Initialize the Hook**

```jsx
const {
  selectedItems,
  filters,
  sorting,
  isLoading,
  isLoadingMore,
  hasMoreData,
  loadMoreData,
  handleFilterChange,
  handleBulkAction,
  handleSelectionChange,
  handleSort,
} = useDataTable({
  routeName: "app.products.index",
  initialFilters: {
    search: "",
    status: "",
    per_page: 10,
  },
  onSuccess: () => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  },
});
```

4. **Render the DataTable**

```jsx
return (
  <DataTable
    data={products?.data || []}
    columns={columns}
    filters={filters}
    onFilterChange={handleFilterChange}
    selectedItems={selectedItems}
    onSelectionChange={handleSelectionChange}
    bulkActions={bulkActions}
    onBulkAction={handleBulkAction}
    isLoading={isLoading}
    isLoadingMore={isLoadingMore}
    hasMoreData={hasMoreData}
    onLoadMore={loadMoreData}
    sorting={sorting}
    onSort={handleSort}
    meta={meta}
    keyField="id"
  />
);
```

### Advanced Configuration

#### Custom Cell Renderers

```jsx
{
  id: "status",
  header: "Status",
  cell: (row) => {
    const config = getStatusConfig(row.status);
    return (
      <span className={config.className}>
        {config.label}
      </span>
    );
  },
}
```

#### Custom Filter Controls

```jsx
// Custom filter component
const CustomFilter = ({ value, onChange }) => {
  // Custom filter implementation
};

// In your columns config
{
  id: "custom_field",
  header: "Custom Field",
  cell: (row) => row.custom_field,
  filter: {
    type: "custom",
    render: (props) => <CustomFilter {...props} />
  }
}
```

## Troubleshooting

### Common Issues

1. **Duplicate Keys Warning**

**Problem**: React warns about duplicate keys in the list.

**Solution**: Ensure your data has unique identifiers and use the `keyField` prop to specify which field to use as the key.

```jsx
<DataTable
  data={data}
  keyField="uuid" // Use a unique field as the key
  // Other props
/>
```

2. **Infinite Loop in Polling**

**Problem**: Continuous re-renders when polling is enabled.

**Solution**: Ensure proper dependency arrays in the polling effect and use refs for mutable state.

3. **Memory Leaks**

**Problem**: Memory usage grows over time, especially with large datasets.

**Solution**: 
- Implement the cache cleanup function
- Limit the amount of data stored in memory
- Properly clean up subscriptions and timers

```jsx
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
  const cleanupInterval = setInterval(cleanupCache, 60000);
  return () => clearInterval(cleanupInterval);
}, [cleanupCache]);
```

4. **Performance Degradation with Large Datasets**

**Problem**: Table becomes slow with large amounts of data.

**Solution**: 
- Implement true virtualization for very large datasets
- Consider using a library like react-window for rendering only visible rows
- Optimize column rendering with more aggressive memoization

### Performance Profiling

To identify performance bottlenecks:

1. Use React Developer Tools' Profiler tab to record rendering performance
2. Look for components that re-render excessively
3. Optimize expensive operations with useMemo/useCallback
4. Consider implementing shouldComponentUpdate for class components or React.memo for function components with custom comparison functions 