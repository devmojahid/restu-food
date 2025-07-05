<?php

use App\Support\Facades\Module;
use Inertia\Inertia;

if (!function_exists('inertia_module')) {
    /**
     * Return an Inertia response for a module page.
     *
     * @param string $page
     * @param array $props
     * @return \Inertia\Response
     */
    function inertia_module(string $page, array $props = [])
    {
        return Inertia::module($page, $props);
    }
} 