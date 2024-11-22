<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\File;
use App\Services\Admin\FileService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

trait HandlesFiles
{
    /**
     * Get a single file from a collection
     */
    public function getFileFrom(string $collection): ?File
    {
        return $this->getFile($collection);
    }

    /**
     * Get multiple files from a collection
     */
    public function getFilesFrom(string $collection): Collection
    {
        return $this->getFiles($collection);
    }

    /**
     * Handle file upload and attachment in one go
     */
    public function uploadAndAttach(UploadedFile $file, string $collection): ?File
    {
        $fileService = app(FileService::class);
        $uploadedFile = $fileService->upload($file, $collection);
        
        return $this->attachFile($uploadedFile, $collection);
    }

    /**
     * Handle multiple file uploads and attachments
     */
    public function uploadAndAttachMany(array $files, string $collection): Collection
    {
        $fileService = app(FileService::class);
        $uploadedFiles = collect();

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $uploadedFile = $fileService->upload($file, $collection);
                $uploadedFiles->push($uploadedFile);
            }
        }

        $this->syncFiles($uploadedFiles->toArray(), $collection);
        return $uploadedFiles;
    }

    /**
     * Smart file handler - detects type and handles accordingly
     */
    public function handleFiles(array $filesData): void
    {
        foreach ($filesData as $collection => $fileData) {
            $this->handleFile($fileData, $collection);
        }
    }

    /**
     * Handle a single file or collection of files
     */
    public function handleFile(mixed $fileData, string $collection): void
    {
        if (empty($fileData)) {
            $this->clearFiles($collection);
            return;
        }

        // Handle uploaded files
        if ($fileData instanceof UploadedFile) {
            $this->uploadAndAttach($fileData, $collection);
            return;
        }

        // Handle array of uploaded files
        if (is_array($fileData) && isset($fileData[0]) && $fileData[0] instanceof UploadedFile) {
            $this->uploadAndAttachMany($fileData, $collection);
            return;
        }

        // Handle existing files
        if (!isset($fileData[0])) {
            $this->attachFile($fileData, $collection);
        } else {
            $this->syncFiles($fileData, $collection);
        }
    }

    /**
     * Magic getter for file collections
     */
    public function __get($key)
    {
        if (defined(static::class . '::COLLECTION_' . strtoupper($key))) {
            $collection = constant(static::class . '::COLLECTION_' . strtoupper($key));
            return $this->getFileFrom($collection);
        }

        return parent::__get($key);
    }
} 