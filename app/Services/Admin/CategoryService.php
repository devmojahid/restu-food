<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

final class CategoryService
{
    public function getCategoriesByType(string $type): Collection
    {
        $cacheKey = "categories.{$type}";

        return Cache::tags(['categories'])->remember(
            $cacheKey,
            now()->addHours(24),
            fn() => Category::ofType($type)
                ->active()
                ->with('children')
                ->root()
                ->orderBy('sort_order')
                ->get()
        );
    }

    public function createCategory(array $data): Category
    {
        return DB::transaction(function () use ($data) {
            $category = Category::create($data);

            if (isset($data['image'])) {
                // Handle image upload
                $this->handleImageUpload($category, $data['image']);
            }

            $this->clearCategoryCache();

            return $category;
        });
    }

    public function updateCategory(Category $category, array $data): Category
    {
        return DB::transaction(function () use ($category, $data) {
            // Check if we're updating parent_id
            $oldPath = $category->path;

            $category->update($data);

            // If parent changed, update all children paths
            if ($category->path !== $oldPath) {
                $this->updateChildrenPaths($category);
            }

            if (isset($data['image'])) {
                $this->handleImageUpload($category, $data['image']);
            }

            $this->clearCategoryCache();

            return $category;
        });
    }

    public function deleteCategory(Category $category): void
    {
        DB::transaction(function () use ($category) {
            // Optional: Move children to parent category
            if ($category->parent_id) {
                $category->children()->update(['parent_id' => $category->parent_id]);
            }

            $category->delete();
            $this->clearCategoryCache();
        });
    }

    public function reorderCategories(array $orderedIds): void
    {
        DB::transaction(function () use ($orderedIds) {
            foreach ($orderedIds as $order => $id) {
                Category::where('id', $id)->update(['sort_order' => $order]);
            }
            $this->clearCategoryCache();
        });
    }

    private function updateChildrenPaths(Category $category): void
    {
        $children = $category->getAllChildren();

        foreach ($children as $child) {
            $child->updatePathAndLevel();
            $child->save();
        }
    }

    private function handleImageUpload(Category $category, $image): void
    {
        // Implement image upload logic
    }

    private function clearCategoryCache(): void
    {
        Cache::tags(['categories'])->flush();
    }
}