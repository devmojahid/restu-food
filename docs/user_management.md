# User Management System Documentation

This documentation provides an in-depth guide to the user management system implementation in our Laravel 11 and Inertia.js/React application. Use this as a reference for implementing new CRUD features following the same architecture.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Implementation](#backend-implementation)
   - [Controller Layer](#controller-layer)
   - [Service Layer](#service-layer)
   - [Model Layer](#model-layer) 
3. [Frontend Implementation](#frontend-implementation)
   - [Page Components](#page-components)
   - [Reusable Form Component](#reusable-form-component)
   - [DataTable Component](#datatable-component)
4. [Implementation Guide](#implementation-guide)
   - [Creating a New CRUD Module](#creating-a-new-crud-module)
5. [Best Practices](#best-practices)

## Architecture Overview

The system follows a clean, modular architecture with distinct layers:

```
│── Controllers       # Handle HTTP requests
│── Services          # Business logic 
│── Models            # Data and relationships
│── Frontend Pages    # Inertia pages and components
```

### Design Patterns Used

- **Service Layer Pattern**: Separates business logic from controllers
- **Repository Pattern**: Implemented in BaseService for database operations
- **Form Request Validation**: Validates requests before they reach controller
- **Reusable Components**: UI components shared across pages

## Backend Implementation

### Controller Layer

Controllers are responsible for:
- Receiving HTTP requests
- Validating input using Form Requests
- Delegating to the appropriate service
- Returning Inertia responses

**Example Controller (`UserController.php`):**

```php
final class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    public function index(Request $request): Response
    {
        // Clean the filters
        $filters = array_filter([...]);
        
        // Get data using service
        $users = $this->userService->getPaginated($filters);
        
        // Return Inertia response
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'roles' => fn () => $this->userService->getAllRoles(), // Deferred prop
            'meta' => $meta,
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['files'] = ['avatar' => $data['avatar'] ?? null];
            
            if (isset($data['avatar'])) {
                unset($data['avatar']);
            }

            $user = $this->userService->store($data);

            return redirect()
                ->route('app.users.edit', $user)
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'User created successfully.'
                ]);
        } catch (\Exception $e) {
            // Error handling
        }
    }
    
    // Other CRUD methods...
}
```

### Service Layer

Services encapsulate business logic and database operations:

**Base Service (`BaseService.php`):**

- Provides common CRUD operations
- Implements caching strategy
- Handles transactions
- Provides hooks for customization

**Example Usage:**

```php
// BaseService methods
$model = $service->find($id);
$models = $service->getPaginated($filters);
$newModel = $service->create($data);
$updatedModel = $service->update($id, $data);
$service->delete($id);
$service->bulkDelete($ids);
```

**Specialized Service (`UserService.php`):**

- Extends BaseService
- Implements user-specific business logic
- Handles file uploads for avatars
- Manages role assignments

### Model Layer

Models define database structure and relationships:

**User Model Example:**

```php
final class User extends Authenticatable implements MustVerifyEmail
{
    use HasRoles, HasFiles, HasMeta;
    
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
    ];
    
    // Relationships
    public function orders() 
    {
        return $this->hasMany(Order::class);
    }
    
    // Helper methods and virtual attributes
}
```

## Frontend Implementation

### Page Components

The frontend uses Inertia.js with React components organized as:

```
resources/js/Pages/Admin/Users/
│── Index.jsx                 # List users page
│── Create.jsx                # Create user page
│── Edit.jsx                  # Edit user page
│── Partials/                 # Component partials
    │── Form/                 # Form components
    │── List/                 # List components
```

### Reusable Form Component

We've optimized the system with a single reusable form component:

**UserForm.jsx:**

```jsx
const UserForm = ({ user = null, roles = [], mode = "create" }) => {
  const isEditMode = mode === "edit";
  
  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    password_confirmation: "",
    role: user?.roles?.[0]?.name || "",
    status: user?.status || "active",
    avatar: user?.avatar || null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      put(route("app.users.update", user.id), { /* options */ });
    } else {
      post(route("app.users.store"), { /* options */ });
    }
  };
  
  // Form rendering...
};
```

**Usage in Create/Edit Pages:**

```jsx
// Create.jsx
<UserForm roles={roles} mode="create" />

// Edit.jsx
<UserForm user={user} roles={roles} mode="edit" />
```

### DataTable Component

The system uses a highly optimized DataTable component for lists:

**Key Features:**

- Pagination with infinite scrolling
- Filtering and sorting
- Real-time updates with polling
- Bulk actions
- Responsive design
- Optimized rendering with memoization

**Implementation in `useDataTable` Hook:**

```jsx
export const useDataTable = ({
  routeName,
  initialFilters = {},
  onSuccess,
  onError,
  pollingOptions = null,
  enablePrefetch = true,
}) => {
  // State management, filtering, sorting, pagination logic
  
  return {
    selectedItems,
    filters,
    sorting,
    isLoading,
    isLoadingMore,
    hasMoreData,
    // Other properties and methods...
  };
};
```

**Usage Example:**

```jsx
const {
  selectedItems,
  filters,
  sorting,
  isLoading,
  // ...other properties
} = useDataTable({
  routeName: "app.users.index",
  initialFilters: {
    search: "",
    role: "",
    // ...other filters
  },
});

return (
  <DataTable 
    data={users?.data}
    columns={columns}
    filters={filters}
    // ...other props
  />
);
```

## Implementation Guide

### Creating a New CRUD Module

Follow these steps to implement a new CRUD module following this architecture:

#### 1. Create the Model

```php
// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'status'];
    
    // Relationships and methods...
}
```

#### 2. Create the Service

```php
// app/Services/Admin/ProductService.php
namespace App\Services\Admin;

use App\Models\Product;
use App\Services\BaseService;

final class ProductService extends BaseService
{
    protected string $model = Product::class;
    protected string $cachePrefix = 'products:';
    protected array $searchableFields = ['name', 'description'];
    protected array $filterableFields = ['status'];
    protected array $sortableFields = ['name', 'price', 'created_at'];
    
    // Custom business logic methods...
}
```

#### 3. Create the Controller

```php
// app/Http/Controllers/Admin/ProductController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Services\Admin\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use App\Models\Product;

final class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {}
    
    public function index(Request $request)
    {
        $filters = array_filter([
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'per_page' => $request->input('per_page', 10),
            'sort' => $request->input('sort', 'created_at'),
            'direction' => $request->input('direction', 'desc'),
        ], fn($value) => $value !== null && $value !== '');
        
        $products = $this->productService->getPaginated($filters);
        
        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => $filters
        ]);
    }
    
    // Implement other CRUD methods...
}
```

#### 4. Create Form Request Validation

```php
// app/Http/Requests/ProductRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function rules()
    {
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
        ];
        
        return $rules;
    }
}
```

#### 5. Create Frontend Pages

Create the necessary React components:

- **Index.jsx** for listing
- **Form/** directory with reusable form
- **Create.jsx** and **Edit.jsx** that use the form component

#### 6. Define Routes

```php
// routes/web.php
Route::prefix('admin')->name('app.')->middleware(['auth', 'admin'])->group(function () {
    Route::resource('products', ProductController::class);
    Route::put('products/{product}/status', [ProductController::class, 'updateStatus'])->name('products.status');
    Route::delete('products/bulk-delete', [ProductController::class, 'bulkDelete'])->name('products.bulk-delete');
});
```

## Best Practices

1. **Use Form Request Validation**: Validate all input at the request level.

2. **Service Layer for Business Logic**: Keep controllers thin, move logic to services.

3. **Transaction Management**: Use transactions for operations that affect multiple records.

4. **Caching Strategy**: Leverage caching for frequently accessed data.

5. **Error Handling**: Use try-catch blocks and return meaningful errors.

6. **Authorization**: Implement authorization checks in controllers.

7. **Frontend Optimizations**:
   - Use reusable components
   - Implement proper loading states
   - Optimize re-renders with memoization
   - Use hooks for shared logic

8. **API Design**:
   - Consistent response formats
   - Proper error handling
   - Use resourceful routes

9. **Testing**:
   - Test service methods
   - Test API endpoints
   - Test frontend components 