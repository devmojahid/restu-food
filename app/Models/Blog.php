<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasFiles;

final class Blog extends Model
{
    use HasFactory, SoftDeletes, HasFiles;

    // File Collections
    public const COLLECTION_THUMBNAIL = 'thumbnail';
    public const COLLECTION_FEATURED = 'featured_images';
    public const COLLECTION_IMAGES = 'images';
    public const COLLECTION_VIDEOS = 'videos';
    public const COLLECTION_ATTACHMENTS = 'attachments';

    protected $fillable = [
        'title',
        'slug',
        'content',
        'is_published',
        'published_at',
        'user_id'
    ];

    protected $casts = [
        'tags' => 'array',
        'categories' => 'array',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    protected $appends = ['featured_image'];

    public function getFeaturedImageAttribute()
    {
        return $this->getFile(self::COLLECTION_FEATURED);
    }

    protected static function booted(): void
    {
        static::deleting(function ($blog) {
            $blog->files()->delete();
        });

        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = str($blog->title)->slug();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->where('published_at', '<=', now());
    }

    public function scopeDraft($query)
    {
        return $query->where('is_published', false);
    }

    public function scopeScheduled($query)
    {
        return $query->where('is_published', true)
            ->where('published_at', '>', now());
    }

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

    public function schedule(string $publishDate): void
    {
        $this->update([
            'is_published' => true,
            'published_at' => $publishDate,
        ]);
    }
}