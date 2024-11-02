<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Blog;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\File;

final class BlogService extends BaseService
{
    protected string $model = Blog::class;
    protected string $cachePrefix = 'blogs:';
    protected array $searchableFields = ['title', 'content', 'slug'];
    protected array $filterableFields = ['is_published', 'user_id'];
    protected array $sortableFields = ['title', 'created_at', 'published_at'];
    protected array $relationships = ['user'];

    /**
     * Store a new blog
     */
    public function store(array $data): Blog
    {
        try {
            DB::beginTransaction();

            $blog = $this->model::create($data);

            if (!empty($data['files'])) {
                $this->handleFileUploads($blog, $data['files']);
            }

            DB::commit();
            $this->clearCache();

            return $blog;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Blog creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    /**
     * Update a blog
     */
    public function update(int $id, array $data): Blog
    {
        try {
            DB::beginTransaction();

            $blog = $this->findOrFail($id);
            $blog->update($data);

            if (!empty($data['files'])) {
                $this->handleFileUploads($blog, $data['files']);
            }

            DB::commit();
            $this->clearCache();

            return $blog->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Blog update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    /**
     * Handle file uploads for different collections
     */
    protected function handleFileUploads(Blog $blog, array $files): void
    {
        try {
            $collections = [
                'thumbnail' => Blog::COLLECTION_THUMBNAIL,
                'images' => Blog::COLLECTION_IMAGES,
                'videos' => Blog::COLLECTION_VIDEOS,
                'attachments' => Blog::COLLECTION_ATTACHMENTS
            ];

            foreach ($collections as $key => $collection) {
                if (!empty($files[$key])) {
                    // Handle single file uploads (like thumbnail)
                    if (is_array($files[$key]) && !isset($files[$key][0])) {
                        // Single file as associative array
                        if (!empty($files[$key]['uuid'])) {
                            // First delete existing files in this collection
                            $blog->files()->where('collection', $collection)->delete();
                            // Then attach the new file with explicit relationship data
                            $fileModel = File::where('uuid', $files[$key]['uuid'])->first();
                            if ($fileModel) {
                                $fileModel->update([
                                    'fileable_type' => get_class($blog),
                                    'fileable_id' => $blog->id,
                                    'collection' => $collection
                                ]);
                            }
                        }
                    }
                    // Handle multiple file uploads (like videos, images, attachments)
                    else if (is_array($files[$key])) {
                        foreach ($files[$key] as $index => $file) {
                            if (!empty($file['uuid'])) {
                                $fileModel = File::where('uuid', $file['uuid'])->first();
                                if ($fileModel) {
                                    $fileModel->update([
                                        'fileable_type' => get_class($blog),
                                        'fileable_id' => $blog->id,
                                        'collection' => $collection,
                                        'order' => $index
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('File upload handling failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'blog_id' => $blog->id,
                'files' => $files
            ]);
            throw $e;
        }
    }

    /**
     * Handle after create hook
     */
    protected function afterCreate(Model $model, array $data): void
    {
        if (!empty($data['files'])) {
            $this->handleFileUploads($model, $data['files']);
        }
    }

    /**
     * Handle after update hook
     */
    protected function afterUpdate(Model $model, array $data): void
    {
        if (!empty($data['files'])) {
            $this->handleFileUploads($model, $data['files']);
        }
    }

    /**
     * Handle before delete hook
     */
    protected function beforeDelete(Model $model): void
    {
        // Delete associated files
        $model->files()->delete();
    }

    /**
     * Update blog status
     */
    public function updateStatus(int $id, bool $status): Blog
    {
        $blog = $this->findOrFail($id);
        $blog->update([
            'is_published' => $status,
            'published_at' => $status ? now() : null
        ]);

        $this->clearCache();
        return $blog;
    }

    /**
     * Override bulkUpdateStatus to handle blog-specific status updates
     */
    public function bulkUpdateStatus(array $ids, bool $status, string $field = 'is_published'): bool
    {
        try {
            DB::beginTransaction();

            $this->model::whereIn('id', $ids)->update([
                $field => $status,
                'published_at' => $status ? now() : null
            ]);

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk status update failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Bulk delete blogs with their files
     */
    public function bulkDelete(array $ids): bool
    {
        try {
            DB::beginTransaction();

            $blogs = $this->model::whereIn('id', $ids)->get();
            foreach ($blogs as $blog) {
                $blog->files()->delete();
                $blog->delete();
            }

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk delete failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
