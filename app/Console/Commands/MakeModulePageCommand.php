<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModulePageCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'module:make-page 
                            {name : The name of the page}
                            {module : The name of the module}
                            {--force : Force overwrite if page already exists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new Inertia page for a module';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $module = $this->argument('module');
        $force = $this->option('force');

        // Check if module exists
        $modulePath = base_path("Modules/{$module}");
        if (!File::isDirectory($modulePath)) {
            $this->error("Module [{$module}] does not exist!");
            return 1;
        }

        // Create pages directory if it doesn't exist
        $pagesPath = "{$modulePath}/resources/Pages";
        if (!File::isDirectory($pagesPath)) {
            File::makeDirectory($pagesPath, 0755, true);
            $this->info("Pages directory created successfully.");
        }

        // Create the page file
        $pageName = Str::studly($name);
        $pagePath = "{$pagesPath}/{$pageName}.tsx";

        if (File::exists($pagePath) && !$force) {
            $this->error("Page [{$pageName}] already exists in module [{$module}]!");
            return 1;
        }

        $content = <<<TSX
import React from 'react';
import { Link } from '@inertiajs/react';

export default function {$pageName}() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{$pageName}</h1>
      </div>
      
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <p className="text-gray-700">Content for {$pageName} page.</p>
      </div>
    </div>
  );
}
TSX;

        File::put($pagePath, $content);
        $this->info("Page [{$pageName}] created successfully in module [{$module}].");

        return 0;
    }
} 