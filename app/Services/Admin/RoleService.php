<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final class RoleService
{
    private const CACHE_TTL = 3600; // 1 hour
    private const CACHE_KEYS = [
        'roles.all',
        'roles.stats',
        'permissions.all',
        'roles.paginated',
    ];

    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        $cacheKey = $this->generateCacheKey('roles.paginated', $filters);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($filters) {
            $query = Role::with(['permissions', 'users'])
                ->withCount('users');

            // Apply search filter
            if (!empty($filters['search'])) {
                $searchTerm = trim($filters['search']);
                if (!empty($searchTerm)) {
                    $query->where(function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%")
                            ->orWhere('created_at', 'like', "%{$searchTerm}%");
                    });
                }
            }

            // Apply date filters
            if (!empty($filters['date_from'])) {
                $query->whereDate('created_at', '>=', $filters['date_from']);
            }
            if (!empty($filters['date_to'])) {
                $query->whereDate('created_at', '<=', $filters['date_to']);
            }

            // Apply sorting
            $sortField = $filters['sort'] ?? 'created_at';
            $sortDirection = $filters['direction'] ?? 'desc';

            // Validate sort field to prevent SQL injection
            $allowedSortFields = ['name', 'created_at', 'updated_at', 'users_count'];
            if (!in_array($sortField, $allowedSortFields)) {
                $sortField = 'created_at';
            }

            $query->orderBy($sortField, $sortDirection);

            return $query->paginate($filters['per_page'] ?? 10);
        });
    }

    public function getAllPermissions(): Collection
    {
        return Cache::remember('permissions.all', self::CACHE_TTL, function () {
            return Permission::all(['id', 'name', 'group_name']);
        });
    }

    public function getRoleWithDetails(Role $role): array
    {
        $cacheKey = "roles.details.{$role->id}";
        $this->addCacheKey($cacheKey);

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'guard_name' => $role->guard_name,
                'permissions' => $role->permissions->pluck('name'),
                'users_count' => $role->users()->count(),
                'created_at' => $role->created_at,
                'updated_at' => $role->updated_at,
            ];
        });
    }

    public function createRole(array $data): Role
    {
        try {
            DB::beginTransaction();

            // Create the role
            $role = Role::create([
                'name' => $data['name'],
                'guard_name' => $data['guard_name'] ?? 'web',
            ]);

            // Sync permissions
            if (isset($data['permissions']) && is_array($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            }

            DB::commit();
            $this->clearAllCache();

            return $role->fresh(['permissions']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Role creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function updateRole(Role $role, array $data): Role
    {
        try {
            DB::beginTransaction();

            // Update basic info
            $role->update([
                'name' => $data['name'],
                'guard_name' => $data['guard_name'] ?? 'web',
            ]);

            // Sync permissions if provided
            if (isset($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            }

            DB::commit();

            // Clear cache after successful update
            $this->clearAllCache();

            // Return fresh instance with permissions
            return $role->fresh(['permissions']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Role update failed', [
                'id' => $role->id,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
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

            // Remove role from users
            $role->users()->detach();

            // Delete the role
            $role->delete();

            DB::commit();
            $this->clearAllCache();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Role deletion failed', [
                'id' => $role->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function bulkDelete(array $ids): bool
    {
        try {
            DB::beginTransaction();

            $roles = Role::whereIn('id', $ids)
                ->where('name', '!=', 'Admin')
                ->get();

            foreach ($roles as $role) {
                $role->users()->detach();
                $role->delete();
            }

            DB::commit();
            $this->clearAllCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk role deletion failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function getStats(): array
    {
        return Cache::remember('roles.stats', self::CACHE_TTL, function () {
            return [
                'total_roles' => Role::count(),
                'total_permissions' => Permission::count(),
                'users_with_roles' => User::whereHas('roles')->count(),
                'permissions_by_group' => Permission::select('group_name', DB::raw('count(*) as count'))
                    ->groupBy('group_name')
                    ->pluck('count', 'group_name')
                    ->toArray(),
            ];
        });
    }

    private function clearAllCache(): void
    {
        try {
            // Clear standard cache keys
            foreach (self::CACHE_KEYS as $key) {
                Cache::forget($key);
            }

            // Clear paginated cache keys
            $paginatedKeys = Cache::get('roles.paginated.keys', []);
            foreach ($paginatedKeys as $key) {
                Cache::forget($key);
            }
            Cache::forget('roles.paginated.keys');

            // Clear role detail cache keys
            $roleDetailKeys = Cache::get('roles.details.keys', []);
            foreach ($roleDetailKeys as $key) {
                Cache::forget($key);
            }
            Cache::forget('roles.details.keys');

            // Clear permission cache from Spatie
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

            // Clear specific pattern-based cache keys
            $this->clearCacheByPattern('roles.*');
            $this->clearCacheByPattern('permissions.*');
        } catch (\Exception $e) {
            Log::error('Cache clearing failed', [
                'error' => $e->getMessage()
            ]);
            // Continue execution even if cache clearing fails
        }
    }

    private function clearCacheByPattern(string $pattern): void
    {
        try {
            $cache = Cache::getStore();

            if (method_exists($cache, 'getPrefix')) {
                $prefix = $cache->getPrefix();

                // Get all cache keys
                if (method_exists($cache, 'all')) {
                    $keys = array_keys($cache->all());

                    foreach ($keys as $key) {
                        // Remove prefix from key
                        $unprefixedKey = str_replace($prefix, '', $key);

                        // If key matches pattern, delete it
                        if (fnmatch($pattern, $unprefixedKey)) {
                            Cache::forget($unprefixedKey);
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Pattern-based cache clearing failed', [
                'pattern' => $pattern,
                'error' => $e->getMessage()
            ]);
        }
    }

    private function generateCacheKey(string $prefix, array $params): string
    {
        $key = $prefix . ':' . md5(serialize($params));
        $this->addCacheKey($key);
        return $key;
    }

    private function addCacheKey(string $key): void
    {
        try {
            $keyType = explode('.', $key)[0] . '.' . explode('.', $key)[1];
            $keysKey = $keyType . '.keys';

            $keys = Cache::get($keysKey, []);
            if (!in_array($key, $keys)) {
                $keys[] = $key;
                Cache::put($keysKey, $keys, self::CACHE_TTL);
            }
        } catch (\Exception $e) {
            Log::error('Cache key tracking failed', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
        }
    }
}
