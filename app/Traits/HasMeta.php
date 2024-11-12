<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

trait HasMeta
{
    protected array $metaCache = [];

    public function meta(): HasMany
    {
        return $this->hasMany(\App\Models\UserMeta::class);
    }

    public function getMeta(string $key, mixed $default = null): mixed
    {
        if (isset($this->metaCache[$key])) {
            return $this->metaCache[$key];
        }

        $cacheKey = "user_meta_{$this->id}_{$key}";
        $value = Cache::remember(
            $cacheKey,
            now()->addHours(24),
            fn () => $this->meta()->where('meta_key', $key)->value('meta_value')
        );

        $this->metaCache[$key] = $value ?? $default;

        return $this->metaCache[$key];
    }

    public function setMeta(string $key, mixed $value): void
    {
        $this->meta()->updateOrCreate(
            ['meta_key' => $key],
            ['meta_value' => $value]
        );

        $this->clearMetaCache($key);
        $this->metaCache[$key] = $value;
    }

    public function setMultipleMeta(array $data): void
    {
        DB::transaction(function () use ($data) {
            foreach ($data as $key => $value) {
                $this->setMeta($key, $value);
            }
        });
    }

    public function getMetaByPrefix(string $prefix): array
    {
        $cacheKey = "user_meta_{$this->id}_prefix_{$prefix}";
        return Cache::remember(
            $cacheKey,
            now()->addHours(24),
            fn () => $this->meta()
                ->where('meta_key', 'LIKE', "{$prefix}%")
                ->pluck('meta_value', 'meta_key')
                ->toArray()
        );
    }

    public function incrementMeta(string $key, int $amount = 1): int
    {
        $value = (int) $this->getMeta($key, 0) + $amount;
        $this->setMeta($key, $value);
        return $value;
    }

    public function decrementMeta(string $key, int $amount = 1): int
    {
        return $this->incrementMeta($key, -$amount);
    }

    public function toggleMeta(string $key): bool
    {
        $value = !$this->getMeta($key, false);
        $this->setMeta($key, $value);
        return $value;
    }

    public function hasMeta(string $key): bool
    {
        return $this->getMeta($key) !== null;
    }

    public function deleteMeta(string $key): bool
    {
        $deleted = $this->meta()->where('meta_key', $key)->delete();
        $this->clearMetaCache($key);
        unset($this->metaCache[$key]);

        return $deleted > 0;
    }

    public function getAllMeta(): array
    {
        $cacheKey = "user_meta_{$this->id}_all";
        return Cache::remember(
            $cacheKey,
            now()->addHours(24),
            fn () => $this->meta()->pluck('meta_value', 'meta_key')->toArray()
        );
    }

    public function syncMeta(array $meta): void
    {
        DB::transaction(function () use ($meta) {
            $existingKeys = $this->meta()->pluck('meta_key')->toArray();
            $newKeys = array_keys($meta);

            // Delete removed keys
            $keysToDelete = array_diff($existingKeys, $newKeys);
            if (!empty($keysToDelete)) {
                $this->meta()->whereIn('meta_key', $keysToDelete)->delete();
            }

            // Update or create new meta
            foreach ($meta as $key => $value) {
                $this->setMeta($key, $value);
            }

            $this->clearAllMetaCache();
        });
    }

    protected function clearMetaCache(string $key): void
    {
        Cache::forget("user_meta_{$this->id}_{$key}");
        Cache::forget("user_meta_{$this->id}_all");
    }

    protected function clearAllMetaCache(): void
    {
        // Clear all related cache keys
        $keys = [
            "user_meta_{$this->id}_all",
            ...array_map(
                fn($key) => "user_meta_{$this->id}_{$key}",
                array_keys($this->getAllMeta())
            )
        ];

        foreach ($keys as $key) {
            Cache::forget($key);
        }

        $this->metaCache = [];
    }
} 