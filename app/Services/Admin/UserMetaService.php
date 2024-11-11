<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Cache;

final class UserMetaService
{
    public function get(int $userId, string $key, mixed $default = null): mixed
    {
        return User::findOrFail($userId)->getMeta($key, $default);
    }

    public function set(int $userId, string $key, mixed $value): void
    {
        User::findOrFail($userId)->setMeta($key, $value);
    }

    public function delete(int $userId, string $key): bool
    {
        return User::findOrFail($userId)->deleteMeta($key);
    }

    public function all(int $userId): array
    {
        return User::findOrFail($userId)->getAllMeta();
    }

    public function sync(int $userId, array $meta): void
    {
        User::findOrFail($userId)->syncMeta($meta);
    }

    public function clearCache(int $userId): void
    {
        Cache::tags(['user_meta', "user_{$userId}"])->flush();
    }
} 