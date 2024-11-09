<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

final class Option extends Model
{
    protected $fillable = [
        'key',
        'value',
        'group',
        'autoload',
    ];

    protected $casts = [
        'autoload' => 'boolean',
        'value' => 'json',
    ];

    protected function value(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value)
        );
    }
} 