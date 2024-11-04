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
        ];

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $this->roleService->getPaginated($filters),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Roles/Create', [
            'permissions' => $this->roleService->getAllPermissions(),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $this->roleService->createRole($request->validated());

        return redirect()
            ->route('app.roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('Admin/Roles/Edit', [
            'role' => $role->load('permissions'),
            'permissions' => $this->roleService->getAllPermissions(),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $this->roleService->updateRole($role, $request->validated());

        return redirect()
            ->route('app.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $this->roleService->deleteRole($role);

        return redirect()
            ->route('app.roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}
