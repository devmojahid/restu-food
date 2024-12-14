<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class SystemUpdateLog extends Model
{
    protected $fillable = [
        'system_update_id',
        'status',
        'step',
        'message',
        'details',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'details' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function systemUpdate(): BelongsTo
    {
        return $this->belongsTo(SystemUpdate::class, 'system_update_id');
    }
} 