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
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

final class RoleService
{
    private const CACHE_TTL = 60; // 1 minute
    private const CACHE_KEYS = [
        'roles.all',
        'roles.stats',
        'permissions.all',
        'roles.paginated',
    ];

    protected string $model = Role::class;
    protected array $searchableFields = ['name', 'guard_name'];
    protected array $filterableFields = ['guard_name', 'permission'];
    protected array $sortableFields = ['name', 'created_at', 'updated_at', 'users_count', 'permissions_count'];
    protected array $relationships = ['permissions'];

    /**
     * Get paginated roles with comprehensive filtering and sorting
     */
    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 10), 1), 100);
        
        $query = $this->model::query()
            ->withCount('users');

        // Apply search filter
        $this->applySearchFilter($query, $filters);
        
        // Apply other filters
        $this->applyFilters($query, $filters);
        
        // Apply sorting with validation
        $this->applySorting($query, $filters);

        // Load relationships efficiently
        $query->with(['permissions:id,name,group_name']);

        // Select only necessary columns for performance
        $query->select([
            'id',
            'name',
            'guard_name',
            'created_at',
            'updated_at'
        ]);

        // Paginate with query string preservation
        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Apply search filtering to query
     */
    private function applySearchFilter(Builder $query, array $filters): void
    {
        if (empty($filters['search'])) {
            return;
        }

        $search = trim($filters['search']);
        if (empty($search)) {
            return;
        }

        $query->where(function (Builder $q) use ($search) {
            // Search in role fields
            foreach ($this->searchableFields as $field) {
                $q->orWhere($field, 'LIKE', "%{$search}%");
            }
            
            // Search in related permissions
            $q->orWhereHas('permissions', function ($permQuery) use ($search) {
                $permQuery->where('name', 'LIKE', "%{$search}%")
                         ->orWhere('group_name', 'LIKE', "%{$search}%");
            });
        });
    }

    /**
     * Apply various filters to the query
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        // Guard name filter
        if (!empty($filters['status'])) {
            $query->where('guard_name', $filters['status']);
        }

        // Permission-based filter
        if (!empty($filters['permission'])) {
            switch ($filters['permission']) {
                case 'has_permissions':
                    $query->has('permissions');
                    break;
                case 'no_permissions':
                    $query->doesntHave('permissions');
                    break;
            }
        }

        // Date range filters
        $this->applyDateFilters($query, $filters);
    }

    /**
     * Apply date range filtering
     */
    private function applyDateFilters(Builder $query, array $filters): void
    {
        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            try {
                $dateFrom = Carbon::parse($filters['date_from'])->startOfDay();
                $dateTo = Carbon::parse($filters['date_to'])->endOfDay();
                $query->whereBetween('created_at', [$dateFrom, $dateTo]);
            } catch (\Exception $e) {
                Log::warning('Invalid date range in role filter', [
                    'date_from' => $filters['date_from'],
                    'date_to' => $filters['date_to']
                ]);
            }
        } elseif (!empty($filters['date_from'])) {
            try {
                $dateFrom = Carbon::parse($filters['date_from'])->startOfDay();
                $query->where('created_at', '>=', $dateFrom);
            } catch (\Exception $e) {
                Log::warning('Invalid date_from in role filter', ['date_from' => $filters['date_from']]);
            }
        } elseif (!empty($filters['date_to'])) {
            try {
                $dateTo = Carbon::parse($filters['date_to'])->endOfDay();
                $query->where('created_at', '<=', $dateTo);
            } catch (\Exception $e) {
                Log::warning('Invalid date_to in role filter', ['date_to' => $filters['date_to']]);
            }
        }
    }

     /**
     * Apply sorting with proper validation
     */
    private function applySorting(Builder $query, array $filters): void
    {
        $sortColumn = $filters['sort'] ?? 'created_at';
        $sortDirection = $filters['direction'] ?? 'desc';
        
        // Validate sort direction
        if (!in_array(strtolower($sortDirection), ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }

        // Apply sorting based on column type
        if (in_array($sortColumn, $this->sortableFields)) {
            switch ($sortColumn) {
                case 'permissions_count':
                    $query->withCount('permissions')
                          ->orderBy('permissions_count', $sortDirection);
                    break;
                case 'users_count':
                    // users_count is already loaded via withCount
                    $query->orderBy('users_count', $sortDirection);
                    break;
                default:
                    $query->orderBy($sortColumn, $sortDirection);
                    break;
            }
        } else {
            // Default sorting
            $query->orderBy('created_at', 'desc');
        }

        // Add secondary sort by ID for consistent ordering
        $query->orderBy('id', $sortDirection);
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
            
            // Clear cache more aggressively
            $this->clearAllCache();
            
            // Clear permission cache from Spatie directly
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
            
            // Also clear some specific cached keys that might contain role data
            Cache::forget("roles.all");
            Cache::forget("roles.paginated");
            Cache::forget("roles.stats");

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

            // Clear cache after successful update - be more aggressive with cache clearing
            $this->clearAllCache();
            
            // Clear permission cache from Spatie directly
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
            
            // Also clear some specific cached keys that might contain role data
            Cache::forget("roles.details.{$role->id}");
            Cache::forget("roles.all");
            Cache::forget("roles.paginated");
            Cache::forget("roles.stats");

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

    public function cloneRole(Role $role): Role
    {
        try {
            DB::beginTransaction();

            // Create a clone of the role with a unique name
            $clonedRole = Role::create([
                'name' => $this->generateUniqueName($role->name),
                'guard_name' => $role->guard_name ?? 'web',
            ]);

            // Clone permissions
            $permissions = $role->permissions()->pluck('name')->toArray();
            if (!empty($permissions)) {
                $clonedRole->syncPermissions($permissions);
            }

            DB::commit();
            
            // Clear cache aggressively
            $this->clearAllCache();
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

            return $clonedRole->fresh(['permissions']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Role cloning failed', [
                'id' => $role->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Generate a unique name for a cloned role
     */
    private function generateUniqueName(string $originalName): string
    {
        $baseName = $originalName . ' (Copy)';
        $name = $baseName;
        $counter = 1;

        // Keep incrementing until we find a unique name
        while (Role::where('name', $name)->exists()) {
            $name = $baseName . ' ' . $counter;
            $counter++;
        }

        return $name;
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
            
            // Force immediate flush for some cache drivers
            if (method_exists(Cache::getStore(), 'flush')) {
                try {
                    Cache::getStore()->flush();
                } catch (\Exception $e) {
                    // Some cache implementations don't support flush
                    Log::error('Cache flush failed', ['error' => $e->getMessage()]);
                }
            }
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
            // Use a simpler approach that doesn't rely on implementation-specific methods
            // This works with any cache driver
            if (in_array($pattern, ['roles.*', 'permissions.*'])) {
                // Clear specific cache keys we know are used
                $keys = [
                    'roles.all',
                    'roles.stats',
                    'permissions.all',
                    'roles.paginated',
                    'roles.details.*',
                ];
                
                foreach ($keys as $key) {
                    if (strpos($key, '*') !== false) {
                        // For wildcard keys, get the prefix and flush tags
                        $prefix = str_replace('*', '', $key);
                        Cache::forget($prefix);
                        // Also try with tags if available
                        try {
                            Cache::tags([$prefix])->flush();
                        } catch (\Exception $e) {
                            // Some cache drivers don't support tags
                        }
                    } else {
                        Cache::forget($key);
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
