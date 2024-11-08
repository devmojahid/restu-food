<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\File;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

trait HasFiles
{
    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable')->orderBy('order');
    }

    /**
     * Get files by collection
     */
    public function filesByCollection(string $collection): MorphMany
    {
        return $this->files()->where('collection', $collection);
    }

    /**
     * Get a single file from a collection
     */
    public function getFile(string $collection): ?File
    {
        $file = $this->filesByCollection($collection)->latest()->first();
        return $file ? $this->addUrlToFile($file) : null;
    }

    /**
     * Get all files from a collection
     */
    public function getFiles(string $collection): Collection
    {
        return $this->filesByCollection($collection)
            ->get()
            ->map(fn ($file) => $this->addUrlToFile($file));
    }

    /**
     * Attach a file to the model with transaction
     */
    public function attachFile(mixed $file, ?string $collection = null): ?File
    {
        if (!$file) return null;

        try {
            DB::beginTransaction();

            $fileId = is_array($file) ? ($file['uuid'] ?? null) : ($file->uuid ?? null);
            if (!$fileId) {
                throw new \Exception('File UUID is required');
            }

            $fileModel = File::where('uuid', $fileId)->first();
            if (!$fileModel) {
                throw new \Exception('File not found');
            }

            // First detach any existing files in this collection if it's a single file collection
            if ($collection && !$this->isMultipleFileCollection($collection)) {
                $this->filesByCollection($collection)->update([
                    'fileable_type' => null,
                    'fileable_id' => null
                ]);
            }

            // Update file relationship
            $fileModel->update([
                'fileable_type' => get_class($this),
                'fileable_id' => $this->id,
                'collection' => $collection ?? $fileModel->collection
            ]);

            DB::commit();
            return $this->addUrlToFile($fileModel->fresh());
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('File attachment failed', [
                'model' => get_class($this),
                'model_id' => $this->id,
                'file_uuid' => $fileId ?? null,
                'collection' => $collection,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Sync files for a collection with transaction
     */
    public function syncFiles(array $files, string $collection): void
    {
        try {
            DB::beginTransaction();

            // First detach all existing files in this collection
            $this->filesByCollection($collection)->update([
                'fileable_type' => null,
                'fileable_id' => null
            ]);

            // Attach new files
            foreach ($files as $index => $file) {
                if (empty($file['uuid'])) continue;
                
                $fileModel = File::where('uuid', $file['uuid'])->first();
                if (!$fileModel) continue;

                $fileModel->update([
                    'fileable_type' => get_class($this),
                    'fileable_id' => $this->id,
                    'collection' => $collection,
                    'order' => $index
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('File sync failed', [
                'model' => get_class($this),
                'model_id' => $this->id,
                'collection' => $collection,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Remove all files from a collection with transaction
     */
    public function clearFiles(string $collection): void
    {
        try {
            DB::beginTransaction();

            // Instead of deleting, just detach the files
            $this->filesByCollection($collection)->update([
                'fileable_type' => null,
                'fileable_id' => null
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('File clearing failed', [
                'model' => get_class($this),
                'model_id' => $this->id,
                'collection' => $collection,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Check if collection allows multiple files
     */
    protected function isMultipleFileCollection(string $collection): bool
    {
        $multipleCollections = [
            'images',
            'videos',
            'attachments',
            'gallery'
        ];

        return in_array($collection, $multipleCollections);
    }

    /**
     * Add URL to file model
     */
    protected function addUrlToFile(File $file): File
    {
        if ($file->disk && $file->path) {
            $file->url = Storage::disk($file->disk)->url($file->path);
        }
        return $file;
    }

    /**
     * Boot the trait
     */
    protected static function bootHasFiles(): void
    {
        static::deleting(function ($model) {
            // Detach all files when model is deleted
            $model->files()->update([
                'fileable_type' => null,
                'fileable_id' => null
            ]);
        });
    }
}
