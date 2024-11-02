<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

final class FileService
{
    public function __construct(
        private readonly string $disk = 'public'
    ) {}

    public function upload(UploadedFile $file, ?string $collection = null): File
    {
        try {
            // Generate unique filename
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            // Create relative path
            $relativePath = 'uploads/' . date('Y/m/d');

            // Store the file
            $path = $file->storeAs($relativePath, $filename, ['disk' => $this->disk]);

            if (!$path) {
                throw new \Exception('Failed to store file');
            }

            // Create file record
            $fileModel = File::create([
                'uuid' => Str::uuid(),
                'original_name' => $file->getClientOriginalName(),
                'filename' => $filename,
                'path' => $path,
                'disk' => $this->disk,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'collection' => $collection,
                'user_id' => auth()->id(),
            ]);

            // Add public URL to the response
            $fileModel->url = Storage::disk($this->disk)->url($path);

            return $fileModel;
        } catch (\Exception $e) {
            // Clean up if file was stored but record creation failed
            if (isset($path)) {
                Storage::disk($this->disk)->delete($path);
            }
            throw $e;
        }
    }

    public function delete(File $file): bool
    {
        try {
            // Delete physical file first
            if (Storage::disk($file->disk)->exists($file->path)) {
                Storage::disk($file->disk)->delete($file->path);
            }

            // Then delete database record
            return $file->delete();
        } catch (\Exception $e) {
            \Log::error('File deletion failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getPublicUrl(File $file): string
    {
        return Storage::disk($file->disk)->url($file->path);
    }
}