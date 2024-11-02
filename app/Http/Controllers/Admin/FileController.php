<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Services\Admin\FileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

final class FileController extends Controller
{
    public function __construct(
        private readonly FileService $fileService
    ) {}

    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:5120', // 5MB max
            'collection' => 'nullable|string',
        ]);

        try {
            $file = $this->fileService->upload(
                $request->file('file'),
                $request->input('collection')
            );

            return response()->json([
                'success' => true,
                'file' => [
                    'id' => $file->id,
                    'uuid' => $file->uuid,
                    'original_name' => $file->original_name,
                    'filename' => $file->filename,
                    'mime_type' => $file->mime_type,
                    'size' => $file->size,
                    'collection' => $file->collection,
                    'url' => Storage::disk($file->disk)->url($file->path),
                    'created_at' => $file->created_at
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'File upload failed: ' . $e->getMessage()
            ], 422);
        }
    }

    public function destroy(File $file)
    {
        try {
            $this->fileService->delete($file);
            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete file: ' . $e->getMessage()
            ], 422);
        }
    }
}
