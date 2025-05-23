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

final class RoleController extends Controller
{
    public function __construct(
        private readonly RoleService $roleService
    ) {}

    // Fixed Role Controller
    public function index(Request $request): Response
    {
        // Clean the filters by removing empty values
        $filters = array_filter([
            'search' => $request->input('search'),
            'per_page' => $request->input('per_page', 10),
            'sort' => $request->input('sort', 'created_at'),
            'direction' => $request->input('direction', 'desc'),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
            'status' => $request->input('status'), // Add status filter if needed
        ], function ($value) {
            return $value !== null && $value !== '';
        });

        // Get the data using the service
        $roles = $this->roleService->getPaginated($filters);
        
        // Enhanced meta information for client-side handling
        $meta = [
            'hasMorePages' => $roles->hasMorePages(),
            'currentPage' => $roles->currentPage(),
            'lastPage' => $roles->lastPage(),
            'total' => $roles->total(),
            'from' => $roles->firstItem(),
            'to' => $roles->lastItem(),
            'lastUpdated' => now()->toIso8601String(),
            'cacheControl' => 'private, max-age=60',
        ];

        // Set up polling for real-time updates if requested
        $pollingInterval = $request->input('polling', null);
        
        if ($pollingInterval && is_numeric($pollingInterval)) {
            Inertia::share('polling', [
                'interval' => (int) $pollingInterval,
                'endpoint' => route('app.roles.index', array_merge($filters, ['only' => 'roles,meta'])),
            ]);
        }

        // For prefetching next page data
        if ($roles->hasMorePages()) {
            Inertia::share('prefetch', [
                'next_page' => route('app.roles.index', array_merge($filters, ['page' => $roles->currentPage() + 1, 'only' => 'roles,meta']))
            ]);
        }

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'filters' => $filters,
            'stats' => fn () => $this->roleService->getStats(), // Deferred prop for better performance
            'meta' => $meta,
        ]);
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
