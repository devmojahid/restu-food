<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

final class Coupon extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_order_value',
        'max_uses',
        'used_count',
        'start_date',
        'end_date',
        'is_active',
        'description',
        'max_discount_amount',
        'user_type', // all, new, existing
        'usage_limit_per_user',
        'exclude_sale_items',
        'exclude_categories',
        'include_categories',
        'exclude_products',
        'include_products',
        'min_items_count',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
        'exclude_sale_items' => 'boolean',
        'exclude_categories' => 'array',
        'include_categories' => 'array',
        'exclude_products' => 'array',
        'include_products' => 'array',
        'value' => 'decimal:2',
        'min_order_value' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
    ];

    // Relationships
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'coupon_usage')
            ->withTimestamps()
            ->withPivot('order_id', 'discount_amount');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            })
            ->where(function ($q) {
                $q->whereNull('max_uses')
                    ->orWhereRaw('used_count < max_uses');
            });
    }

    public function scopeExpired($query)
    {
        return $query->where(function ($q) {
            $q->where('end_date', '<', now())
                ->orWhereRaw('used_count >= max_uses');
        });
    }

    // Helper methods
    public function isValid(): bool
    {
        return $this->is_active &&
            (!$this->start_date || $this->start_date <= now()) &&
            (!$this->end_date || $this->end_date >= now()) &&
            (!$this->max_uses || $this->used_count < $this->max_uses);
    }

    public function isExpired(): bool
    {
        return ($this->end_date && $this->end_date < now()) ||
            ($this->max_uses && $this->used_count >= $this->max_uses);
    }

    public function hasStarted(): bool
    {
        return !$this->start_date || $this->start_date <= now();
    }

    public function calculateDiscount(float $orderAmount, array $items = []): float
    {
        if ($this->type === 'percentage') {
            $discount = $orderAmount * ($this->value / 100);
            return $this->max_discount_amount 
                ? min($discount, $this->max_discount_amount)
                : $discount;
        }

        return min($this->value, $orderAmount);
    }

    public function canBeUsedByUser(User $user): bool
    {
        if ($this->user_type === 'new' && $user->orders()->count() > 0) {
            return false;
        }

        if ($this->usage_limit_per_user) {
            $userUsageCount = $this->users()
                ->where('user_id', $user->id)
                ->count();
            
            if ($userUsageCount >= $this->usage_limit_per_user) {
                return false;
            }
        }

        return true;
    }

    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }

    public function getRemainingUsesAttribute(): ?int
    {
        if (!$this->max_uses) {
            return null;
        }
        return max(0, $this->max_uses - $this->used_count);
    }

    public function getStatusAttribute(): string
    {
        if (!$this->is_active) {
            return 'inactive';
        }
        if ($this->isExpired()) {
            return 'expired';
        }
        if (!$this->hasStarted()) {
            return 'scheduled';
        }
        return 'active';
    }

    public function getFormattedValueAttribute(): string
    {
        return $this->type === 'percentage'
            ? "{$this->value}%"
            : currency($this->value);
    }
}
