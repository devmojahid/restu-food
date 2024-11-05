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

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'per_page' => $request->input('per_page', 10),
            'sort' => $request->input('sort', 'created_at'),
            'direction' => $request->input('direction', 'desc'),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
        ];

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $this->roleService->getPaginated($filters),
            'filters' => $filters,
            'stats' => $this->roleService->getStats(),
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
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Role updated successfully.'
                ]);
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

    public function export(Request $request): RedirectResponse
    {
        try {
            $filters = [
                'search' => $request->input('search'),
                'date_from' => $request->input('date_from'),
                'date_to' => $request->input('date_to'),
            ];

            $this->roleService->exportRoles($filters);

            return back()->with('toast', [
                'type' => 'success',
                'message' => 'Role export started. You will be notified when ready.'
            ]);
        } catch (\Exception $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error exporting roles: ' . $e->getMessage()
            ]);
        }
    }
}
