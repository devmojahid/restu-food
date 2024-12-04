<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class DeliveryStaffInquiryStatusHistory extends Model
{
    protected $fillable = [
        'delivery_staff_inquiry_id',
        'status',
        'comment',
        'user_id',
    ];

    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(DeliveryStaffInquiry::class, 'delivery_staff_inquiry_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 