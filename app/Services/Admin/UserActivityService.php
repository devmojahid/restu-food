<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Collection;

final class UserActivityService
{
    private const CACHE_TTL = 3600; // 1 hour

    public function getActivityLog(User $user, int $limit = 10): Collection
    {
        return Cache::tags(['user_activity', "user_{$user->id}"])
            ->remember(
                "user_{$user->id}_activity_log",
                self::CACHE_TTL,
                fn () => collect(get_user_activity_log($user->id, $limit))
            );
    }

    public function getRecentActivity(User $user): Collection
    {
        return $this->getActivityLog($user, 5);
    }

    public function clearActivityCache(int $userId): void
    {
        Cache::tags(['user_activity', "user_{$userId}"])->flush();
    }

    public function getLoginHistory(User $user): Collection
    {
        return collect($user->getMeta('login_attempts', []));
    }

    public function getLastLoginInfo(User $user): array
    {
        return [
            'timestamp' => $user->getMeta('last_login_at'),
            'ip' => $user->getMeta('last_login_ip'),
            'user_agent' => $user->getMeta('last_login_user_agent'),
        ];
    }

    public function recordLoginAttempt(User $user, bool $success): void
    {
        $user->recordLoginAttempt($success, request()->ip());
        $this->clearActivityCache($user->id);
    }

    public function getActiveDevices(User $user): Collection
    {
        return collect($user->getMeta('active_devices', []));
    }

    public function addActiveDevice(User $user, array $deviceInfo): void
    {
        $devices = $this->getActiveDevices($user);
        $devices->push($deviceInfo);
        $user->setMeta('active_devices', $devices->unique('device_id')->values()->toArray());
    }

    public function removeActiveDevice(User $user, string $deviceId): void
    {
        $devices = $this->getActiveDevices($user);
        $devices = $devices->reject(fn ($device) => $device['device_id'] === $deviceId);
        $user->setMeta('active_devices', $devices->values()->toArray());
    }
} 