<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class SpecificationGroup extends Model
{
    protected $fillable = [
        'name',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function specifications(): HasMany
    {
        return $this->hasMany(Specification::class)->orderBy('sort_order');
    }
} 