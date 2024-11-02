<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\File;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;
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
    public function attachFile($file, ?string $collection = null): ?File
    {
        try {
            if (!isset($file->uuid)) {
                throw new \InvalidArgumentException('File UUID is required');
            }

            $fileModel = File::where('uuid', $file->uuid)->first();

            if (!$fileModel) {
                Log::error('File not found', [
                    'uuid' => $file->uuid,
                    'collection' => $collection,
                    'model' => get_class($this),
                    'model_id' => $this->id
                ]);
                return null;
            }

            // Use transaction for data integrity
            \DB::beginTransaction();

            // Update file relationship
            $fileModel->forceFill([
                'fileable_type' => get_class($this),
                'fileable_id' => $this->id,
                'collection' => $collection ?? $fileModel->collection
            ])->save();

            \DB::commit();

            return $fileModel->fresh();
        } catch (\Exception $e) {
            \DB::rollBack();
            Log::error('File attachment failed', [
                'error' => $e->getMessage(),
                'model_id' => $this->id,
                'model_type' => get_class($this),
                'file_uuid' => $file->uuid ?? null,
                'collection' => $collection
            ]);
            throw $e;
        }
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
        try {
            // Start transaction
            \DB::beginTransaction();

            // Remove old files from this collection
            $this->removeFiles($collection);

            // Add new files
            foreach ($files as $index => $file) {
                if (!empty($file['uuid'])) {
                    $fileModel = File::where('uuid', $file['uuid'])->first();

                    if ($fileModel) {
                        // Update file relationship and order
                        $fileModel->forceFill([
                            'fileable_type' => get_class($this),
                            'fileable_id' => $this->id,
                            'collection' => $collection,
                            'order' => $index
                        ])->save();
                    } else {
                        \Log::warning('File not found during sync', [
                            'uuid' => $file['uuid'],
                            'collection' => $collection,
                            'model' => get_class($this),
                            'model_id' => $this->id
                        ]);
                    }
                }
            }

            \DB::commit();
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('File sync failed', [
                'error' => $e->getMessage(),
                'collection' => $collection,
                'model' => get_class($this),
                'model_id' => $this->id,
                'files' => $files
            ]);
            throw $e;
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
        try {
            $files = $this->files()->where('collection', $collection)->get();

            foreach ($files as $file) {
                // Delete physical file if it exists
                if ($file->disk && $file->path) {
                    try {
                        Storage::disk($file->disk)->delete($file->path);
                    } catch (\Exception $e) {
                        \Log::warning("Failed to delete physical file: {$e->getMessage()}", [
                            'file_id' => $file->id,
                            'path' => $file->path,
                            'disk' => $file->disk
                        ]);
                    }
                }

                // Delete database record
                $file->delete();
            }
        } catch (\Exception $e) {
            \Log::error('Failed to remove files from collection', [
                'error' => $e->getMessage(),
                'collection' => $collection,
                'model' => get_class($this),
                'model_id' => $this->id
            ]);
            throw $e;
        }
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
        try {
            \DB::beginTransaction();

            $attachedFiles = collect();

            foreach ($files as $index => $file) {
                if (!empty($file['uuid'])) {
                    $fileModel = File::where('uuid', $file['uuid'])->first();

                    if ($fileModel) {
                        $fileModel->forceFill([
                            'fileable_type' => get_class($this),
                            'fileable_id' => $this->id,
                            'collection' => $collection,
                            'order' => $index
                        ])->save();

                        $attachedFiles->push($fileModel);
                    }
                }
            }

            \DB::commit();
            return $attachedFiles;
        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Failed to attach multiple files', [
                'error' => $e->getMessage(),
                'collection' => $collection,
                'model' => get_class($this),
                'model_id' => $this->id
            ]);
            throw $e;
        }
    }
}
