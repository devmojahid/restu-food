<?php

declare(strict_types=1);

namespace App\Traits;

trait TracksUserActivity
{
    public function recordLoginAttempt(bool $success, ?string $ip = null): void
    {
        $loginHistory = $this->getMeta('login_history', []);
        array_unshift($loginHistory, [
            'timestamp' => now()->toDateTimeString(),
            'ip' => $ip ?? request()->ip(),
            'user_agent' => request()->userAgent(),
            'success' => $success
        ]);

        $loginHistory = array_slice($loginHistory, 0, 50);
        
        $this->setMultipleMeta([
            'login_history' => $loginHistory,
            'login_count' => ($this->getMeta('login_count', 0) + 1),
            'last_login_at' => $success ? now() : $this->getMeta('last_login_at'),
            'last_login_ip' => $success ? ($ip ?? request()->ip()) : $this->getMeta('last_login_ip')
        ]);
    }

    public function updateLastActivity(): void
    {
        $this->setMeta('last_activity', now());
    }

    public function isOnline(): bool
    {
        $lastActivity = $this->getMeta('last_activity');
        return $lastActivity && now()->diffInMinutes($lastActivity) < 5;
    }
} 