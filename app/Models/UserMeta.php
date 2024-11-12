<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class UserMeta extends Model
{
    protected $table = 'user_meta';
    protected $fillable = [
        'user_id',
        'meta_key',
        'meta_value'
    ];

    protected $casts = [
        'meta_value' => 'json'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 