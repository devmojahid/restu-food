<?php

namespace App\Support\Facades;

use App\Support\InertiaModules;
use Illuminate\Support\Facades\Facade;

/**
 * @method static \Inertia\Response module(string $page, array $props = [])
 *
 * @see \App\Support\InertiaModules
 */
class Module extends Facade
{
    protected static function getFacadeAccessor()
    {
        return InertiaModules::class;
    }
} 