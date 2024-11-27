<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

trait HasCoupons
{
    public function coupons(): BelongsToMany
    {
        return $this->belongsToMany(Coupon::class, 'coupon_usage')
            ->withTimestamps()
            ->withPivot('order_id', 'discount_amount');
    }

    public function applyCoupon(Coupon $coupon, float $orderAmount): float
    {
        if (!$coupon->isValid()) {
            throw new \Exception('This coupon is not valid.');
        }

        if (!$coupon->canBeUsedByUser($this)) {
            throw new \Exception('You are not eligible to use this coupon.');
        }

        if ($coupon->min_order_value && $orderAmount < $coupon->min_order_value) {
            throw new \Exception("Minimum order amount of {$coupon->min_order_value} required.");
        }

        return $coupon->calculateDiscount($orderAmount);
    }

    public function hasCouponUsage(Coupon $coupon): bool
    {
        return $this->coupons()
            ->where('coupon_id', $coupon->id)
            ->exists();
    }

    public function getCouponUsageCount(Coupon $coupon): int
    {
        return $this->coupons()
            ->where('coupon_id', $coupon->id)
            ->count();
    }
} 