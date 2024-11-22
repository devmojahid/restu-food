<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Product categories
            ['name' => 'Food', 'slug' => 'food', 'parent_id' => null, 'type' => 'product', 'sort_order' => 1, 'is_active' => true],
            ['name' => 'Clothing', 'slug' => 'clothing', 'parent_id' => null, 'type' => 'product', 'sort_order' => 2, 'is_active' => true],
            ['name' => 'Electronics', 'slug' => 'electronics', 'parent_id' => null, 'type' => 'product', 'sort_order' => 3, 'is_active' => true],
            ['name' => 'Books', 'slug' => 'books', 'parent_id' => 1, 'type' => 'product', 'sort_order' => 4, 'is_active' => true],
            ['name' => 'Drink', 'slug' => 'drink', 'parent_id' => 2, 'type' => 'product', 'sort_order' => 5, 'is_active' => true],

            // Blog categories
            ['name' => 'News', 'slug' => 'news', 'parent_id' => null, 'type' => 'blog', 'sort_order' => 1, 'is_active' => true],
            ['name' => 'Tutorials', 'slug' => 'tutorials', 'parent_id' => null, 'type' => 'blog', 'sort_order' => 2, 'is_active' => true],
            ['name' => 'Tips', 'slug' => 'tips', 'parent_id' => null, 'type' => 'blog', 'sort_order' => 3, 'is_active' => true],
            ['name' => 'Events', 'slug' => 'events', 'parent_id' => null, 'type' => 'blog', 'sort_order' => 4, 'is_active' => true],
            ['name' => 'Interviews', 'slug' => 'interviews', 'parent_id' => null, 'type' => 'blog', 'sort_order' => 5, 'is_active' => true],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
