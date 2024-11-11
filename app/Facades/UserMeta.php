<?php

declare(strict_types=1);

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static mixed get(int $userId, string $key, mixed $default = null)
 * @method static void set(int $userId, string $key, mixed $value)
 * @method static bool delete(int $userId, string $key)
 * @method static array all(int $userId)
 * @method static void sync(int $userId, array $meta)
 */
final class UserMeta extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return 'user-meta';
    }
} 