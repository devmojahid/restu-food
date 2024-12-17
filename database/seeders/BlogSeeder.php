<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        // Create sample categories
        $categories = [
            'Recipes' => 'recipes',
            'Cooking Tips' => 'cooking-tips',
            'Restaurant Reviews' => 'restaurant-reviews',
            'Food Culture' => 'food-culture',
            'Health & Nutrition' => 'health-nutrition'
        ];

        foreach ($categories as $name => $slug) {
            Category::create([
                'name' => $name,
                'slug' => $slug
            ]);
        }

        // Create sample tags
        $tags = [
            'Healthy' => 'healthy',
            'Quick & Easy' => 'quick-easy',
            'Vegetarian' => 'vegetarian',
            'Desserts' => 'desserts',
            'Traditional' => 'traditional'
        ];

        foreach ($tags as $name => $slug) {
            Tag::create([
                'name' => $name,
                'slug' => $slug
            ]);
        }

        // Create sample blogs
        $categories = Category::all();
        $tags = Tag::all();
        $authors = User::all();

        for ($i = 1; $i <= 20; $i++) {
            $title = "How to Make Perfect Dish {$i}";
            $blog = Blog::create([
                'title' => $title,
                'slug' => Str::slug($title),
                'excerpt' => "Discover the secrets to creating the most delicious dish {$i}...",
                'content' => $this->generateContent($i),
                'featured_image' => "/images/blogs/blog-{$i}.jpg",
                'image_caption' => "A delicious dish {$i} prepared by our chef",
                'reading_time' => rand(5, 15),
                'views' => rand(100, 1000),
                'published_at' => now()->subDays(rand(1, 30)),
                'meta_title' => $title,
                'meta_description' => "Learn how to cook the perfect dish {$i} with our step-by-step guide.",
                'meta_keywords' => 'cooking, recipe, food, cuisine',
                'author_id' => $authors->random()->id,
                'category_id' => $categories->random()->id,
                'status' => 'published'
            ]);

            // Attach random tags
            $blog->tags()->attach(
                $tags->random(rand(2, 4))->pluck('id')->toArray()
            );
        }
    }

    private function generateContent($i): string
    {
        return <<<HTML
            <h2>Introduction</h2>
            <p>Welcome to our guide on making the perfect dish {$i}...</p>
            
            <h2>Ingredients</h2>
            <ul>
                <li>2 cups ingredient A</li>
                <li>1 cup ingredient B</li>
                <li>3 pieces of ingredient C</li>
            </ul>
            
            <h2>Instructions</h2>
            <ol>
                <li>Step 1: Prepare the ingredients</li>
                <li>Step 2: Mix everything together</li>
                <li>Step 3: Cook for 30 minutes</li>
            </ol>
            
            <h2>Tips and Tricks</h2>
            <p>Here are some professional tips for making dish {$i} perfect every time...</p>
        HTML;
    }
}
