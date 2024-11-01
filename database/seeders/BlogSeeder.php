<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        // Create storage directory for blog images if it doesn't exist
        Storage::makeDirectory('public/blogs');

        // Create some users if none exist
        if (User::count() === 0) {
            User::factory(5)->create();
        }

        // Create 100 blog posts
        Blog::factory(10)->create();
    }
}
