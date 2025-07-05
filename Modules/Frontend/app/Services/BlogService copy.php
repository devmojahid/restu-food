<?php

declare(strict_types=1);

namespace Modules\Frontend\Services;  

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
                'posts' => $this->getPosts(),
                'featured' => $this->getFeaturedPosts(),
                'categories' => $this->getCategories(),
                'tags' => $this->getTags(),
                'stats' => $this->getStats(),
                'popularPosts' => $this->getPopularPosts(),
                'recentPosts' => $this->getRecentPosts()
            ];
        // });
    }

    private function getPosts(): array
    {
        return Blog::with(['author', 'category'])
            // ->where('status', 'published')
            ->latest('published_at')
            ->paginate(12)
            ->through(fn ($post) => $this->formatPost($post))
            ->toArray();
    }

    private function getFeaturedPosts(): array
    {
        return Blog::with(['author', 'category'])
            // ->where('status', 'published')
            // ->orderBy('views', 'desc')
            ->take(3)
            ->get()
            ->map(fn ($post) => $this->formatPost($post))
            ->toArray();
    }

    private function getPopularPosts(): array
    {
        return Blog::where('status', 'published')
            // ->orderBy('views', 'desc')
            ->take(5)
            ->get()
            ->map(fn ($post) => $this->formatPost($post))
            ->toArray();
    }

    private function getRecentPosts(): array
    {
        return Blog::where('status', 'published')
            ->latest('published_at')
            ->take(5)
            ->get()
            ->map(fn ($post) => $this->formatPost($post))
            ->toArray();
    }

    private function getRelatedPosts(Blog $post): array
    {
        return Blog::where('status', 'published')
            ->where('category_id', $post->category_id)
            ->where('id', '!=', $post->id)
            ->take(3)
            ->get()
            ->map(fn ($post) => $this->formatPost($post))
            ->toArray();
    }

    private function getNextPost(Blog $post): ?array
    {
        $nextPost = Blog::where('status', 'published')
            ->where('published_at', '>', $post->published_at)
            ->orderBy('published_at', 'asc')
            ->first();

        return $nextPost ? $this->formatPost($nextPost) : null;
    }

    private function getPreviousPost(Blog $post): ?array
    {
        $previousPost = Blog::where('status', 'published')
            ->where('published_at', '<', $post->published_at)
            ->orderBy('published_at', 'desc')
            ->first();

        return $previousPost ? $this->formatPost($previousPost) : null;
    }

    private function getCategories(): array
    {
        return \App\Models\Category::withCount(['blogs' => function($query) {
            $query->where('status', 'published');
        }])
        ->get()
        ->map(fn ($category) => [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'posts_count' => $category->blogs_count
        ])
        ->toArray();
    }

    private function getTags(): array
    {
        return \App\Models\Tag::withCount(['blogs' => function($query) {
            $query->where('status', 'published');
        }])
        ->get()
        ->map(fn ($tag) => [
            'id' => $tag->id,
            'name' => $tag->name,
            'slug' => $tag->slug,
            'posts_count' => $tag->blogs_count
        ])
        ->toArray();
    }

    private function getStats(): array
    {
        return [
            'total_posts' => Blog::where('status', 'published')->count(),
            'total_views' => Blog::where('status', 'published')->sum('views'),
            'total_categories' => \App\Models\Category::count(),
            'total_tags' => \App\Models\Tag::count()
        ];
    }

    private function formatPost($post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt ?? $this->generateExcerpt($post->content),
            'content' => $post->content,
            'image' => $post->image_url ?? '/images/default-blog.jpg',
            'reading_time' => $this->calculateReadingTime($post->content),
            'published_at' => $post->published_at?->format('Y-m-d'),
            'views' => $post->views ?? 0,
            'category' => $post->category ? [
                'name' => $post->category->name,
                'slug' => $post->category->slug
            ] : null,
            'author' => $post->author ? [
                'name' => $post->author->name,
                'avatar' => $post->author->avatar_url ?? '/images/default-avatar.jpg',
                'bio' => $post->author->bio ?? ''
            ] : null,
            'tags' => $post->tags->map(fn ($tag) => [
                'name' => $tag->name,
                'slug' => $tag->slug
            ])->toArray(),
            'meta' => [
                'title' => $post->meta_title ?? $post->title,
                'description' => $post->meta_description ?? $this->generateExcerpt($post->content),
                'keywords' => $post->meta_keywords ?? ''
            ]
        ];
    }

    private function generateExcerpt(string $content, int $length = 160): string
    {
        $excerpt = strip_tags($content);
        if (mb_strlen($excerpt) <= $length) {
            return $excerpt;
        }
        
        return mb_substr($excerpt, 0, $length) . '...';
    }

    private function calculateReadingTime(string $content): int
    {
        $wordsPerMinute = 200;
        $wordCount = str_word_count(strip_tags($content));
        return max(1, ceil($wordCount / $wordsPerMinute));
    }

    public function incrementViews(Blog $post): void
    {
        $post->increment('views');
    }
} 