<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class SystemUpdate extends Model
{
    protected $fillable = [
        'version',
        'release_type',
        'description',
        'changelog',
        'download_url',
        'package_hash',
        'package_size',
        'requirements',
        'is_critical',
        'released_at',
    ];

    protected $casts = [
        'changelog' => 'array',
        'requirements' => 'array',
        'is_critical' => 'boolean',
        'released_at' => 'datetime',
        'package_size' => 'integer',
    ];

    public function logs(): HasMany
    {
        return $this->hasMany(SystemUpdateLog::class);
    }

    public function getFormattedSize(): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $size = $this->package_size;
        $unit = 0;

        while ($size >= 1024 && $unit < count($units) - 1) {
            $size /= 1024;
            $unit++;
        }

        return round($size, 2) . ' ' . $units[$unit];
    }
} 