<?php

declare(strict_types=1);

namespace App\Models;

use App\Traits\HasFiles;
use App\Traits\HasMeta;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\HasCoupons;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, HasFiles, HasMeta, HasCoupons;

    public const COLLECTION_AVATAR = 'avatar';

    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class);
    }

    public function restaurants()
    {
        return $this->hasMany(Restaurant::class);
    }

    public function favoriteRestaurants()
    {
        return $this->belongsToMany(Restaurant::class, 'favorite_restaurants')
            ->withTimestamps()
            ->withPivot('notes');
    }

    protected $appends = ['avatar'];

    public function getAvatarAttribute(): ?File
    {
        return $this->getFile(self::COLLECTION_AVATAR);
    }

    // Helper methods for common operations
    public function recordLoginAttempt(bool $success, ?string $ip = null): void
    {
        $loginHistory = $this->getMeta('login_history', []);
        array_unshift($loginHistory, [
            'timestamp' => now()->toDateTimeString(),
            'ip' => $ip ?? request()->ip(),
            'user_agent' => request()->userAgent(),
            'success' => $success
        ]);

        // Keep only last 50 attempts
        $loginHistory = array_slice($loginHistory, 0, 50);
        
        $this->setMeta('login_history', $loginHistory);
        $this->incrementMeta('login_count');
        
        if ($success) {
            $this->setMeta('last_login_at', now());
            $this->setMeta('last_login_ip', $ip ?? request()->ip());
        }
    }

    public function updateLastActivity(): void
    {
        $this->setMeta('last_activity', now());
    }

    public function isOnline(): bool
    {
        $lastActivity = $this->getMeta('last_activity');
        return $lastActivity && now()->diffInMinutes($lastActivity) < 5;
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }
}
