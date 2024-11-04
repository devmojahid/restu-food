<?php

declare(strict_types=1);

namespace App\Services\Admin;

use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

final class RoleService
{
    public function getAllPermissions(): Collection
    {
        return Permission::all(['id', 'name', 'group_name']);
    }

    public function createRole(array $data): Role
    {
        $role = Role::create(['name' => $data['name']]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role;
    }

    public function updateRole(Role $role, array $data): Role
    {
        $role->update(['name' => $data['name']]);

        if (isset($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role;
    }

    public function deleteRole(Role $role): void
    {
        if ($role->name === 'Admin') {
            throw new \Exception('Cannot delete Admin role');
        }

        $role->delete();
    }
}
