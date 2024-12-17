<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;
use App\Models\Blog;
use Illuminate\Support\Facades\Cache;

final class BlogService extends BaseService
{
    public function getBlogPageData(): array
    {
        // In production, implement caching
        // return Cache::remember('blog_page_data', 3600, function () {
            return [
                'posts' => $this->getDummyPosts(),
                'featured' => $this->getDummyFeaturedPosts(),
                'categories' => $this->getDummyCategories(),
                'tags' => $this->getDummyTags(),
                'stats' => $this->getDummyStats(),
                'popularPosts' => $this->getDummyPopularPosts(),
                'recentPosts' => $this->getDummyRecentPosts()
            ];
        // });
    }

    private function getDummyPosts(): array
    {
        $posts = [];
        for ($i = 1; $i <= 12; $i++) {
            $posts[] = [
                'id' => $i,
                'title' => "How to Make the Perfect {$this->getRandomDish()}",
                'slug' => "how-to-make-perfect-dish-{$i}",
                'excerpt' => "Discover the secrets to creating the most delicious and authentic {$this->getRandomDish()} in your own kitchen. Our expert chefs share their tips and tricks...",
                'content' => $this->getDummyContent(),
                'image' => "/images/blogs/blog-{$i}.jpg",
                'reading_time' => rand(5, 15),
                'published_at' => now()->subDays(rand(1, 30))->format('Y-m-d'),
                'views' => rand(100, 1000),
                'category' => [
                    'name' => $this->getRandomCategory(),
                    'slug' => 'category-slug'
                ],
                'author' => [
                    'name' => $this->getRandomAuthor(),
                    'avatar' => "/images/avatars/avatar-{rand(1,8)}.jpg",
                    'bio' => 'Expert chef with over 10 years of experience in international cuisine.'
                ],
                'tags' => $this->getRandomTags(),
                'meta' => [
                    'title' => "Cooking Guide: Perfect {$this->getRandomDish()}",
                    'description' => "Learn how to cook the perfect {$this->getRandomDish()} with our step-by-step guide.",
                    'keywords' => 'cooking, recipe, food, cuisine'
                ]
            ];
        }

        return [
            'data' => $posts,
            'total' => 50,
            'per_page' => 12,
            'current_page' => 1,
            'last_page' => 5
        ];
    }

    private function getDummyFeaturedPosts(): array
    {
        $featuredPosts = [];
        for ($i = 1; $i <= 3; $i++) {
            $featuredPosts[] = [
                'id' => $i,
                'title' => "Featured: {$this->getRandomDish()} Masterclass",
                'slug' => "featured-masterclass-{$i}",
                'excerpt' => "Join our expert chefs for an exclusive masterclass on preparing the perfect {$this->getRandomDish()}...",
                'image' => "/images/blogs/featured-{$i}.jpg",
                'reading_time' => rand(10, 20),
                'published_at' => now()->subDays(rand(1, 7))->format('Y-m-d'),
                'views' => rand(1000, 5000),
                'category' => [
                    'name' => $this->getRandomCategory(),
                    'slug' => 'featured-category'
                ],
                'author' => [
                    'name' => $this->getRandomAuthor(),
                    'avatar' => "/images/avatars/chef-{$i}.jpg",
                    'bio' => 'Master Chef with multiple culinary awards'
                ]
            ];
        }

        return $featuredPosts;
    }

    private function getDummyCategories(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Recipes',
                'slug' => 'recipes',
                'posts_count' => rand(50, 100)
            ],
            [
                'id' => 2,
                'name' => 'Cooking Tips',
                'slug' => 'cooking-tips',
                'posts_count' => rand(30, 80)
            ],
            [
                'id' => 3,
                'name' => 'Restaurant Reviews',
                'slug' => 'restaurant-reviews',
                'posts_count' => rand(20, 60)
            ],
            [
                'id' => 4,
                'name' => 'Food Culture',
                'slug' => 'food-culture',
                'posts_count' => rand(40, 90)
            ],
            [
                'id' => 5,
                'name' => 'Health & Nutrition',
                'slug' => 'health-nutrition',
                'posts_count' => rand(25, 70)
            ]
        ];
    }

    private function getDummyTags(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Healthy',
                'slug' => 'healthy',
                'posts_count' => rand(20, 50)
            ],
            [
                'id' => 2,
                'name' => 'Quick & Easy',
                'slug' => 'quick-easy',
                'posts_count' => rand(30, 60)
            ],
            [
                'id' => 3,
                'name' => 'Vegetarian',
                'slug' => 'vegetarian',
                'posts_count' => rand(15, 40)
            ],
            [
                'id' => 4,
                'name' => 'Desserts',
                'slug' => 'desserts',
                'posts_count' => rand(25, 55)
            ],
            [
                'id' => 5,
                'name' => 'Traditional',
                'slug' => 'traditional',
                'posts_count' => rand(35, 70)
            ]
        ];
    }

    private function getDummyStats(): array
    {
        return [
            'total_posts' => rand(500, 1000),
            'total_views' => rand(50000, 100000),
            'total_categories' => 5,
            'total_tags' => 15
        ];
    }

    private function getDummyPopularPosts(): array
    {
        $popularPosts = [];
        for ($i = 1; $i <= 5; $i++) {
            $popularPosts[] = [
                'id' => $i,
                'title' => "Most Popular: {$this->getRandomDish()} Recipe",
                'slug' => "popular-recipe-{$i}",
                'excerpt' => "Our most-loved recipe for {$this->getRandomDish()} with secret tips from professional chefs...",
                'image' => "/images/blogs/popular-{$i}.jpg",
                'views' => rand(5000, 10000),
                'published_at' => now()->subDays(rand(1, 14))->format('Y-m-d')
            ];
        }

        return $popularPosts;
    }

    private function getDummyRecentPosts(): array
    {
        $recentPosts = [];
        for ($i = 1; $i <= 5; $i++) {
            $recentPosts[] = [
                'id' => $i,
                'title' => "Latest: {$this->getRandomDish()} Guide",
                'slug' => "recent-guide-{$i}",
                'excerpt' => "Fresh off the press: Learn how to make {$this->getRandomDish()} like a professional...",
                'image' => "/images/blogs/recent-{$i}.jpg",
                'published_at' => now()->subDays($i)->format('Y-m-d')
            ];
        }

        return $recentPosts;
    }

    private function getRandomDish(): string
    {
        $dishes = [
            'Spaghetti Carbonara',
            'Beef Wellington',
            'Chicken Tikka Masala',
            'Sushi Roll',
            'Thai Green Curry',
            'French Onion Soup',
            'Beef Bourguignon',
            'Paella',
            'Pad Thai',
            'Margherita Pizza'
        ];

        return $dishes[array_rand($dishes)];
    }

    private function getRandomCategory(): string
    {
        $categories = ['Italian', 'French', 'Asian', 'Mediterranean', 'Indian', 'American'];
        return $categories[array_rand($categories)];
    }

    private function getRandomAuthor(): string
    {
        $authors = [
            'Chef John Smith',
            'Chef Maria Garcia',
            'Chef David Chen',
            'Chef Sarah Johnson',
            'Chef Michael Brown'
        ];

        return $authors[array_rand($authors)];
    }

    private function getRandomTags(): array
    {
        $allTags = [
            ['name' => 'Healthy', 'slug' => 'healthy'],
            ['name' => 'Quick & Easy', 'slug' => 'quick-easy'],
            ['name' => 'Vegetarian', 'slug' => 'vegetarian'],
            ['name' => 'Gluten-Free', 'slug' => 'gluten-free'],
            ['name' => 'Dessert', 'slug' => 'dessert'],
            ['name' => 'Breakfast', 'slug' => 'breakfast'],
            ['name' => 'Lunch', 'slug' => 'lunch'],
            ['name' => 'Dinner', 'slug' => 'dinner']
        ];

        shuffle($allTags);
        return array_slice($allTags, 0, rand(2, 4));
    }

    private function getDummyContent(): string
    {
        return <<<HTML
            <h2>Introduction</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            
            <h2>Ingredients</h2>
            <ul>
                <li>2 cups all-purpose flour</li>
                <li>1 cup sugar</li>
                <li>3 large eggs</li>
                <li>1 cup milk</li>
                <li>1/2 cup vegetable oil</li>
            </ul>
            
            <h2>Instructions</h2>
            <ol>
                <li>Preheat the oven to 350°F (175°C)</li>
                <li>Mix dry ingredients in a large bowl</li>
                <li>Combine wet ingredients in a separate bowl</li>
                <li>Fold wet ingredients into dry ingredients</li>
                <li>Bake for 30-35 minutes</li>
            </ol>
            
            <h2>Tips and Tricks</h2>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
            <blockquote>
                <p>Pro tip: Always let your ingredients come to room temperature before starting!</p>
            </blockquote>
            
            <h2>Nutritional Information</h2>
            <table>
                <tr>
                    <th>Calories</th>
                    <td>350</td>
                </tr>
                <tr>
                    <th>Protein</th>
                    <td>8g</td>
                </tr>
                <tr>
                    <th>Carbohydrates</th>
                    <td>45g</td>
                </tr>
            </table>
        HTML;
    }

    public function getBlogPostData(string $slug): array
    {
        // In production, implement caching
        // return Cache::remember("blog_post_{$slug}", 3600, function () use ($slug) {
            $post = Blog::with(['author', 'category', 'tags', 'comments.author'])
                ->where('slug', $slug)
                ->firstOrFail();

            // Increment views
            $post->increment('views');

            return [
                'post' => $post,
                'relatedPosts' => $this->getRelatedPosts($post),
                'nextPost' => $this->getNextPost($post),
                'previousPost' => $this->getPreviousPost($post),
                'comments' => $this->getPostComments($post),
                'popularPosts' => $this->getPopularPosts(),
            ];
        // });
    }

    private function getRelatedPosts(Blog $post, int $limit = 3): array
    {
        return Blog::with(['author', 'category'])
            ->where('id', '!=', $post->id)
            ->where(function ($query) use ($post) {
                $query->where('category_id', $post->category_id)
                    ->orWhereHas('tags', function ($query) use ($post) {
                        $query->whereIn('id', $post->tags->pluck('id'));
                    });
            })
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    private function getNextPost(Blog $post): ?array
    {
        return Blog::where('published_at', '>', $post->published_at)
            ->orderBy('published_at', 'asc')
            ->first()?->toArray();
    }

    private function getPreviousPost(Blog $post): ?array
    {
        return Blog::where('published_at', '<', $post->published_at)
            ->orderBy('published_at', 'desc')
            ->first()?->toArray();
    }

    private function getPostComments(Blog $post): array
    {
        return $post->comments()
            ->with('author')
            ->whereNull('parent_id')
            ->orderBy('created_at', 'desc')
            ->get()
            ->toArray();
    }
} 