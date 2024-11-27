<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuCategory;
use Illuminate\Support\Str;

class MenuCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Appetizers',
                'description' => 'Start your meal with these delicious appetizers',
                'order' => 1,
            ],
            [
                'name' => 'Main Course',
                'description' => 'Our signature main dishes',
                'order' => 2,
            ],
            [
                'name' => 'Desserts',
                'description' => 'Sweet treats to end your meal',
                'order' => 3,
            ],
            [
                'name' => 'Beverages',
                'description' => 'Refreshing drinks and beverages',
                'order' => 4,
            ],
        ];

        // Get all restaurants
        $restaurants = \App\Models\Restaurant::all();

        foreach ($restaurants as $restaurant) {
            foreach ($categories as $category) {
                MenuCategory::create([
                    'restaurant_id' => $restaurant->id,
                    'name' => $category['name'],
                    'slug' => Str::slug($category['name']),
                    'description' => $category['description'],
                    'is_active' => true,
                    'order' => $category['order'],
                ]);
            }
        }
    }
} 