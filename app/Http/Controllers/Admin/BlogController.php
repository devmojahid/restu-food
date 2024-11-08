<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\BlogRequest;
use App\Models\Blog;
use App\Services\Admin\BlogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

final class BlogController extends Controller
{
    public function __construct(
        private readonly BlogService $blogService
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'per_page' => $request->input('per_page', 10),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
        ];

        $blogs = $this->blogService->getPaginated($filters);

        // Transform the blogs data to include thumbnail URLs
        $blogs->through(function ($blog) {
            $blog->thumbnail = $blog->getFile(Blog::COLLECTION_THUMBNAIL);
            return $blog;
        });

        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $blogs,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Blogs/Create');
    }

    public function store(BlogRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->id();
            $data['files'] = [
                'thumbnail' => $request->input('thumbnail'),
                'images' => $request->input('images', []),
                'videos' => $request->input('videos', []),
                'attachments' => $request->input('attachments', [])
            ];

            $blog = $this->blogService->store($data);

            return redirect()
                ->route('app.blogs.edit', $blog)
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Blog created successfully. You can now continue editing.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error creating blog: ' . $e->getMessage()
                ]);
        }
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

            return Inertia::render('Admin/Blogs/Edit', [
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
            $data['files'] = [
                'thumbnail' => $request->input('thumbnail'),
                'featured_image' => $request->input('featured_image'),
                'images' => $request->input('images', []),
                'videos' => $request->input('videos', []),
                'attachments' => $request->input('attachments', [])
            ];

            $this->blogService->update($id, $data);

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Blog updated successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error updating blog: ' . $e->getMessage()
                ]);
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
        return Inertia::render('Admin/Blogs/Preview', [
            'blog' => $blog
        ]);
    }
}
