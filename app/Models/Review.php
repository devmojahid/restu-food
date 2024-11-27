<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasFiles;
use App\Traits\HandlesFiles;

final class Review extends Model
{
    use HasFactory, SoftDeletes, HasFiles, HandlesFiles;

    public const COLLECTION_IMAGES = 'images';

    protected $fillable = [
        'user_id',
        'reviewable_type',
        'reviewable_id',
        'parent_id',
        'rating',
        'title',
        'comment',
        'pros',
        'cons',
        'is_recommended',
        'is_verified_purchase',
        'is_approved',
        'approved_at',
        'approved_by',
        'status',
        'helpful_votes',
        'unhelpful_votes',
        'reported_count',
        'metadata',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_recommended' => 'boolean',
        'is_verified_purchase' => 'boolean',
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'metadata' => 'json',
        'helpful_votes' => 'integer',
        'unhelpful_votes' => 'integer',
        'reported_count' => 'integer',
    ];

    protected $with = ['user'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewable()
    {
        return $this->morphTo();
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function parent()
    {
        return $this->belongsTo(Review::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Review::class, 'parent_id');
    }

    public function votes()
    {
        return $this->hasMany(ReviewVote::class);
    }

    public function reports()
    {
        return $this->hasMany(ReviewReport::class);
    }

    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopePending($query)
    {
        return $query->where('is_approved', false);
    }

    public function scopeParentOnly($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeForType($query, string $type)
    {
        return $query->where('reviewable_type', $type);
    }

    public function approve(?int $approverId = null): void
    {
        $this->update([
            'is_approved' => true,
            'approved_at' => now(),
            'approved_by' => $approverId ?? auth()->id(),
        ]);
    }

    public function reject(): void
    {
        $this->update([
            'is_approved' => false,
            'approved_at' => null,
            'approved_by' => null,
        ]);
    }

    public function vote(string $type, int $userId): void
    {
        $this->votes()->updateOrCreate(
            ['user_id' => $userId],
            ['vote_type' => $type]
        );

        $this->updateVoteCounts();
    }

    public function report(int $userId, string $reason, ?string $details = null): void
    {
        $this->reports()->create([
            'user_id' => $userId,
            'reason' => $reason,
            'details' => $details,
        ]);

        $this->increment('reported_count');
    }

    protected function updateVoteCounts(): void
    {
        $this->update([
            'helpful_votes' => $this->votes()->where('vote_type', 'helpful')->count(),
            'unhelpful_votes' => $this->votes()->where('vote_type', 'unhelpful')->count(),
        ]);
    }
}
