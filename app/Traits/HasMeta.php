<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

        $value = Cache::tags(['user_meta', "user_{$this->id}"])->remember(
            "user_{$this->id}_meta_{$key}",
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

    public function deleteMeta(string $key): bool
    {
        $deleted = $this->meta()->where('meta_key', $key)->delete();
        $this->clearMetaCache($key);
        unset($this->metaCache[$key]);

        return $deleted > 0;
    }

    public function getAllMeta(): array
    {
        return Cache::tags(['user_meta', "user_{$this->id}"])->remember(
            "user_{$this->id}_all_meta",
            now()->addHours(24),
            fn () => $this->meta()->pluck('meta_value', 'meta_key')->toArray()
        );
    }

    public function syncMeta(array $meta): void
    {
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
    }

    protected function clearMetaCache(string $key): void
    {
        Cache::tags(['user_meta', "user_{$this->id}"])->forget("user_{$this->id}_meta_{$key}");
        Cache::tags(['user_meta', "user_{$this->id}"])->forget("user_{$this->id}_all_meta");
    }

    protected function clearAllMetaCache(): void
    {
        Cache::tags(['user_meta', "user_{$this->id}"])->flush();
        $this->metaCache = [];
    }
} 