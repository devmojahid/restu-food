<?php

declare(strict_types=1);

namespace Modules\Blog\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Blog\Http\Requests\BlogRequest;
use App\Models\Blog;
use Modules\Blog\Services\BlogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use App\Models\Category;

final class BlogController extends Controller
{
    public function __construct(
        private readonly BlogService $blogService
    ) {}

    public function index(Request $request): Response
    {
        $filters = $this->getFilters($request);
        $blogs = $this->blogService->getPaginated($filters);

        return Inertia::module('Blog::Index', [
            'blogs' => $blogs,
            'filters' => $filters,
        ]);
    }

    private function getFilters(Request $request): array
    {
        return [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'date_range' => $request->input('date_range'),
            'sort' => $request->input('sort', 'created_at'),
            'direction' => $request->input('direction', 'desc'),
            'per_page' => $request->input('per_page', 10),
        ];
    }

    public function store(BlogRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->user()->id;

            $blog = $this->blogService->store($data, [
                Blog::COLLECTION_THUMBNAIL => $request->input('thumbnail'),
                Blog::COLLECTION_FEATURED => $request->input('featured_image'),
                Blog::COLLECTION_IMAGES => $request->input('images'),
                Blog::COLLECTION_VIDEOS => $request->input('videos'),
                Blog::COLLECTION_ATTACHMENTS => $request->input('attachments')
            ]);
            
            return redirect()
                ->route('app.blogs.edit', $blog)
                ->with(['success' => 'Blog created successfully']);
        } catch (\Exception $e) {
            return $this->handleError($e, 'Error creating blog');
        }
    }

    private function handleError(\Exception $e, string $message): RedirectResponse
    {
        Log::error($message, [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return redirect()
            ->back()
            ->withInput()
            ->with('error', "{$message}: " . $e->getMessage());
    }

    public function create(): Response
    {
        $categories = Category::select(['id', 'name', 'slug', 'parent_id'])
            ->where('type', 'blog')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->with(['parent:id,name'])
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'parent' => $category->parent ? [
                    'id' => $category->parent->id,
                    'name' => $category->parent->name
                ] : null
            ])
            ->values()
            ->all();

        return Inertia::module('Blog::Create', [
            'categories' => $categories
        ]);
    }

    public function edit(int $id): Response
    {
        try {
            $blog = $this->blogService->findOrFail($id, ['user', 'files']);

            // Transform blog data with organized file collections
            $blogData = [
                ...$blog->toArray(),
                'thumbnail' => $blog->getFile(Blog::COLLECTION_THUMBNAIL),
                'featured_image' => $blog->getFile(Blog::COLLECTION_FEATURED),
                'images' => $blog->getFiles(Blog::COLLECTION_IMAGES),
                'videos' => $blog->getFiles(Blog::COLLECTION_VIDEOS),
                'attachments' => $blog->getFiles(Blog::COLLECTION_ATTACHMENTS),
            ];

            return Inertia::module('Blog::Edit', [
                'blog' => $blogData,
                'maxFiles' => [
                    'thumbnail' => 1,
                    'featured_image' => 1,
                    'images' => 10,
                    'videos' => 5,
                    'attachments' => 20,
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()
                ->route('app.blogs.index')
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Blog not found or error loading blog: ' . $e->getMessage()
                ]);
        }
    }

    public function update(BlogRequest $request, int $id): RedirectResponse
    {
        try {
            $data = $request->validated();

            // Properly structure files data
            $data['files'] = array_filter([
                'thumbnail' => $request->input('thumbnail'),
                'featured_image' => $request->input('featured_image'),
                'images' => $request->input('images', []),
                'videos' => $request->input('videos', []),
                'attachments' => $request->input('attachments', [])
            ]);

            $this->blogService->update($id, $data);

            return redirect()
                ->back()
                ->with('success', 'Blog updated successfully.');
        } catch (\Exception $e) {
            Log::error('Blog update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $data ?? null
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Error updating blog: ' . $e->getMessage());
        }
    }

    public function destroy(int $id): RedirectResponse
    {
        try {
            $this->blogService->delete($id);
            return redirect()
                ->route('app.blogs.index')
                ->with('success', 'Blog deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting blog: ' . $e->getMessage());
        }
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:blogs,id'
            ]);

            $this->blogService->bulkDelete($validated['ids']);

            return back()->with('success', 'Selected blogs deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Error deleting blogs: ' . $e->getMessage());
        }
    }

    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:blogs,id',
                'status' => 'required|boolean'
            ]);

            $this->blogService->bulkUpdateStatus($validated['ids'], $validated['status']);

            return back()->with('success', 'Blog status updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Error updating status: ' . $e->getMessage());
        }
    }

    public function preview(int $id): Response
    {
        $blog = $this->blogService->findOrFail($id);
        return Inertia::module('Blog::Preview', [
            'blog' => $blog
        ]);
    }
}
