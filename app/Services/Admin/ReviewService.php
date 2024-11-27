<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Review;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;

final class ReviewService
{
    public function create(array $data, Model $reviewable): Review
    {
        return DB::transaction(function () use ($data, $reviewable) {
            $review = $reviewable->reviews()->create([
                ...$data,
                'user_id' => Auth::id(),
                'is_verified_purchase' => $this->verifyPurchase($reviewable),
            ]);

            if (!empty($data['images'])) {
                $review->handleFiles(['images' => $data['images']]);
            }

            return $review->fresh();
        });
    }

    public function update(Review $review, array $data): Review
    {
        return DB::transaction(function () use ($review, $data) {
            $review->update($data);

            if (isset($data['images'])) {
                if (empty($data['images'])) {
                    $review->clearFiles(Review::COLLECTION_IMAGES);
                } else {
                    $review->handleFiles(['images' => $data['images']]);
                }
            }

            return $review->fresh();
        });
    }

    public function delete(Review $review): void
    {
        DB::transaction(function () use ($review) {
            $review->clearFiles(Review::COLLECTION_IMAGES);
            $review->delete();
        });
    }

    public function approve(Review $review): void
    {
        $review->approve(Auth::id());
    }

    public function reject(Review $review): void
    {
        $review->reject();
    }

    public function vote(Review $review, string $type): void
    {
        $review->vote($type, Auth::id());
    }

    public function report(Review $review, string $reason, ?string $details = null): void
    {
        $review->report(Auth::id(), $reason, $details);
    }

    protected function verifyPurchase(Model $reviewable): bool
    {
        if (!$reviewable instanceof Product) {
            return false;
        }

        return Order::where('user_id', Auth::id())
            ->whereHas('items', function ($query) use ($reviewable) {
                $query->where('product_id', $reviewable->id);
            })
            ->where('status', 'completed')
            ->exists();
    }
} 