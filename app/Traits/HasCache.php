<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait HasCache
{
    protected function getCacheKey(string $key): string
    {
        return sprintf(
            '%s:%s:%s',
            $this->getCachePrefix(),
            $this->getTable(),
            $key
        );
    }

    protected function rememberCache(string $key, \Closure $callback, ?int $ttl = null): mixed
    {
        if (!config('cache.enabled', true)) {
            return $callback();
        }

        return Cache::remember(
            $this->getCacheKey($key),
            $ttl ?? $this->getCacheTTL(),
            $callback
        );
    }

    protected function forgetCache(string $key): void
    {
        Cache::forget($this->getCacheKey($key));
    }

    protected function flushCache(): void
    {
        $pattern = $this->getCacheKey('*');
        Cache::delete($pattern);
    }

    protected function getCachePrefix(): string
    {
        return config('cache.prefix', 'app');
    }

    protected function getCacheTTL(): int
    {
        return config('cache.ttl', 3600);
    }
} 