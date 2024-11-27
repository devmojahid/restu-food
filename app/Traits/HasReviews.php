<?php

namespace App\Traits;

use App\Models\Review;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasReviews
{
    public function reviews(): MorphMany
    {
        return $this->morphMany(Review::class, 'reviewable');
    }

    public function approvedReviews(): MorphMany
    {
        return $this->reviews()->where('is_approved', true);
    }

    public function pendingReviews(): MorphMany
    {
        return $this->reviews()->where('is_approved', false);
    }

    public function getAverageRatingAttribute(): float
    {
        return $this->approvedReviews()->avg('rating') ?? 0;
    }

    public function getReviewsCountAttribute(): int
    {
        return $this->approvedReviews()->count();
    }

    public function getRecommendationPercentageAttribute(): float
    {
        $totalReviews = $this->approvedReviews()->count();
        if ($totalReviews === 0) {
            return 0;
        }

        $recommendedCount = $this->approvedReviews()
            ->where('is_recommended', true)
            ->count();

        return ($recommendedCount / $totalReviews) * 100;
    }

    public function getRatingDistributionAttribute(): array
    {
        $distribution = [];
        $totalReviews = $this->approvedReviews()->count();

        for ($i = 5; $i >= 1; $i--) {
            $count = $this->approvedReviews()
                ->where('rating', $i)
                ->count();

            $distribution[$i] = [
                'count' => $count,
                'percentage' => $totalReviews > 0 ? ($count / $totalReviews) * 100 : 0,
            ];
        }

        return $distribution;
    }
} 