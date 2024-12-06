<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

trait HasZoneCache
{
    protected function rememberZoneCache($key, $ttl, $callback)
    {
        if (!config('zones.cache.enabled')) {
            return $callback();
        }

        try {
            return Cache::remember($key, $ttl, $callback);
        } catch (\Exception $e) {
            Log::warning("Zone cache operation failed: {$e->getMessage()}");
            return $callback();
        }
    }

    protected function clearZoneCaches()
    {
        try {
            $keys = [
                'zones.all',
                'zones.active',
                'zones.stats',
            ];

            foreach ($keys as $key) {
                Cache::forget($key);
            }

            // Clear paginated caches
            $pages = range(1, 10); // Adjust range as needed
            foreach ($pages as $page) {
                Cache::forget("zones.paginated.{$page}");
            }
        } catch (\Exception $e) {
            Log::warning("Failed to clear zone caches: {$e->getMessage()}");
        }
    }
} 