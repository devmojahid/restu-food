<?php

declare(strict_types=1);

namespace App\Traits;

use App\Models\File;

trait HasSimpleFiles
{
    /**
     * Simple file getter - returns single file
     */
    public function file(string $collection): ?File
    {
        return $this->getFile($collection);
    }

    /**
     * Simple files getter - returns multiple files
     */
    public function files(string $collection): array
    {
        return $this->getFiles($collection)->toArray();
    }

    /**
     * Simple file setter - handles both single and multiple files
     */
    public function setFile(mixed $files, string $collection): void
    {
        if (empty($files)) {
            $this->clearFiles($collection);
            return;
        }

        if (!isset($files[0])) {
            $this->attachFile($files, $collection);
            return;
        }

        $this->syncFiles($files, $collection);
    }

    /**
     * Magic getter for file collections
     * Example: $model->thumbnail, $model->gallery
     */
    public function __get($key)
    {
        // Check if the key is a defined file collection
        if (defined(static::class . '::COLLECTION_' . strtoupper($key))) {
            $collection = constant(static::class . '::COLLECTION_' . strtoupper($key));
            return $this->file($collection);
        }

        return parent::__get($key);
    }
} 