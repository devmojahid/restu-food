<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\MenuItem;
use App\Models\MenuCategory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

trait HasMenu
{
    public function menuCategories(): HasMany
    {
        return $this->hasMany(MenuCategory::class)->orderBy('order');
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('order');
    }

    public function getActiveMenuCategories(): Collection
    {
        return $this->menuCategories()
            ->where('is_active', true)
            ->with(['items' => function ($query) {
                $query->where('is_available', true)
                    ->orderBy('order');
            }])
            ->get();
    }

    public function getFeaturedItems(): Collection
    {
        return $this->menuItems()
            ->where('is_featured', true)
            ->where('is_available', true)
            ->orderBy('order')
            ->get();
    }

    public function syncMenuOrder(array $categories): void
    {
        foreach ($categories as $index => $categoryId) {
            $this->menuCategories()
                ->where('id', $categoryId)
                ->update(['order' => $index]);
        }
    }

    public function syncItemOrder(array $items): void
    {
        foreach ($items as $index => $itemId) {
            $this->menuItems()
                ->where('id', $itemId)
                ->update(['order' => $index]);
        }
    }
} 