# Advanced Data Table System Documentation

## Overview
This document describes the implementation and usage of our advanced data table system, which provides server-side infinite scrolling, dynamic filtering, sorting, and real-time updates.

## Features
- Server-side infinite scrolling
- Dynamic filtering system
- Real-time updates with polling
- Advanced sorting
- Bulk actions
- Responsive design
- Column management
- Cache management
- Error handling

## Implementation

### 1. Backend Implementation

#### Service Class Structure
```php
final class BaseDataTableService
{
    protected string $model;
    protected string $cachePrefix;
    protected array $searchableFields = [];
    protected array $filterableFields = [];
    protected array $sortableFields = [];
    protected array $relationships = [];

    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model::query()
            ->with($this->relationships);

        // Apply filters
        $this->applyFilters($query, $filters);
        
        // Apply sorting
        $this->applySorting($query, $filters);
        
        // Cache results
        return $this->getCachedResults($query, $filters);
    }

    protected function applyFilters(Builder $query, array $filters): void
    {
        // Implement filter logic
    }

    protected function applySorting(Builder $query, array $filters): void
    {
        // Implement sorting logic
    }

    protected function getCachedResults(Builder $query, array $filters)
    {
        // Implement caching logic
    }
}
```

#### Example Implementation for Users
```php
final class UserService extends BaseDataTableService
{
    protected string $model = User::class;
    protected string $cachePrefix = 'users:';
    protected array $searchableFields = ['name', 'email'];
    protected array $filterableFields = ['status', 'role'];
    protected array $sortableFields = ['name', 'email', 'created_at'];
    protected array $relationships = ['roles', 'files'];

    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model::query()
            ->with($this->relationships);

        // Apply search
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                foreach ($this->searchableFields as $field) {
                    $q->orWhere($field, 'LIKE', "%{$filters['search']}%");
                }
            });
        }

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Apply sorting
        $sortColumn = $filters['sort'] ?? 'created_at';
        $sortDirection = $filters['direction'] ?? 'desc';
        
        if (in_array($sortColumn, $this->sortableFields)) {
            $query->orderBy($sortColumn, $sortDirection);
        }

        // Cache results
        $cacheKey = "users:list:" . md5(json_encode($filters));
        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($query, $filters) {
            return $query->paginate($filters['per_page'] ?? 10);
        });
    }
}
```

### 2. Frontend Implementation

#### Hooks

##### useDataTable Hook
```javascript
const useDataTable = ({
    routeName,
    initialFilters = {},
    onSuccess,
    onError,
    enablePrefetch = true,
}) => {
    // State management
    const [filters, setFilters] = useState(initialFilters);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    
    // Data fetching logic
    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            // Implement data fetching
        } catch (error) {
            // Handle errors
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    // Return necessary state and functions
    return {
        filters,
        isLoading,
        hasMoreData,
        handleFilterChange,
        handleSort,
        loadMoreData,
    };
};
```

##### useTableFilters Hook
```javascript
const useTableFilters = ({
    initialFilters = {},
    filterConfigs = {},
    onFilterChange
}) => {
    const [activeFilters, setActiveFilters] = useState(initialFilters);

    const handleFilterChange = useCallback((key, value) => {
        // Implement filter change logic
    }, []);

    return {
        filters: activeFilters,
        handleFilterChange,
        resetFilters,
    };
};
```

#### Components

##### DataTable Component
```jsx
export const DataTable = ({
    data,
    columns,
    filters,
    onFilterChange,
    isLoading,
    hasMoreData,
    onLoadMore,
}) => {
    return (
        <Card>
            <TableFilters 
                filters={filters} 
                onFilterChange={onFilterChange} 
            />
            <TableContent 
                data={data}
                columns={columns}
            />
            {isLoading && <TableSkeleton />}
        </Card>
    );
};
```

### 3. Usage Example

```jsx
// In your page component
export default function UsersPage() {
    const {
        data,
        filters,
        isLoading,
        hasMoreData,
        handleFilterChange,
        loadMoreData,
    } = useDataTable({
        routeName: 'users.index',
        initialFilters: {
            search: '',
            status: '',
            per_page: 10,
        },
    });

    const columns = [
        {
            id: 'name',
            header: 'Name',
            cell: (row) => row.name,
            sortable: true,
        },
        // ... more columns
    ];

    return (
        <DataTable
            data={data}
            columns={columns}
            filters={filters}
            onFilterChange={handleFilterChange}
            isLoading={isLoading}
            hasMoreData={hasMoreData}
            onLoadMore={loadMoreData}
        />
    );
}
```

## Best Practices

### Backend
1. Always use eager loading for relationships
2. Implement proper caching strategies
3. Use query optimization techniques
4. Implement proper error handling
5. Use type hints and return types
6. Follow SOLID principles

### Frontend
1. Implement proper error boundaries
2. Use memoization for expensive computations
3. Implement proper loading states
4. Use proper TypeScript types
5. Follow React best practices

## Performance Optimization

### Backend Optimization
1. Query optimization
2. Proper indexing
3. Caching strategies
4. Efficient eager loading
5. Query result limiting

### Frontend Optimization
1. Virtual scrolling for large datasets
2. Proper memoization
3. Efficient re-rendering
4. Code splitting
5. Lazy loading

## Security Considerations

1. Input validation
2. SQL injection prevention
3. XSS prevention
4. CSRF protection
5. Rate limiting

## Error Handling

1. Proper error messages
2. Error boundaries
3. Retry mechanisms
4. Fallback UI
5. Error logging

## Extending the System

### Adding New Features
1. Create a new hook for the feature
2. Implement the feature in isolation
3. Add proper documentation
4. Add tests
5. Update the main documentation

### Custom Implementations
1. Extend the base service class
2. Implement custom filters
3. Add custom UI components
4. Add custom hooks
5. Document the changes

## Troubleshooting

### Common Issues
1. 409 Conflict errors
2. Cache invalidation issues
3. Performance issues
4. Memory leaks
5. Race conditions

### Solutions
1. Proper error handling
2. Cache management
3. Query optimization
4. Memory management
5. Concurrency handling 