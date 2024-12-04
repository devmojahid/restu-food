<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KitchenStaffStatusHistory extends Model
{
    protected $fillable = [
        'kitchen_staff_inquiry_id',
        'status',
        'comment',
        'user_id',
    ];

    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(KitchenStaffInquiry::class, 'kitchen_staff_inquiry_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 