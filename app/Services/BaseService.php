<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

abstract class BaseService
{
    protected string $model;
    protected string $cachePrefix;
    protected int $cacheDuration = 30; // minutes
    protected array $relationships = [];
    protected array $searchableFields = [];
    protected array $filterableFields = [];
    protected array $sortableFields = [];

    /**
     * Find a model by ID
     */
    public function find(int $id, array $relationships = []): ?Model
    {
        $cacheKey = $this->getCacheKey("single:{$id}");

        return Cache::remember(
            $cacheKey,
            now()->addMinutes($this->cacheDuration),
            fn() => $this->query()
                ->with($relationships ?: $this->relationships)
                ->find($id)
        );
    }

    /**
     * Find a model by ID or fail
     */
    public function findOrFail(int $id, array $relationships = []): Model
    {
        $model = $this->find($id, $relationships);

        if (!$model) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException(
                sprintf('Model %s not found', class_basename($this->model))
            );
        }

        return $model;
    }

    /**
     * Get paginated results with filters
     */
    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        $query = $this->query()->with($this->relationships);

        // Apply search
        if (!empty($filters['search']) && !empty($this->searchableFields)) {
            $query->where(function (Builder $q) use ($filters) {
                foreach ($this->searchableFields as $field) {
                    $q->orWhere($field, 'like', "%{$filters['search']}%");
                }
            });
        }

        // Apply filters
        foreach ($this->filterableFields as $field) {
            if (isset($filters[$field])) {
                $query->where($field, $filters[$field]);
            }
        }

        // Apply date range filters
        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        // Apply sorting
        $sortField = $filters['sort'] ?? 'created_at';
        $sortDirection = $filters['direction'] ?? 'desc';

        if (in_array($sortField, $this->sortableFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }

    /**
     * Create a new model
     */
    public function create(array $data): Model
    {
        try {
            DB::beginTransaction();

            $model = $this->model::create($data);

            if (method_exists($this, 'afterCreate')) {
                $this->afterCreate($model, $data);
            }

            DB::commit();
            $this->clearCache();

            return $model;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Creation failed', $e, $data);
            throw $e;
        }
    }

    /**
     * Update a model
     */
    public function update(int $id, array $data): Model
    {
        try {
            DB::beginTransaction();

            $model = $this->findOrFail($id);
            $model->update($data);

            if (method_exists($this, 'afterUpdate')) {
                $this->afterUpdate($model, $data);
            }

            DB::commit();
            $this->clearCache();

            return $model->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Update failed', $e, ['id' => $id, 'data' => $data]);
            throw $e;
        }
    }

    /**
     * Delete a model
     */
    public function delete(int $id): bool
    {
        try {
            DB::beginTransaction();

            $model = $this->findOrFail($id);

            if (method_exists($this, 'beforeDelete')) {
                $this->beforeDelete($model);
            }

            $model->delete();

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Deletion failed', $e, ['id' => $id]);
            throw $e;
        }
    }

    /**
     * Bulk delete models
     */
    public function bulkDelete(array $ids): bool
    {
        try {
            DB::beginTransaction();

            $models = $this->model::whereIn('id', $ids)->get();

            foreach ($models as $model) {
                if (method_exists($this, 'beforeDelete')) {
                    $this->beforeDelete($model);
                }
                $model->delete();
            }

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Bulk deletion failed', $e, ['ids' => $ids]);
            throw $e;
        }
    }

    /**
     * Toggle model status
     */
    public function toggleStatus(int $id, string $field = 'is_active'): Model
    {
        $model = $this->findOrFail($id);
        $model->update([$field => !$model->$field]);

        $this->clearCache();
        return $model;
    }

    /**
     * Bulk update model status
     */
    public function bulkUpdateStatus(array $ids, bool $status, string $field = 'is_active'): bool
    {
        try {
            DB::beginTransaction();

            $this->model::whereIn('id', $ids)->update([$field => $status]);

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError('Bulk status update failed', $e, ['ids' => $ids, 'status' => $status]);
            throw $e;
        }
    }

    /**
     * Get base query
     */
    protected function query(): Builder
    {
        return $this->model::query();
    }

    /**
     * Get cache key
     */
    protected function getCacheKey(string $key): string
    {
        $prefix = $this->cachePrefix ?? Str::snake(class_basename($this->model));
        return "{$prefix}:{$key}";
    }

    /**
     * Clear cache
     */
    protected function clearCache(): void
    {
        $prefix = $this->cachePrefix ?? Str::snake(class_basename($this->model));
        Cache::tags($prefix)->flush();
    }

    /**
     * Log error
     */
    protected function logError(string $message, \Exception $e, array $context = []): void
    {
        Log::error(sprintf(
            '%s: %s',
            $message,
            $e->getMessage()
        ), array_merge($context, [
            'service' => static::class,
            'trace' => $e->getTraceAsString()
        ]));
    }

    /**
     * Get all models
     */
    public function all(array $relationships = []): Collection
    {
        return $this->query()
            ->with($relationships ?: $this->relationships)
            ->get();
    }

    /**
     * Find by field
     */
    public function findBy(string $field, mixed $value, array $relationships = []): ?Model
    {
        return $this->query()
            ->with($relationships ?: $this->relationships)
            ->where($field, $value)
            ->first();
    }

    /**
     * Find by field or fail
     */
    public function findByOrFail(string $field, mixed $value, array $relationships = []): Model
    {
        $model = $this->findBy($field, $value, $relationships);

        if (!$model) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException(
                sprintf('Model %s not found by %s', class_basename($this->model), $field)
            );
        }

        return $model;
    }

    /**
     * Hook that runs after creating a model
     */
    protected function afterCreate(Model $model, array $data): void
    {
        // Override in child class if needed
    }

    /**
     * Hook that runs after updating a model
     */
    protected function afterUpdate(Model $model, array $data): void
    {
        // Override in child class if needed
    }

    /**
     * Hook that runs before deleting a model
     */
    protected function beforeDelete(Model $model): void
    {
        // Override in child class if needed
    }
}
