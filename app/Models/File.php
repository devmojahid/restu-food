<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    use HasFactory;

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
    ];

    protected $casts = [
        'meta' => 'array',
        'size' => 'integer',
        'order' => 'integer',
    ];

    protected static function booted()
    {
        static::creating(function ($file) {
            $file->uuid = (string) Str::uuid();
        });
    }

    /**
     * Get the owning fileable model (product, user, etc.).
     */
    public function fileable()
    {
        return $this->morphTo();
    }

    public function getUrlAttribute()
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function getFullPathAttribute()
    {
        return Storage::disk($this->disk)->path($this->path);
    }

    public function getSizeForHumansAttribute()
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get the user who uploaded the file.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
