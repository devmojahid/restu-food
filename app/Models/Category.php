<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasSlug;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

final class Category extends Model
{
    use HasFactory, SoftDeletes, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'image',
        'parent_id',
        'level',
        'path',
        'is_active',
        'sort_order',
        'meta_data',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'level' => 'integer',
        'meta_data' => 'array',
    ];

    // Relationships
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }

    // Polymorphic relationships
    public function blogs(): MorphToMany
    {
        return $this->morphedByMany(Blog::class, 'categorizable');
    }

    public function foodItems(): MorphToMany
    {
        return $this->morphedByMany(FoodItem::class, 'categorizable');
    }

    // Scopes
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeRoot(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    public function scopeWithAncestors(Builder $query): Builder
    {
        return $query->with(['parent' => function ($query) {
            $query->withAncestors();
        }]);
    }

    // Helper methods
    public function getAncestors(): Collection
    {
        if (!$this->path) {
            return collect();
        }

        $ancestorIds = explode('/', trim($this->path, '/'));
        return self::whereIn('id', $ancestorIds)->orderBy('level')->get();
    }

    public function getAllChildren(): Collection
    {
        return $this->children()->with('allChildren')->get();
    }

    public function isRoot(): bool
    {
        return is_null($this->parent_id);
    }

    public function isLeaf(): bool
    {
        return $this->children()->count() === 0;
    }

    public function isDescendantOf(self $category): bool
    {
        return str_starts_with($this->path, $category->path);
    }

    public function getBreadcrumb(): Collection
    {
        return collect([$this])->merge($this->getAncestors());
    }

    // Path management
    protected static function booted(): void
    {
        static::creating(function (self $category) {
            $category->updatePathAndLevel();
        });

        static::updating(function (self $category) {
            if ($category->isDirty('parent_id')) {
                $category->updatePathAndLevel();
            }
        });
    }

    protected function updatePathAndLevel(): void
    {
        if ($this->parent_id) {
            $parent = self::find($this->parent_id);
            $this->path = $parent->path . '/' . $parent->id;
            $this->level = $parent->level + 1;
        } else {
            $this->path = '';
            $this->level = 0;
        }
    }
}
