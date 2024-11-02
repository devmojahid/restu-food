<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class File extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'original_name',
        'filename',
        'path',
        'disk',
        'mime_type',
        'size',
        'fileable_type',
        'fileable_id',
        'collection',
        'meta',
        'order',
        'user_id'
    ];

    protected $casts = [
        'meta' => 'array',
        'size' => 'integer',
        'order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function ($file) {
            $file->uuid = (string) Str::uuid();
        });

        static::deleting(function ($file) {
            Storage::disk($file->disk)->delete($file->path);
        });
    }

    public function fileable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Helper methods
    public function getUrl(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function getFullPath(): string
    {
        return Storage::disk($this->disk)->path($this->path);
    }

    public function getSizeForHumans(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
