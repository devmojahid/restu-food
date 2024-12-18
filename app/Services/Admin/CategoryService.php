<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Category;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use Illuminate\Pagination\LengthAwarePaginator;

final class CategoryService extends BaseService
{
    protected string $model = Category::class;
    protected string $cachePrefix = 'categories:';
    protected array $searchableFields = ['name', 'slug', 'description'];
    protected array $filterableFields = ['type', 'is_active', 'parent_id'];
    protected array $sortableFields = ['name', 'sort_order', 'created_at'];

    /**
     * Generate a unique slug
     */
    protected function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        while (true) {
            // Build query to check for existing slug
            $query = $this->model::where('slug', $slug);
            
            // Exclude current category if updating
            if ($ignoreId) {
                $query->where('id', '!=', $ignoreId);
            }

            // If no duplicate found, break the loop
            if (!$query->exists()) {
                break;
            }

            // Try next number
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Store a new category with files
     */
    public function store(array $data): Model
    {
        try {
            DB::beginTransaction();

            // Extract files data
            $files = $data['files'] ?? [];
            unset($data['files']);

            // Generate unique slug
            $data['slug'] = $this->generateUniqueSlug($data['name']);

            // Create category
            $category = $this->model::create($data);

            // Handle file uploads
            $this->handleFileUploads($category, $files);

            DB::commit();
            return $category->fresh(['files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    /**
     * Update category with files
     */
    public function update(int $id, array $data): Model
    {
        try {
            DB::beginTransaction();

            $category = $this->findOrFail($id);

            // Extract files data
            $files = $data['files'] ?? [];
            unset($data['files']);

            // Generate unique slug if needed
            if (empty($data['slug'])) {
                $data['slug'] = $this->generateUniqueSlug($data['name'], $id);
            } elseif ($data['slug'] !== $category->slug) {
                $data['slug'] = $this->generateUniqueSlug($data['slug'], $id);
            }

            // Update category
            $category->update($data);

            // Handle file uploads
            $this->handleFileUploads($category, $files);

            DB::commit();
            return $category->fresh(['files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    /**
     * Handle file uploads for category
     */
    protected function handleFileUploads(Category $category, array $files): void
    {
        // Handle icon
        if (isset($files['icon'])) {
            if ($files['icon']) {
                $category->syncFiles([$files['icon']], Category::COLLECTION_ICON);
            } else {
                $category->clearFiles(Category::COLLECTION_ICON);
            }
        }

        // Handle thumbnail
        if (isset($files['thumbnail'])) {
            if ($files['thumbnail']) {
                $category->syncFiles([$files['thumbnail']], Category::COLLECTION_THUMBNAIL);
            } else {
                $category->clearFiles(Category::COLLECTION_THUMBNAIL);
            }
        }
    }

    /**
     * Get parent categories for dropdown
     */
    public function getParentCategories(string $type): Collection
    {
        $cacheKey = "{$this->cachePrefix}parents:{$type}";

        return Cache::remember($cacheKey, now()->addHour(), function () use ($type) {
            return $this->model::query()
                ->where('type', $type)
                ->whereNull('parent_id')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'slug']);
        });
    }

    /**
     * Get hierarchical categories
     */
    public function getHierarchical(string $type, bool $activeOnly = true): array
    {
        $cacheKey = "{$this->cachePrefix}hierarchical:{$type}:" . ($activeOnly ? 'active' : 'all');

        return Cache::remember($cacheKey, now()->addHour(), function () use ($type, $activeOnly) {
            $query = $this->model::ofType($type)->with(['files']);

            if ($activeOnly) {
                $query->active();
            }

            $categories = $query->orderBy('sort_order')->get();
            return $this->buildTree($categories);
        });
    }

    /**
     * Update category order
     */
    public function updateOrder(int $id, int $order): bool
    {
        try {
            DB::beginTransaction();

            $category = $this->findOrFail($id);
            $category->sort_order = $order;
            $category->save();

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category order update failed', [
                'id' => $id,
                'order' => $order,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Move category to new parent
     */
    public function move(int $id, ?int $parentId): bool
    {
        try {
            DB::beginTransaction();

            $category = $this->findOrFail($id);

            if ($parentId) {
                $parent = $this->findOrFail($parentId);
                if ($parent->type !== $category->type) {
                    throw new \Exception('Parent category must be of the same type.');
                }
            }

            $category->parent_id = $parentId;
            $category->save();

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category move failed', [
                'id' => $id,
                'parent_id' => $parentId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Update category status
     */
    public function updateStatus(int $id, bool $status): bool
    {
        try {
            DB::beginTransaction();

            $category = $this->findOrFail($id);
            
            // Update the status
            $category->update([
                'is_active' => $status
            ]);

            // If deactivating, also deactivate all children
            if (!$status) {
                $category->children()->update(['is_active' => false]);
            }

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Category status update failed', [
                'id' => $id,
                'status' => $status,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Bulk update category status
     */
    public function bulkUpdateStatus(array $ids, bool $status, string $field = 'is_active'): bool
    {
        try {
            DB::beginTransaction();

            $categories = $this->model::whereIn('id', $ids)->get();

            foreach ($categories as $category) {
                $category->{$field} = $status;
                $category->save();

                // If we're deactivating and the field is is_active, also deactivate descendants
                if (!$status && $field === 'is_active') {
                    $category->descendants()->update([$field => false]);
                }
            }

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk category status update failed', [
                'ids' => $ids,
                'status' => $status,
                'field' => $field,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Build tree structure from flat categories
     */
    protected function buildTree($categories, $parentId = null): array
    {
        $branch = [];

        foreach ($categories as $category) {
            if ($category->parent_id === $parentId) {
                $children = $this->buildTree($categories, $category->id);
                if ($children) {
                    $category->children = $children;
                }
                $branch[] = $category;
            }
        }

        return $branch;
    }

    /**
     * Clear category cache
     */
    protected function clearCache(): void
    {
        // Get all category types
        $types = ['blog', 'product']; // Add all your category types here

        foreach ($types as $type) {
            Cache::forget("{$this->cachePrefix}hierarchical:{$type}:active");
            Cache::forget("{$this->cachePrefix}hierarchical:{$type}:all");
            Cache::forget("{$this->cachePrefix}parents:{$type}");
        }

        // Or simply clear all cache if needed
        // Cache::flush();
    }

    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model::query()
            ->with(['files', 'parent']); // Include relationships

        // Apply type filter
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                foreach ($this->searchableFields as $field) {
                    $q->orWhere($field, 'like', "%{$filters['search']}%");
                }
            });
        }

        // Apply status filter only if explicitly set
        if (isset($filters['is_active']) && $filters['is_active'] !== null) {
            $query->where('is_active', $filters['is_active']);
        }

        // Apply parent filter
        if (isset($filters['parent_id'])) {
            $query->where('parent_id', $filters['parent_id']);
        }

        // Apply sorting
        $query->orderBy('sort_order', 'asc')
            ->orderBy('name', 'asc');

        // Debug the query
        Log::info('Final Category Query:', [
            'filters' => $filters,
            'sql' => $query->toSql(),
            'bindings' => $query->getBindings(),
            'raw_sql' => vsprintf(str_replace(['?'], ['\'%s\''], $query->toSql()), $query->getBindings())
        ]);

        // Get paginated results
        $results = $query->paginate($filters['per_page'] ?? 10);

        return $results;
    }
}
