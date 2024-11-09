<?php

declare(strict_types=1);

use App\Facades\Options;

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