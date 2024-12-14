<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
class ActivityLog extends Model
{
    protected $fillable = [
        'log_name',
        'description',
        'causer_type',
        'causer_id',
        'subject_type',
        'subject_id',
        'properties',
    ];

    public function causer(): MorphTo
    {
        return $this->morphTo();
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    public function getCauserTypeAttribute($value): string
    {
        return class_basename($value);
    }
}
