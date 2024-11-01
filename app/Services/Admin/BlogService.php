<?php

namespace App\Services\Admin;

use App\Models\Blog;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final class BlogService
{
    protected $blogRepository;
    protected $cachePrefix = 'blogs:';
    protected $cacheDuration = 30; // minutes

    public function getAllPaginated(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $cacheKey = $this->getCacheKey($filters, $perPage);

        return Cache::remember(
            $cacheKey,
            now()->addMinutes($this->cacheDuration),
            fn() => $this->blogRepository->getAllPaginated($filters, $perPage)
        );
    }

    public function find(int $id): ?Blog
    {
        $cacheKey = "{$this->cachePrefix}single:{$id}";

        return Cache::remember(
            $cacheKey,
            now()->addMinutes($this->cacheDuration),
            fn() => $this->blogRepository->find($id)
        );
    }

    public function create(array $data): Blog
    {
        $blog = $this->blogRepository->create($data);
        $this->clearCache();
        return $blog;
    }

    public function update(int $id, array $data): bool
    {
        $result = $this->blogRepository->update($id, $data);
        $this->clearCache();
        return $result;
    }

    public function delete(int $id): bool
    {
        $result = $this->blogRepository->delete($id);
        $this->clearCache();
        return $result;
    }

    public function toggleStatus(int $id): bool
    {
        $result = $this->blogRepository->toggleStatus($id);
        $this->clearCache();
        return $result;
    }

    public function bulkDelete(array $ids): bool
    {
        $result = $this->blogRepository->bulkDelete($ids);
        $this->clearCache();
        return $result;
    }

    public function handleFiltering(array $params): array
    {
        try {
            $blogs = $this->getAllPaginated(
                [
                    'search' => $params['search'] ?? null,
                    'filters' => $params['filters'] ?? [],
                    'sort' => $params['sort'] ?? null,
                    'direction' => $params['direction'] ?? null,
                ],
                $params['perPage'] ?? 10
            );

            return [
                'blogs' => $blogs,
                'filters' => $params
            ];
        } catch (\Exception $e) {
            Log::error('Blog filtering failed: ' . $e->getMessage());
            throw $e;
        }
    }

    protected function getCacheKey(array $filters, int $perPage): string
    {
        $filterKey = md5(serialize($filters) . $perPage);
        return "{$this->cachePrefix}list:{$filterKey}";
    }

    protected function clearCache(): void
    {
        // Clear all blog-related cache
        $keys = Cache::get("{$this->cachePrefix}keys", []);
        foreach ($keys as $key) {
            Cache::forget($key);
        }
        Cache::forget("{$this->cachePrefix}keys");
    }

    protected function rememberCacheKey(string $key): void
    {
        $keys = Cache::get("{$this->cachePrefix}keys", []);
        $keys[] = $key;
        Cache::put("{$this->cachePrefix}keys", array_unique($keys), now()->addDays(1));
    }
}
