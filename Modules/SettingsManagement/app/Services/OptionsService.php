<?php

declare(strict_types=1);

namespace Modules\SettingsManagement\Services;

use App\Models\Option;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class OptionsService
{
    private const CACHE_PREFIX = 'options:';
    private const CACHE_TTL = 3600; // 1 hour

    public function get(string $key, mixed $default = null): mixed
    {
        try {
            return Cache::remember(
                $this->getCacheKey($key),
                self::CACHE_TTL,
                fn () => Option::where('key', $key)->first()?->value ?? $default
            );
        } catch (\Exception $e) {
            Log::error('Failed to get option', [
                'key' => $key,
                'error' => $e->getMessage()
            ]);
            return $default;
        }
    }

    public function getGroup(string $group): Collection
    {
        try {
            return Cache::remember(
                $this->getGroupCacheKey($group),
                self::CACHE_TTL,
                function () use ($group) {
                    return Option::where('group', $group)
                        ->get()
                        ->map(function ($option) {
                            return [
                                'id' => $option->id,
                                'key' => $option->key,
                                'value' => $this->parseValue($option->value),
                                'group' => $option->group,
                                'autoload' => $option->autoload,
                            ];
                        });
                }
            );
        } catch (\Exception $e) {
            Log::error('Failed to get option group', [
                'group' => $group,
                'error' => $e->getMessage()
            ]);
            return collect();
        }
    }

    public function getGroupKeyValues(string $group): array
    {
        try {
            $cacheKey = $this->getGroupCacheKey($group) . ':key_values';
            
            return Cache::remember(
                $cacheKey,
                self::CACHE_TTL,
                function () use ($group) {
                    $options = Option::where('group', $group)->get();
                    
                    return $options->mapWithKeys(function ($option) {
                        return [$option->key => $this->parseValue($option->value)];
                    })->toArray();
                }
            );
        } catch (\Exception $e) {
            Log::error('Failed to get group key values', [
                'group' => $group,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    public function set(string $key, mixed $value, string $group = 'general', bool $autoload = false): void
    {
        try {
            DB::transaction(function () use ($key, $value, $group, $autoload) {
                Option::updateOrCreate(
                    ['key' => $key],
                    [
                        'value' => $this->prepareValue($value),
                        'group' => $group,
                        'autoload' => $autoload,
                    ]
                );
                
                $this->clearCaches($key, $group);
            });
        } catch (\Exception $e) {
            Log::error('Failed to set option', [
                'key' => $key,
                'group' => $group,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function setMany(array $options, string $group = 'general'): void
    {
        try {
            DB::transaction(function () use ($options, $group) {
                foreach ($options as $key => $value) {
                    Option::updateOrCreate(
                        ['key' => $key],
                        [
                            'value' => $this->prepareValue($value),
                            'group' => $group,
                        ]
                    );
                }
                
                $this->clearGroupCache($group);
            });
        } catch (\Exception $e) {
            Log::error('Failed to set multiple options', [
                'group' => $group,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    private function parseValue(mixed $value): mixed
    {
        if (is_string($value)) {
            try {
                $decoded = json_decode($value, true);
                return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
            } catch (\Exception $e) {
                return $value;
            }
        }
        return $value;
    }

    private function prepareValue(mixed $value): string
    {
        return is_array($value) || is_object($value) 
            ? json_encode($value) 
            : (string) $value;
    }

    private function getCacheKey(string $key): string
    {
        return self::CACHE_PREFIX . "key:{$key}";
    }

    private function getGroupCacheKey(string $group): string
    {
        return self::CACHE_PREFIX . "group:{$group}";
    }

    private function clearCaches(string $key, string $group): void
    {
        Cache::forget($this->getCacheKey($key));
        $this->clearGroupCache($group);
    }

    private function clearGroupCache(string $group): void
    {
        Cache::forget($this->getGroupCacheKey($group));
        Cache::forget($this->getGroupCacheKey($group) . ':key_values');
    }

    public function flushCache(): void
    {
        Cache::flush();
    }
} 