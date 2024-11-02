<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\File;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;

trait FileManager
{
    public function files()
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function addFile($file, string $collection): File
    {
        // Find the temporary file by UUID
        $fileModel = File::where('uuid', $file->uuid)->firstOrFail();

        // Update it with blog relationship
        $fileModel->update([
            'fileable_type' => get_class($this),
            'fileable_id' => $this->id,
            'collection' => $collection
        ]);

        return $fileModel->fresh();
    }



    public function attachExistingFile($file, string $collection): File
    {
        $fileModel = File::where('uuid', $file->uuid)->firstOrFail();

        $fileModel->update([
            'fileable_type' => get_class($this),
            'fileable_id' => $this->id,
            'collection' => $collection
        ]);

        return $fileModel->fresh();
    }

    public function getFiles(string $collection = 'default'): Collection
    {
        return $this->files()
            ->where('collection', $collection)
            ->orderBy('order')
            ->get()
            ->map(function ($file) {
                $file->url = Storage::disk($file->disk)->url($file->path);
                return $file;
            });
    }

    public function getFile(string $collection = 'default'): ?File
    {
        $file = $this->files()
            ->where('collection', $collection)
            ->latest()
            ->first();

        if ($file) {
            $file->url = Storage::disk($file->disk)->url($file->path);
        }

        return $file;
    }

    public function syncFiles(array $files, string $collection = 'default'): void
    {
        // Remove old files
        $this->files()->where('collection', $collection)->delete();

        // Add new files
        foreach ($files as $index => $file) {
            if (!empty($file['uuid'])) {
                $fileModel = $this->addFile((object)$file, $collection);
                $fileModel->update(['order' => $index]);
            }
        }
    }
}
