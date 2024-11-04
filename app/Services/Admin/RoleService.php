<?php

declare(strict_types=1);

namespace App\Services\Admin;

use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

final class RoleService
{
    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        $query = Role::with('permissions')
            ->withCount('users');

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        // Apply sorting
        $sortField = $filters['sort'] ?? 'created_at';
        $sortDirection = $filters['direction'] ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function getAllPermissions(): Collection
    {
        return Permission::all(['id', 'name', 'group_name']);
    }

    public function createRole(array $data): Role
    {
        try {
            DB::beginTransaction();

            $role = Role::create(['name' => $data['name']]);

            if (isset($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            }

            DB::commit();
            return $role;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateRole(Role $role, array $data): Role
    {
        try {
            DB::beginTransaction();

            $role->update(['name' => $data['name']]);

            if (isset($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            }

            DB::commit();
            return $role;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteRole(Role $role): void
    {
        try {
            DB::beginTransaction();

            if ($role->name === 'Admin') {
                throw new \Exception('Cannot delete Admin role');
            }

            $role->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function bulkDelete(array $ids): bool
    {
        try {
            DB::beginTransaction();

            Role::whereIn('id', $ids)
                ->where('name', '!=', 'Admin')
                ->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
