<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Option;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class OptionsService
{
    private const CACHE_PREFIX = 'options:';
    private const CACHE_TTL = 3600; // 1 hour

    public function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember(
            self::CACHE_PREFIX . $key,
            self::CACHE_TTL,
            fn () => Option::where('key', $key)->value('value') ?? $default
        );
    }

    public function set(string $key, mixed $value, string $group = 'general', bool $autoload = false): void
    {
        DB::transaction(function () use ($key, $value, $group, $autoload) {
            Option::updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'group' => $group,
                    'autoload' => $autoload,
                ]
            );
            
            $this->forgetCache($key);
        });
    }

    public function delete(string $key): bool
    {
        $deleted = Option::where('key', $key)->delete();
        $this->forgetCache($key);
        
        return $deleted > 0;
    }

    public function getGroup(string $group): Collection
    {
        return Cache::remember(
            self::CACHE_PREFIX . "group:{$group}",
            self::CACHE_TTL,
            fn () => Option::where('group', $group)->get()
        );
    }

    public function setMany(array $options, string $group = 'general'): void
    {
        DB::transaction(function () use ($options, $group) {
            foreach ($options as $key => $value) {
                $this->set($key, $value, $group);
            }
        });
    }

    public function getAutoloadOptions(): Collection
    {
        return Cache::remember(
            self::CACHE_PREFIX . 'autoload',
            self::CACHE_TTL,
            fn () => Option::where('autoload', true)->get()
        );
    }

    private function forgetCache(string $key): void
    {
        Cache::forget(self::CACHE_PREFIX . $key);
    }

    public function flushCache(): void
    {
        Cache::tags([self::CACHE_PREFIX])->flush();
    }
} 