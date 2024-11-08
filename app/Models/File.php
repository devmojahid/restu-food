<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class File extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'uuid',
        'original_name',
        'filename',
        'path',
        'disk',
        'mime_type',
        'size',
        'fileable_type',
        'fileable_id',
        'collection',
        'order',
        'user_id'
    ];

    protected $appends = ['url'];

    protected static function booted(): void
    {
        static::creating(function ($file) {
            $file->uuid = (string) Str::uuid();
        });

        static::deleting(function ($file) {
            if ($file->isForceDeleting()) {
                Storage::disk($file->disk)->delete($file->path);
            }
        });
    }

    public function fileable()
    {
        return $this->morphTo();
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function getSizeForHumans(): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $size = $this->size;
        $i = 0;

        while ($size >= 1024 && $i < 4) {
            $size /= 1024;
            $i++;
        }

        return round($size, 2) . ' ' . $units[$i];
    }
}
