<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasFiles;
use App\Traits\HasCache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

final class Blog extends Model
{
    use HasFiles, HasCache, SoftDeletes;

    // File collection constants
    public const COLLECTION_THUMBNAIL = 'thumbnail';
    public const COLLECTION_FEATURED = 'featured';
    public const COLLECTION_IMAGES = 'images';
    public const COLLECTION_VIDEOS = 'videos';
    public const COLLECTION_ATTACHMENTS = 'attachments';
    
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'meta_title',
        'meta_description',
        'is_published',
        'published_at',
        'user_id',
        'category_id',
        'tags',
        'is_featured'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
        'tags' => 'array'
    ];
    
    protected $appends = ['thumbnail', 'featured_image'];

    protected static function booted(): void
    {
        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title);
            }
            if ($blog->is_published && !$blog->published_at) {
                $blog->published_at = now();
            }
        });
    }
    
    public function getThumbnailAttribute(): ?File
    {
        return $this->getFile(self::COLLECTION_THUMBNAIL);
    }

    public function getFeaturedImageAttribute(): ?File
    {
        return $this->getFile(self::COLLECTION_FEATURED);
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByTag($query, string $tag)
    {
        return $query->where('tags', 'like', "%{$tag}%");
    }

    // Helper methods
    public function publish(): void
    {
        $this->update([
            'is_published' => true,
            'published_at' => now(),
        ]);
    }

    public function unpublish(): void
    {
        $this->update([
            'is_published' => false,
            'published_at' => null,
        ]);
    }

    public function toggleFeatured(): void
    {
        $this->update([
            'is_featured' => !$this->is_featured,
        ]);
    }

    protected function getCachePrefix(): string
    {
        return 'blog'; // Custom prefix for blog
    }

    protected function getCacheTTL(): int
    {
        return 1800; // 30 minutes for blogs
    }
}
