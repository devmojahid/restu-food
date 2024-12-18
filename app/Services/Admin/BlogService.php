<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Blog;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

final class BlogService extends BaseService
{
    protected string $model = Blog::class;
    protected array $searchableFields = ['title', 'content', 'slug'];
    protected array $filterableFields = ['is_published', 'user_id', 'is_featured'];
    protected array $sortableFields = ['title', 'created_at', 'published_at', 'is_featured'];
    protected array $relationships = ['user', 'categories'];

    /**
     * Get paginated blogs
     */
    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        return $this->getFilteredQuery($filters)->paginate($filters['per_page'] ?? 10);
    }

    /**
     * Store a new blog with file handling
     */
    public function store(array $data): Model
    {
        try {
            DB::beginTransaction();

            // Create blog
            $blog = $this->model::create($data);

            // Handle categories if provided
            if (!empty($data['categories'])) {
                $categoryData = collect($data['categories'])->mapWithKeys(function ($categoryId, $index) {
                    return [$categoryId => ['sort_order' => $index]];
                })->all();
                
                $blog->categories()->attach($categoryData);
            }

            // Handle files if provided
            if (!empty($data['files'])) {
                $blog->handleFiles($data['files']);
            }

            DB::commit();
            return $blog->fresh($this->relationships);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Blog creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    /**
     * Update a blog with file handling
     */
    public function update(int $id, array $data): Model
    {
        try {
            DB::beginTransaction();

            $blog = $this->findOrFail($id);
            $blog->update($data);

            // Handle categories if provided
            if (isset($data['categories'])) {
                $categoryData = collect($data['categories'])->mapWithKeys(function ($categoryId, $index) {
                    return [$categoryId => ['sort_order' => $index]];
                })->all();
                
                $blog->categories()->sync($categoryData);
            }

            // Handle files if provided
            if (!empty($data['files'])) {
                $blog->handleFiles($data['files']);
            }

            DB::commit();
            return $blog->fresh($this->relationships);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Blog update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    /**
     * Get filtered query
     */
    private function getFilteredQuery(array $filters): Builder
    {
        $query = $this->query()->with($this->relationships);

        if (!empty($filters['search'])) {
            $this->applySearch($query, $filters['search']);
        }

        if (!empty($filters['status'])) {
            $this->applyStatusFilter($query, $filters['status']);
        }

        if (!empty($filters['date_range'])) {
            $this->applyDateFilter($query, $filters['date_range']);
        }

        $this->applySorting($query, $filters);

        return $query;
    }

    /**
     * Apply search to query
     */
    private function applySearch(Builder $query, string $search): void
    {
        $query->where(function ($query) use ($search) {
            foreach ($this->searchableFields as $field) {
                $query->orWhere($field, 'like', "%{$search}%");
            }

            $query->orWhereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        });
    }

    /**
     * Apply status filter
     */
    private function applyStatusFilter(Builder $query, string $status): void
    {
        match ($status) {
            'published' => $query->published(),
            'draft' => $query->where('is_published', false),
            'scheduled' => $query->where('is_published', true)
                ->where('published_at', '>', now()),
            default => null
        };
    }

    /**
     * Apply date filter
     */
    private function applyDateFilter(Builder $query, mixed $dateRange): void
    {
        $dates = is_string($dateRange) ? json_decode($dateRange, true) : $dateRange;
        
        if (!empty($dates['from'])) {
            $query->whereDate('created_at', '>=', $dates['from']);
        }
        
        if (!empty($dates['to'])) {
            $query->whereDate('created_at', '<=', $dates['to']);
        }
    }

    /**
     * Apply sorting
     */
    private function applySorting(Builder $query, array $filters): void
    {
        $sortField = $filters['sort'] ?? 'created_at';
        $sortDirection = $filters['direction'] ?? 'desc';

        if (in_array($sortField, $this->sortableFields)) {
            $query->orderBy($sortField, $sortDirection);
        }
    }
}