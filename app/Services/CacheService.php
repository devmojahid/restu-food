<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

final class CacheService
{
    private string $prefix;
    private int $ttl;

    public function __construct(string $prefix, int $ttl = 3600)
    {
        $this->prefix = $prefix;
        $this->ttl = $ttl;
    }

    public function remember(string $key, \Closure $callback)
    {
        $cacheKey = $this->getCacheKey($key);
        
        try {
            return Cache::remember($cacheKey, $this->ttl, $callback);
        } catch (\Exception $e) {
            Log::error("Cache error for key {$cacheKey}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $callback();
        }
    }

    public function forget(string $key): void
    {
        Cache::forget($this->getCacheKey($key));
    }

    public function flush(array $patterns = ['*']): void
    {
        foreach ($patterns as $pattern) {
            $key = $this->getCacheKey($pattern);
            Cache::delete($key);
        }
    }

    private function getCacheKey(string $key): string
    {
        return "{$this->prefix}:{$key}";
    }
} 