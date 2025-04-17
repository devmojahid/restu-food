# Laravel Inertia DataTable Documentation

## Overview
A robust, reusable data table system built for Laravel 11 with Inertia.js and React. Features include server-side infinite scrolling, dynamic filtering, sorting, bulk actions, and real-time updates.

## Features
- Server-side infinite scrolling
- Dynamic filtering system
- Advanced sorting
- Bulk actions
- Real-time updates (optional polling)
- Responsive design
- Column management
- Cache management
- Error handling
- CSRF protection

## Backend Implementation

### Controller Example
```php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function index(Request $request)
    {
        // Clean the filters
        $filters = array_filter([
            'search' => $request->input('search'),
            'role' => $request->input('role'),
            'status' => $request->input('status'),
            'per_page' => $request->input('per_page', 10),
            'sort' => $request->input('sort', 'created_at'),
            'direction' => $request->input('direction', 'desc'),
        ]);

        // Get paginated data
        $users = $this->userService->getPaginated($filters);

        // Meta information for client
        $meta = [
            'hasMorePages' => $users->hasMorePages(),
            'currentPage' => $users->currentPage(),
            'lastPage' => $users->lastPage(),
            'total' => $users->total(),
            'from' => $users->firstItem(),
            'to' => $users->lastItem(),
            'lastUpdated' => now()->toIso8601String(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'meta' => $meta,
        ]);
    }
}
```

### Service Layer Example
```php
namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

final class UserService
{
    public function getPaginated(array $filters): LengthAwarePaginator
    {
        $query = User::query()
            ->with(['roles', 'files']);

        // Apply search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Apply status filter
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Apply role filter
        if (!empty($filters['role'])) {
            $query->whereHas('roles', function ($q) use ($filters) {
                $q->where('name', $filters['role']);
            });
        }

        // Apply sorting
        $query->orderBy(
            $filters['sort'] ?? 'created_at',
            $filters['direction'] ?? 'desc'
        );

        return $query->paginate($filters['per_page'] ?? 10);
    }
}
```

## Frontend Implementation

### Using the DataTable Component
```jsx
import { DataTable } from "@/Components/Table/DataTable";
import { useDataTable } from "@/hooks/useDataTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { useTableConfig } from "@/hooks/useTableConfig";

export default function ListUsers({ users, roles, meta }) {
  // Define filter configurations
  const filterConfigs = {
    status: {
      type: "select",
      label: "Status",
      options: [
        { label: "All", value: "" },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ]
    },
    role: {
      type: "select",
      label: "Role",
      options: roles.map(role => ({
        label: role.name,
        value: role.name
      }))
    }
  };

  // Initialize hooks
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
    handleSort
  } = useDataTable({
    routeName: "app.users.index",
    initialFilters: {
      search: "",
      status: "",
      role: "",
      sort: "created_at",
      direction: "desc",
      per_page: 10
    }
  });

  // Column definitions
  const columns = [
    {
      id: "name",
      header: "Name",
      cell: (row) => row.name,
      sortable: true
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={row.status === "active" ? "success" : "warning"}>
          {row.status}
        </Badge>
      )
    }
    // ... more columns
  ];

  return (
    <DataTable
      data={users?.data || []}
      columns={columns}
      filters={filters}
      onFilterChange={handleFilterChange}
      selectedItems={selectedItems}
      onSelectionChange={handleSelectionChange}
      bulkActions={[
        {
          label: "Delete Selected",
          value: "delete",
          variant: "destructive"
        },
        {
          label: "Activate Selected",
          value: "activate"
        }
      ]}
      onBulkAction={handleBulkAction}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      hasMoreData={hasMoreData}
      onLoadMore={loadMoreData}
      sorting={sorting}
      onSort={handleSort}
      meta={meta}
    />
  );
}
```

## Customization

### Adding Custom Filters
```jsx
// In your list component
const customFilters = {
  date_range: {
    type: "date-range",
    label: "Date Range",
    transform: (value) => ({
      from: value.from ? format(new Date(value.from), "yyyy-MM-dd") : "",
      to: value.to ? format(new Date(value.to), "yyyy-MM-dd") : ""
    })
  },
  categories: {
    type: "multi-select",
    label: "Categories",
    options: categories,
    transform: (values) => values.map(v => v.id)
  }
};

// Add to useTableFilters
const { filters, handleFilterChange } = useTableFilters({
  initialFilters: {},
  filterConfigs: customFilters,
  onFilterChange: handleUpdate
});
```

### Custom Bulk Actions
```jsx
const bulkActions = [
  {
    label: "Export Selected",
    value: "export",
    icon: FileDownload,
    handler: async (ids) => {
      // Custom export logic
    }
  }
];
```

## Best Practices

1. **Performance Optimization**
   - Use proper indexes in database
   - Implement caching strategies
   - Optimize queries using eager loading
   - Use debounced search
   - Implement proper cleanup

2. **Error Handling**
   - Implement proper error boundaries
   - Handle network errors gracefully
   - Provide user feedback
   - Log errors appropriately

3. **Security**
   - Validate all inputs
   - Implement proper authorization
   - Use CSRF protection
   - Sanitize outputs

4. **Accessibility**
   - Use proper ARIA labels
   - Implement keyboard navigation
   - Ensure proper color contrast
   - Support screen readers

## Extending the System

### Adding New Features
1. Create a new hook for the feature
2. Implement the feature in isolation
3. Add to the core system through configuration
4. Update documentation

### Custom Styling
Use Tailwind CSS utilities and extend when needed:
```jsx
const customStyles = {
  table: "custom-table-class",
  header: "custom-header-class",
  row: "custom-row-class"
};

<DataTable
  {...props}
  className={customStyles}
/>
```

## Troubleshooting

### Common Issues
1. **409 Conflict Errors**
   - Ensure proper Inertia version headers
   - Handle page reloads appropriately
   - Implement proper cache invalidation

2. **Performance Issues**
   - Implement proper indexing
   - Use eager loading
   - Optimize queries
   - Implement caching

3. **State Management**
   - Use proper cleanup in useEffect
   - Implement proper error boundaries
   - Handle edge cases

## Contributing
1. Follow coding standards
2. Write tests
3. Document changes
4. Submit pull requests 