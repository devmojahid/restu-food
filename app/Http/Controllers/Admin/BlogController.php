<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\BlogRequest;
use App\Services\Admin\BlogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

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

        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $this->blogService->getPaginated($filters),
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

            $this->blogService->store($data);

            return redirect()
                ->route('admin.blogs.index')
                ->with('success', 'Blog created successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Error creating blog: ' . $e->getMessage());
        }
    }

    public function edit(int $id): Response
    {
        return Inertia::render('Admin/Blogs/Edit', [
            'blog' => $this->blogService->findOrFail($id)
        ]);
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
                ->route('admin.blogs.index')
                ->with('success', 'Blog updated successfully.');
        } catch (\Exception $e) {
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
                ->route('admin.blogs.index')
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
}
