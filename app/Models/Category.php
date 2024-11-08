<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Traits\HasFiles;

final class Category extends Model
{
    use HasFactory, SoftDeletes, HasFiles;

    public const COLLECTION_ICON = 'icon';
    public const COLLECTION_THUMBNAIL = 'thumbnail';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'type', // blog, product, etc.
        'sort_order',
        'is_active',
        'settings', // JSON field for additional settings
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'array',
        'sort_order' => 'integer',
    ];

    protected $appends = ['icon_url', 'thumbnail_url'];

    protected $with = ['files'];

    protected static function booted(): void
    {
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = str($category->name)->slug();
            }
        });

        static::deleting(function ($category) {
            // Handle children categories before deletion
            $category->children()->delete();
            $category->files()->delete();
        });
    }

    public function getIconUrlAttribute(): ?string
    {
        $file = $this->files->where('collection', self::COLLECTION_ICON)->first();
        return $file?->url;
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        $file = $this->files->where('collection', self::COLLECTION_THUMBNAIL)->first();
        return $file?->url;
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function blogs()
    {
        return $this->morphedByMany(Blog::class, 'categorizable');
    }

    public function products()
    {
        return $this->morphedByMany(Product::class, 'categorizable');
    }

    // Scope for type filtering
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // Scope for active categories
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Get all ancestors of the category
    public function ancestors()
    {
        $ancestors = collect();
        $category = $this;

        while ($category->parent) {
            $ancestors->push($category->parent);
            $category = $category->parent;
        }

        return $ancestors->reverse();
    }

    // Get full hierarchical path
    public function getPathAttribute(): string
    {
        return $this->ancestors()->pluck('name')->push($this->name)->implode(' > ');
    }

    // Check if category has children
    public function hasChildren(): bool
    {
        return $this->children()->count() > 0;
    }

    // Get all descendants
    public function descendants()
    {
        $descendants = collect();

        foreach ($this->children as $child) {
            $descendants->push($child);
            $descendants = $descendants->merge($child->descendants());
        }

        return $descendants;
    }

    // Get root categories
    public static function roots()
    {
        return static::whereNull('parent_id');
    }

    // Get siblings
    public function siblings()
    {
        return static::where('parent_id', $this->parent_id)
            ->where('id', '!=', $this->id);
    }

    // Move category to new parent
    public function moveTo(?Category $parent = null): void
    {
        $this->parent_id = $parent?->id;
        $this->save();
    }

    // Reorder categories
    public function reorder(int $order): void
    {
        $this->order = $order;
        $this->save();
    }
}
