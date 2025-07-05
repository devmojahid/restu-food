<?php

namespace App\Support;

use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class InertiaModules
{
    /**
     * Register the Inertia module macro.
     */
    public static function registerMacros(): void
    {
        // Add module() method directly to Inertia facade
        if (!Inertia::hasMacro('module')) {
            Inertia::macro('module', function (string $page, array $props = []): Response {
                // Parse module name and page path
                [$moduleName, $pagePath] = explode('::', $page, 2);

                // Share module information
                Inertia::share('modules', function () use ($moduleName) {
                    return [
                        $moduleName => true,
                    ];
                });

                // Return Inertia response with module page
                return Inertia::render("Modules/{$moduleName}/{$pagePath}", $props);
            });
        }
    }

    /**
     * Render a module page with Inertia.
     *
     * @param string $page The module page in format "ModuleName::PagePath"
     * @param array $props The props to pass to the page
     * @return Response
     * 
     * @deprecated Use Inertia::module() instead
     */
    public static function module(string $page, array $props = []): Response
    {
        // Parse module name and page path
        [$moduleName, $pagePath] = explode('::', $page, 2);

        // Register the module's page into Inertia so it can be resolved
        static::registerModule($moduleName);

        // Return Inertia response with module page
        return Inertia::render("Modules/{$moduleName}/{$pagePath}", $props);
    }

    /**
     * Register a module's pages with Inertia.
     *
     * @param string $moduleName
     * @return void
     */
    protected static function registerModule(string $moduleName): void
    {
        // Add the module's JavaScript directory to the Inertia resolver
        // This happens at runtime, so no need to modify the vite.config.ts
        Inertia::share('modules', function () use ($moduleName) {
            return [
                $moduleName => true,
            ];
        });
    }
} 