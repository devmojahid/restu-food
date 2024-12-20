<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;
use App\Models\Blog;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

final class BlogService extends BaseService
{
    protected string $cachePrefix = 'blog:frontend:';
    protected int $cacheDuration = 3600; // 1 hour
    
    public function getBlogPageData(array $filters = []): array
    {
        $cacheKey = "{$this->cachePrefix}page_data:" . md5(json_encode($filters));
        
        // return Cache::remember($cacheKey, $this->cacheDuration, function () use ($filters) {
            return [
                'posts' => $this->getPosts($filters),
                'featured' => $this->getFeaturedPosts(),
                'categories' => $this->getCategories(),
                'stats' => $this->getStats(),
                'popularPosts' => $this->getPopularPosts(),
                'recentPosts' => $this->getRecentPosts()
            ];
        // });
    }

    private function getPosts(array $filters = []): array
    {
        $query = Blog::with(['user', 'files', 'categories'])
            ->published()
            ->latest('published_at');

        // Apply category filter if provided
        if (!empty($filters['category'])) {
            $query->whereHas('categories', function ($q) use ($filters) {
                $q->where('slug', $filters['category']);
            });
        }

        $posts = $query->paginate(12);

        return [
            'data' => $posts->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'image' => $post->featured_image?->url ?? $post->thumbnail?->url,
                    'reading_time' => $this->calculateReadingTime($post->content),
                    'published_at' => $post->published_at->format('Y-m-d'),
                    'categories' => $post->categories->map(function ($category) {
                        return [
                            'id' => $category->id,
                            'name' => $category->name,
                            'slug' => $category->slug
                        ];
                    }),
                    'author' => [
                        'name' => $post->user?->name,
                        'avatar' => $post?->user?->avatar?->url,
                        'bio' => $post->user?->bio
                    ]
                ];
            })->toArray(),
            'total' => $posts->total(),
            'per_page' => $posts->perPage(),
            'current_page' => $posts->currentPage(),
            'last_page' => $posts->lastPage()
        ];
    }

    private function getFeaturedPosts(): array
    {
        return Blog::with(['user', 'files', 'categories'])
            ->published()
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'image' => $post->featured_image?->url ?? $post->thumbnail?->url,
                    'reading_time' => $this->calculateReadingTime($post->content),
                    'published_at' => $post->published_at->format('Y-m-d'),
                    'categories' => $post->categories->map(function ($category) {
                        return [
                            'id' => $category->id,
                            'name' => $category->name,
                            'slug' => $category->slug
                        ];
                    }),
                    'author' => [
                        'name' => $post->user?->name,
                        'avatar' => $post?->user?->avatar?->url,
                        'bio' => $post->user?->bio
                    ]
                ];
            })
            ->toArray();
    }

    private function getCategories(): array
    {
        return Category::where('type', 'blog')
            ->withCount(['blogs' => function (Builder $query) {
                $query->whereHas('categories')
                    ->published();
            }])
            ->orderByDesc('blogs_count')
            ->take(5)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'posts_count' => $category->blogs_count ?? 0,
                    'icon_url' => $category->icon_url,
                    'thumbnail_url' => $category->thumbnail_url
                ];
            })
            ->toArray();
    }

    private function getStats(): array
    {
        return [
            'total_posts' => Blog::published()->count(),
            'total_categories' => Category::where('type', 'blog')->count(),
            'latest_post' => Blog::published()->latest('published_at')->first()?->published_at?->diffForHumans(),
            'total_authors' => Blog::published()->distinct('user_id')->count('user_id')
        ];
    }

    private function getPopularPosts(): array
    {
        return Blog::with(['user', 'files', 'category'])
            ->published()
            ->latest('published_at')
            ->take(5)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'image' => $post->thumbnail?->url,
                    'published_at' => $post->published_at->format('Y-m-d'),
                    'category' => $post->category ? [
                        'name' => $post->category->name,
                        'slug' => $post->category->slug
                    ] : null
                ];
            })
            ->toArray();
    }

    private function getRecentPosts(): array
    {
        return Blog::with(['user', 'files', 'category'])
            ->published()
            ->latest('published_at')
            ->take(5)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'image' => $post->thumbnail?->url,
                    'published_at' => $post->published_at->format('Y-m-d'),
                    'category' => $post->category ? [
                        'name' => $post->category->name,
                        'slug' => $post->category->slug
                    ] : null
                ];
            })
            ->toArray();
    }

    private function calculateReadingTime(?string $content): int
    {
        if (!$content) {
            return 1;
        }
        $wordsPerMinute = 200;
        $wordCount = str_word_count(strip_tags($content));
        return max(1, (int) ceil($wordCount / $wordsPerMinute));
    }

    public function getBlogPostData(string $slug): array
    {
        $cacheKey = "{$this->cachePrefix}post:{$slug}";
        
        // return Cache::remember($cacheKey, $this->cacheDuration, function () use ($slug) {
            $post = Blog::with(['user', 'files', 'category'])
                ->where('slug', $slug)
                ->published()
                ->firstOrFail();

            return [
                'post' => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'excerpt' => $post->excerpt,
                    'slug' => $post->slug,
                    'reading_time' => $this->calculateReadingTime($post->content),
                    'published_at' => $post->published_at->format('Y-m-d'),
                    'author' => [
                        'name' => $post->user?->name,
                        'avatar' => $post->user?->avatar_url,
                        'bio' => $post->user?->bio
                    ],
                    'category' => $post->category ? [
                        'name' => $post->category->name,
                        'slug' => $post->category->slug
                    ] : null,
                    'featured_image' => $post->featured_image?->url ?? $post->thumbnail?->url,
                    'thumbnail' => $post->featured_image?->url ?? $post->thumbnail?->url,
                    'meta' => [
                        'title' => $post->meta_title ?? $post->title,
                        'description' => $post->meta_description ?? $post->excerpt
                    ]
                ],
                'relatedPosts' => $this->getRelatedPosts($post),
                'nextPost' => $this->getAdjacentPost($post, 'next'),
                'previousPost' => $this->getAdjacentPost($post, 'previous'),
                'popularPosts' => $this->getPopularPosts()
            ];
        // });
    }

    private function getRelatedPosts(Blog $post, int $limit = 3): array
    {
        return Blog::with(['user', 'files', 'category'])
            ->published()
            ->where('id', '!=', $post->id)
            ->when($post->category_id, function ($query) use ($post) {
                $query->where('category_id', $post->category_id);
            })
            ->latest('published_at')
            ->take($limit)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'image' => $post->thumbnail?->url,
                    'published_at' => $post->published_at->format('Y-m-d'),
                    'category' => $post->category ? [
                        'name' => $post->category->name,
                        'slug' => $post->category->slug
                    ] : null
                ];
            })
            ->toArray();
    }

    private function getAdjacentPost(Blog $post, string $direction): ?array
    {
        $query = Blog::with(['user', 'files', 'category'])
            ->published();

        if ($direction === 'next') {
            $query->where('published_at', '>', $post->published_at)
                ->orderBy('published_at', 'asc');
        } else {
            $query->where('published_at', '<', $post->published_at)
                ->orderBy('published_at', 'desc');
        }

        $adjacentPost = $query->first();

        if (!$adjacentPost) {
            return null;
        }

        return [
            'id' => $adjacentPost->id,
            'title' => $adjacentPost->title,
            'slug' => $adjacentPost->slug,
            'excerpt' => $adjacentPost->excerpt,
            'image' => $adjacentPost->thumbnail?->url,
            'category' => $adjacentPost->category ? [
                'name' => $adjacentPost->category->name,
                'slug' => $adjacentPost->category->slug
            ] : null
        ];
    }
} 