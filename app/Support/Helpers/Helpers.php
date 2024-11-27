<?php

declare(strict_types=1);

use App\Facades\Options;
use App\Models\User;
use App\Facades\UserMeta;

if (!function_exists('get_option')) {
    function get_option(string $key, mixed $default = null): mixed
    {
        return Options::get($key, $default);
    }
}

if (!function_exists('set_option')) {
    function set_option(string $key, mixed $value, string $group = 'general', bool $autoload = false): void
    {
        Options::set($key, $value, $group, $autoload);
    }
}

if (!function_exists('delete_option')) {
    function delete_option(string $key): bool
    {
        return Options::delete($key);
    }
}

if (!function_exists('get_options_group')) {
    function get_options_group(string $group): array
    {
        return Options::getGroup($group)->pluck('value', 'key')->toArray();
    }
}

if (!function_exists('get_multiple_options')) {
    function get_multiple_options(array $keys): array
    {
        return Options::getMultiple($keys)->pluck('value', 'key')->toArray();
    }
}

/**
 * Start User Helpers
 */
if (!function_exists('get_user_meta')) {
    function get_user_meta(int $userId, string $key, mixed $default = null): mixed
    {
        return UserMeta::get($userId, $key, $default);
    }
}

if (!function_exists('set_user_meta')) {
    function set_user_meta(int $userId, string $key, mixed $value): void
    {
        UserMeta::set($userId, $key, $value);
    }
}

if (!function_exists('delete_user_meta')) {
    function delete_user_meta(int $userId, string $key): bool
    {
        return UserMeta::delete($userId, $key);
    }
}

if (!function_exists('get_user_avatar_url')) {
    function get_user_avatar_url(?User $user = null): ?string
    {
        if (!$user && auth()->check()) {
            $user = auth()->user();
        }
        
        if (!$user) return null;
        
        $avatar = $user->getFile('avatar');
        return $avatar ? $avatar->url : null;
    }
}

if (!function_exists('get_user_display_name')) {
    function get_user_display_name(?User $user = null): string
    {
        if (!$user && auth()->check()) {
            $user = auth()->user();
        }
        
        return $user ? $user->getMeta('display_name', $user->name) : '';
    }
}

if (!function_exists('get_user_roles')) {
    function get_user_roles(?User $user = null): array
    {
        if (!$user && auth()->check()) {
            $user = auth()->user();
        }
        
        return $user ? $user->roles->pluck('name')->toArray() : [];
    }
}

if (!function_exists('has_user_role')) {
    function has_user_role(string $role, ?User $user = null): bool
    {
        if (!$user && auth()->check()) {
            $user = auth()->user();
        }
        
        return $user ? $user->hasRole($role) : false;
    }
}

if (!function_exists('get_user_permissions')) {
    function get_user_permissions(?User $user = null): array
    {
        if (!$user && auth()->check()) {
            $user = auth()->user();
        }
        
        return $user ? $user->getAllPermissions()->pluck('name')->toArray() : [];
    }
}

if (!function_exists('has_user_permission')) {
    function has_user_permission(string $permission, ?User $user = null): bool
    {
        if (!$user && auth()->check()) {
            $user = auth()->user();
        }
        
        return $user ? $user->hasPermissionTo($permission) : false;
    }
}

if (!function_exists('get_user_activity_log')) {
    function get_user_activity_log(int $userId, int $limit = 10): array
    {
        return UserMeta::get($userId, 'activity_log', []);
    }
}

if (!function_exists('log_user_activity')) {
    function log_user_activity(int $userId, string $action, array $data = []): void
    {
        $log = get_user_activity_log($userId);
        
        array_unshift($log, [
            'action' => $action,
            'data' => $data,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now()->toDateTimeString(),
        ]);
        
        // Keep only last 100 activities
        $log = array_slice($log, 0, 100);
        
        set_user_meta($userId, 'activity_log', $log);
    }
}

if (!function_exists('currency')) {
    function currency($amount): string
    {
        return '$' . number_format($amount, 2);
    }
}

if (!function_exists('currency')) {
    function currency($amount, $currency = 'USD', $decimals = 2): string
    {
        $formatter = new NumberFormatter(app()->getLocale(), NumberFormatter::CURRENCY);
        $formatter->setAttribute(NumberFormatter::FRACTION_DIGITS, $decimals);
        return $formatter->formatCurrency($amount, $currency);
    }
}