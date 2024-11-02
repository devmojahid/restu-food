<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\File;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;

trait HasFiles
{
    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

    /**
     * Attach a file to the model
     */
    public function attachFile($file, ?string $collection = null): File
    {
        if (!isset($file->uuid)) {
            throw new \InvalidArgumentException('File UUID is required');
        }

        $fileModel = File::where('uuid', $file->uuid)->firstOrFail();

        $fileModel->update([
            'fileable_type' => get_class($this),
            'fileable_id' => $this->id,
            'collection' => $collection ?? $fileModel->collection
        ]);

        return $fileModel->fresh();
    }

    /**
     * Get all files for a specific collection
     */
    public function getFiles(string $collection = 'default'): Collection
    {
        return $this->files()
            ->where('collection', $collection)
            ->orderBy('order')
            ->get()
            ->map(function ($file) {
                return $this->addUrlToFile($file);
            });
    }

    /**
     * Get a single file from a collection
     */
    public function getFile(string $collection = 'default'): ?File
    {
        $file = $this->files()
            ->where('collection', $collection)
            ->latest()
            ->first();

        return $file ? $this->addUrlToFile($file) : null;
    }

    /**
     * Sync files for a collection
     */
    public function syncFiles(array $files, string $collection = 'default'): void
    {
        // Remove old files
        $this->files()->where('collection', $collection)->delete();

        // Add new files
        foreach ($files as $index => $file) {
            if (!empty($file['uuid'])) {
                $fileModel = $this->attachFile((object)$file, $collection);
                $fileModel->update(['order' => $index]);
            }
        }
    }

    /**
     * Update file order in a collection
     */
    public function updateFileOrder(string $collection, array $fileIds): void
    {
        foreach ($fileIds as $order => $fileId) {
            $this->files()
                ->where('collection', $collection)
                ->where('id', $fileId)
                ->update(['order' => $order]);
        }
    }

    /**
     * Get files by collection
     */
    public function getFilesByCollection(string $collection): MorphMany
    {
        return $this->files()->where('collection', $collection);
    }

    /**
     * Add URL to file model
     */
    protected function addUrlToFile(File $file): File
    {
        $file->url = Storage::disk($file->disk)->url($file->path);
        return $file;
    }

    /**
     * Remove files from a collection
     */
    public function removeFiles(string $collection): void
    {
        $this->files()->where('collection', $collection)->delete();
    }

    /**
     * Remove a specific file
     */
    public function removeFile(int $fileId): void
    {
        $this->files()->where('id', $fileId)->delete();
    }

    /**
     * Attach multiple files
     */
    public function attachFiles(array $files, string $collection): Collection
    {
        $attachedFiles = collect();
        foreach ($files as $index => $file) {
            if (!empty($file['uuid'])) {
                $fileModel = $this->attachFile((object)$file, $collection);
                $fileModel->update(['order' => $index]);
                $attachedFiles->push($fileModel);
            }
        }
        return $attachedFiles;
    }
}
