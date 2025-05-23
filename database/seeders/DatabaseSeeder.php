<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(100)->create();
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
        ]);


        $this->call([
            // ... other seeders
            // BlogSeeder::class,
            RolePermissionSeeder::class,
            // CategoryPermissionSeeder::class,
            ProductAttributeSeeder::class,
            CategorySeeder::class,
            CurrencySeeder::class,
            ReviewSeeder::class,
            RestaurantSeeder::class,
            MenuCategorySeeder::class,
        ]);
    }
}
