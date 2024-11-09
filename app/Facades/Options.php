<?php

declare(strict_types=1);

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static mixed get(string $key, mixed $default = null)
 * @method static void set(string $key, mixed $value, string $group = 'general', bool $autoload = false)
 * @method static bool delete(string $key)
 * @method static \Illuminate\Support\Collection getGroup(string $group)
 * @method static void setMany(array $options, string $group = 'general')
 * @method static \Illuminate\Support\Collection getAutoloadOptions()
 * @method static void flushCache()
 */
final class Options extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'options';
    }
} 