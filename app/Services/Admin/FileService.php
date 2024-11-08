<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

final class FileService
{
    private const ALLOWED_MIME_TYPES = [
        'image' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        'video' => ['video/mp4', 'video/webm', 'video/ogg'],
        'document' => [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
    ];

    public function __construct(
        private readonly string $disk = 'public',
        private readonly int $maxFileSize = 10485760 // 10MB
    ) {}

    public function upload(
        UploadedFile $file, 
        ?string $collection = null,
        ?string $type = null
    ): File {
        try {
            // Validate file
            $this->validateFile($file, $type);

            // Generate unique filename
            $filename = $this->generateUniqueFilename($file);
            
            // Store file
            $path = $this->storeFile($file, $filename);

            // Create file record
            return File::create([
                'original_name' => $file->getClientOriginalName(),
                'filename' => $filename,
                'path' => $path,
                'disk' => $this->disk,
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'collection' => $collection,
                'user_id' => auth()->id(),
                'meta' => [
                    'type' => $type,
                    'extension' => $file->getClientOriginalExtension(),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('File upload failed', [
                'error' => $e->getMessage(),
                'file' => $file->getClientOriginalName(),
                'collection' => $collection
            ]);
            throw $e;
        }
    }

    public function delete(File $file): bool
    {
        try {
            DB::beginTransaction();

            // Remove file from storage
            if (Storage::disk($file->disk)->exists($file->path)) {
                Storage::disk($file->disk)->delete($file->path);
            }

            // Delete the file record
            $deleted = $file->delete();

            DB::commit();
            return $deleted;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('File deletion failed', [
                'file_id' => $file->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    private function validateFile(UploadedFile $file, ?string $type = null): void
    {
        if ($file->getSize() > $this->maxFileSize) {
            throw new \Exception('File size exceeds maximum limit');
        }

        if ($type && isset(self::ALLOWED_MIME_TYPES[$type])) {
            if (!in_array($file->getMimeType(), self::ALLOWED_MIME_TYPES[$type])) {
                throw new \Exception('Invalid file type');
            }
        }
    }

    private function generateUniqueFilename(UploadedFile $file): string
    {
        return Str::uuid() . '.' . $file->getClientOriginalExtension();
    }

    private function storeFile(UploadedFile $file, string $filename): string
    {
        $path = $file->storeAs(
            'uploads/' . date('Y/m/d'),
            $filename,
            ['disk' => $this->disk]
        );

        if (!$path) {
            throw new \Exception('Failed to store file');
        }

        return $path;
    }

    public function getPublicUrl(File $file): string
    {
        return Storage::disk($file->disk)->url($file->path);
    }
}