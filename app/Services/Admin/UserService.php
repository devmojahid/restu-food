<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\User;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use App\Models\File;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

final class UserService extends BaseService
{
    protected string $model = User::class;
    protected string $cachePrefix = 'users:';
    protected array $searchableFields = ['name', 'email'];
    protected array $filterableFields = ['status'];
    protected array $sortableFields = ['name', 'email', 'created_at'];
    protected array $relationships = ['roles', 'files'];

    /**
     * Get paginated users with filters for infinite scroll
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? 10;
        $query = $this->model::query()
            ->with($this->relationships);

        // Apply search filter if provided
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                foreach ($this->searchableFields as $field) {
                    $q->orWhere($field, 'LIKE', "%{$search}%");
                }
            });
        }

        // Apply role filter if provided
        if (!empty($filters['role'])) {
            $query->whereHas('roles', function ($q) use ($filters) {
                $q->where('name', $filters['role']);
            });
        }

        // Apply status filter if provided
        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        // Apply date range filter if provided
        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            $query->whereBetween('created_at', [$filters['date_from'], $filters['date_to']]);
        } else if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        } else if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        // Apply sorting
        $sortColumn = $filters['sort'] ?? 'created_at';
        $sortDirection = $filters['direction'] ?? 'desc';
        
        // Validate sort column to prevent SQL injection
        if (in_array($sortColumn, $this->sortableFields)) {
            $query->orderBy($sortColumn, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Add a secondary sort by ID to ensure consistent ordering for identical values
        $query->orderBy('id', $sortDirection);

        // Use efficient eager loading to limit the data transferred
        $query->select([
            'id', 
            'name', 
            'email', 
            'status', 
            'created_at',
            'email_verified_at'
        ]);

        // Paginate the results efficiently for infinite scroll
        return $query->paginate($perPage)->withQueryString();
    }

    public function getAllRoles(): array
    {
        return Role::all(['id', 'name'])->toArray();
    }

    public function store(array $data): User
    {
        try {
            DB::beginTransaction();

            // Hash password
            if (isset($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            }

            // Create user
            $user = $this->model::create($data);

            // Assign role
            if (!empty($data['role'])) {
                $user->assignRole($data['role']);
            }

            // Handle avatar upload
            if (!empty($data['files']['avatar'])) {
                $this->handleFileUploads($user, $data['files']);
            }

            DB::commit();

            return $user->fresh(['roles', 'files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('User creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function update(int $id, array $data): User
    {
        try {
            DB::beginTransaction();

            $user = $this->findOrFail($id);

            // Hash password if provided
            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            // Update user
            $user->update($data);

            // Update role if provided
            if (!empty($data['role'])) {
                $user->syncRoles([$data['role']]);
            }

            // Handle avatar update
            if (isset($data['files'])) {
                $this->syncFileCollections($user, $data['files']);
            }

            DB::commit();
            $this->clearCacheForUser($id);

            return $user->fresh(['roles', 'files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('User update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function handleFileUploads(User $user, array $files): void
    {
        if (!empty($files['avatar'])) {
            // Delete existing avatar
            $user->files()->where('collection', 'avatar')->delete();

            // Attach new avatar
            if (!empty($files['avatar']['uuid'])) {
                $fileModel = File::where('uuid', $files['avatar']['uuid'])->first();
                if ($fileModel) {
                    $fileModel->update([
                        'fileable_type' => get_class($user),
                        'fileable_id' => $user->id,
                        'collection' => 'avatar'
                    ]);
                }
            }
        }
    }

    protected function syncFileCollections(User $user, array $files): void
    {
        if (isset($files['avatar'])) {
            if (empty($files['avatar'])) {
                $user->removeFiles('avatar');
            } else {
                $user->syncFiles([$files['avatar']], 'avatar');
            }
        }
    }

    public function bulkDelete(array $ids): bool
    {
        try {
            DB::beginTransaction();

            $users = $this->model::whereIn('id', $ids)->get();
            foreach ($users as $user) {
                // Delete avatar if exists
                $user->files()->where('collection', 'avatar')->delete();
                // Remove roles
                $user->roles()->detach();
                $user->delete();
            }

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk delete failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function bulkUpdateStatus(array $ids, bool $status, string $field = 'status'): bool
    {
        try {
            DB::beginTransaction();

            $this->model::whereIn('id', $ids)->update([
                $field => $status
            ]);

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk status update failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function updateUserData(int $id, array $data): User
    {
        try {
            DB::beginTransaction();
            $user = $this->findOrFail($id);
            $user->update($data);
            DB::commit();
            $this->clearCacheForUser($id);
            return $user->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateUserMeta(int $id, array $metaData): User
    {
        try {
            DB::beginTransaction();
            $user = $this->findOrFail($id);
            $user->setMultipleMeta($metaData);
            DB::commit();
            $this->clearCacheForUser($id);
            return $user->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateUserAvatar(int $id, array $avatar): User
    {
        try {
            DB::beginTransaction();
            $user = $this->findOrFail($id);
            $this->syncFileCollections($user, ['avatar' => $avatar]);
            DB::commit();
            $this->clearCacheForUser($id);
            return $user->fresh(['files']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Clear cache for a specific user
     * 
     * @param int $userId
     * @return void
     */
    protected function clearCacheForUser(int $userId): void
    {
        Cache::forget("{$this->cachePrefix}{$userId}");
        Cache::tags(['user_meta', "user_{$userId}"])->flush();
    }
}
