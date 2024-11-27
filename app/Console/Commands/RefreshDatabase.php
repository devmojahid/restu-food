<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;

final class RefreshDatabase extends Command
{
    protected $signature = 'app:refresh-database';
    protected $description = 'Refresh and seed the database';

    public function handle(): void
    {
        $this->info('Refreshing database...');

        // Drop all tables and re-run all migrations
        $this->call('migrate:fresh');

        // Run specific migrations in order
        $this->info('Running specific migrations...');
        $this->call('migrate', [
            '--path' => 'database/migrations/2024_03_21_000002_create_menu_categories_table.php'
        ]);
        $this->call('migrate', [
            '--path' => 'database/migrations/2024_03_21_000001_create_menu_items_table.php'
        ]);
        $this->call('migrate', [
            '--path' => 'database/migrations/2024_03_21_000003_create_delivery_zones_table.php'
        ]);

        // Seed the database
        $this->info('Seeding database...');
        $this->call('db:seed');

        $this->info('Database refresh completed successfully!');
    }
} 