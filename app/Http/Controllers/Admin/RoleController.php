<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Role\StoreRoleRequest;
use App\Http\Requests\Admin\Role\UpdateRoleRequest;
use App\Services\Admin\RoleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
final class RoleController extends Controller
{
    public function __construct(
        private readonly RoleService $roleService
    ) {}

    // Fixed Role Controller
    public function index(Request $request): Response
    {
        try {
            // Validate and clean filters
            $filters = $this->validateAndCleanFilters($request);
            
            // Get paginated roles
            $roles = $this->roleService->getPaginated($filters);
            
            // Build comprehensive meta information
            $meta = $this->buildMetaInformation($roles);
            
            // Handle polling configuration
            $this->configurePolling($request, $filters);
            
            // Handle prefetching for next page
            $this->configurePrefetching($roles, $filters);

            // dd($roles->toArray()['data']);
            return Inertia::render('Admin/Roles/Index', [
                'roles' => $roles, // This should match the prop name in your component
                'filters' => $filters,
                'meta' => $meta,
                'stats' => fn () => $this->roleService->getStats(), // Lazy loading
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error in RoleController@index', [
                'error' => $e->getMessage(),
                'filters' => $request->all()
            ]);
            
            // Return empty state on error
            return Inertia::render('Admin/Roles/Index', [
                'roles' => collect(),
                'filters' => [],
                'meta' => $this->getEmptyMeta(),
                'stats' => [],
                'error' => 'Failed to load roles data'
            ]);
        }
    }

    /**
     * Validate and clean request filters
     */
    private function validateAndCleanFilters(Request $request): array
    {
        $allowedSorts = ['name', 'created_at', 'updated_at', 'users_count', 'permissions_count'];
        $allowedDirections = ['asc', 'desc'];
        
        return array_filter([
            'search' => $request->input('search'),
            'per_page' => min(max((int) $request->input('per_page', 10), 1), 100), // Limit between 1-100
            'sort' => in_array($request->input('sort'), $allowedSorts) ? $request->input('sort') : 'created_at',
            'direction' => in_array($request->input('direction'), $allowedDirections) ? $request->input('direction') : 'desc',
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
            'status' => $request->input('status'),
            'permission' => $request->input('permission'),
            'page' => max((int) $request->input('page', 1), 1),
        ], function ($value) {
            return $value !== null && $value !== '' && $value !== 0;
        });
    }

    /**
     * Build comprehensive meta information
     */
    private function buildMetaInformation($roles): array
    {
        return [
            'hasMorePages' => $roles->hasMorePages(),
            'currentPage' => $roles->currentPage(),
            'lastPage' => $roles->lastPage(),
            'total' => $roles->total(),
            'from' => $roles->firstItem(),
            'to' => $roles->lastItem(),
            'perPage' => $roles->perPage(),
            'lastUpdated' => now()->toIso8601String(),
            'cacheControl' => 'private, max-age=60',
            'links' => [
                'first' => $roles->url(1),
                'last' => $roles->url($roles->lastPage()),
                'prev' => $roles->previousPageUrl(),
                'next' => $roles->nextPageUrl(),
            ]
        ];
    }

    /**
     * Get empty meta for error states
     */
    private function getEmptyMeta(): array
    {
        return [
            'hasMorePages' => false,
            'currentPage' => 1,
            'lastPage' => 1,
            'total' => 0,
            'from' => null,
            'to' => null,
            'perPage' => 10,
            'lastUpdated' => now()->toIso8601String(),
            'cacheControl' => 'no-cache',
            'links' => []
        ];
    }

    /**
     * Configure polling for real-time updates
     */
    private function configurePolling(Request $request, array $filters): void
    {
        $pollingInterval = $request->input('polling');
        
        if ($pollingInterval && is_numeric($pollingInterval) && $pollingInterval >= 5000) {
            Inertia::share('polling', [
                'interval' => (int) $pollingInterval,
                'endpoint' => route('app.roles.index', array_merge($filters, ['only' => 'roles,meta'])),
                'enabled' => true
            ]);
        }
    }

    /**
     * Configure prefetching for better performance
     */
    private function configurePrefetching($roles, array $filters): void
    {
        if ($roles->hasMorePages()) {
            Inertia::share('prefetch', [
                'next_page' => route('app.roles.index', array_merge($filters, [
                    'page' => $roles->currentPage() + 1,
                    'only' => 'roles,meta'
                ]))
            ]);
        }
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Roles/Create', [
            'permissions' => $this->roleService->getAllPermissions(),
            'stats' => $this->roleService->getStats(),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        try {
            $role = $this->roleService->createRole($request->validated());

            return redirect()
                ->route('app.roles.edit', $role)
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Role created successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error creating role: ' . $e->getMessage()
                ]);
        }
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('Admin/Roles/Edit', [
            'role' => $this->roleService->getRoleWithDetails($role),
            'permissions' => $this->roleService->getAllPermissions(),
            'stats' => $this->roleService->getStats(),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        try {
            $this->roleService->updateRole($role, $request->validated());

            return redirect()
                ->back()
                ->with(['success' => 'Role updated successfully']);

        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error updating role: ' . $e->getMessage()
                ]);
        }
    }

    public function destroy(Role $role): RedirectResponse
    {
        try {
            $this->roleService->deleteRole($role);

            return redirect()
                ->route('app.roles.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Role deleted successfully.'
                ]);
        } catch (\Exception $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error deleting role: ' . $e->getMessage()
            ]);
        }
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:roles,id'
            ]);

            $this->roleService->bulkDelete($validated['ids']);

            return back()->with('toast', [
                'type' => 'success',
                'message' => 'Selected roles deleted successfully'
            ]);
        } catch (\Exception $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error deleting roles: ' . $e->getMessage()
            ]);
        }
    }

    public function clone(Role $role): RedirectResponse
    {
        try {
            $clonedRole = $this->roleService->cloneRole($role);

            return redirect()
                ->route('app.roles.edit', $clonedRole)
                ->with('toast', [
                    'type' => 'success',
                    'message' => "Role {$role->name} cloned successfully."
                ]);
        } catch (\Exception $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error cloning role: ' . $e->getMessage()
            ]);
        }
    }
}
