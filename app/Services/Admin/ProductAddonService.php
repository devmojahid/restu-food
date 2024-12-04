<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\ProductAddon;
use App\Models\ProductAddonCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

final class ProductAddonService
{
    public function store(array $data): ProductAddon
    {
        return DB::transaction(function () use ($data) {
            // Create the addon
            $addon = ProductAddon::create([
                ...$data,
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'stock_status' => ($data['stock_quantity'] ?? 0) > 0 ? 'in_stock' : 'out_of_stock',
            ]);

            // Handle file uploads if present
            if (!empty($data['thumbnail'])) {
                if (isset($data['thumbnail']['uuid'])) {
                    $addon->attachFile($data['thumbnail'], ProductAddon::COLLECTION_THUMBNAIL);
                } else {
                    $addon->handleFile($data['thumbnail'], ProductAddon::COLLECTION_THUMBNAIL);
                }
            }

            // Assign to categories if specified
            if (!empty($data['categories'])) {
                $categoryData = collect($data['categories'])->mapWithKeys(function ($categoryId, $index) {
                    return [$categoryId => ['sort_order' => $index]];
                })->all();
                
                $addon->categories()->attach($categoryData);
            }

            return $addon->fresh(['categories']);
        });
    }

    public function update(ProductAddon $addon, array $data): ProductAddon
    {
        return DB::transaction(function () use ($addon, $data) {
            // Update basic addon info
            $addon->update([
                ...$data,
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'stock_status' => ($data['stock_quantity'] ?? $addon->stock_quantity) > 0 ? 'in_stock' : 'out_of_stock',
            ]);

            // Handle file updates
            if (array_key_exists('thumbnail', $data)) {
                if (empty($data['thumbnail'])) {
                    $addon->clearFiles(ProductAddon::COLLECTION_THUMBNAIL);
                } elseif (isset($data['thumbnail']['uuid'])) {
                    $addon->attachFile($data['thumbnail'], ProductAddon::COLLECTION_THUMBNAIL);
                } else {
                    $addon->handleFile($data['thumbnail'], ProductAddon::COLLECTION_THUMBNAIL);
                }
            }

            // Update category assignments
            if (isset($data['categories'])) {
                $categoryData = collect($data['categories'])->mapWithKeys(function ($categoryId, $index) {
                    return [$categoryId => ['sort_order' => $index]];
                })->all();
                
                $addon->categories()->sync($categoryData);
            }

            return $addon->fresh(['categories']);
        });
    }

    public function createCategory(array $data): ProductAddonCategory
    {
        return DB::transaction(function () use ($data) {
            $category = ProductAddonCategory::create([
                ...$data,
                'slug' => $data['slug'] ?? Str::slug($data['name']),
            ]);

            if (!empty($data['addons'])) {
                $addonData = collect($data['addons'])->mapWithKeys(function ($addonId, $index) {
                    return [$addonId => ['sort_order' => $index]];
                })->all();
                
                $category->addons()->attach($addonData);
            }

            return $category->fresh(['addons']);
        });
    }

    public function updateCategory(ProductAddonCategory $category, array $data): ProductAddonCategory
    {
        return DB::transaction(function () use ($category, $data) {
            $category->update([
                ...$data,
                'slug' => $data['slug'] ?? Str::slug($data['name']),
            ]);

            if (isset($data['addons'])) {
                $addonData = collect($data['addons'])->mapWithKeys(function ($addonId, $index) {
                    return [$addonId => ['sort_order' => $index]];
                })->all();
                
                $category->addons()->sync($addonData);
            }

            return $category->fresh(['addons']);
        });
    }

    public function bulkUpdateStatus(array $ids, bool $status): void
    {
        ProductAddon::whereIn('id', $ids)->update(['is_active' => $status]);
    }

    public function bulkDelete(array $ids): void
    {
        ProductAddon::whereIn('id', $ids)->delete();
    }

    public function updateCategoryOrder(array $categories): void
    {
        DB::transaction(function () use ($categories) {
            foreach ($categories as $index => $categoryId) {
                ProductAddonCategory::where('id', $categoryId)
                    ->update(['sort_order' => $index]);
            }
        });
    }

    public function updateAddonOrder(int $categoryId, array $addons): void
    {
        DB::transaction(function () use ($categoryId, $addons) {
            foreach ($addons as $index => $addonId) {
                DB::table('product_addon_category_items')
                    ->where('category_id', $categoryId)
                    ->where('addon_id', $addonId)
                    ->update(['sort_order' => $index]);
            }
        });
    }
} 