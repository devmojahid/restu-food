<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\BlogResource;
use App\Http\Requests\BlogRequest;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\BlogsExport;
use App\Imports\BlogsImport;
use App\Services\Admin\BlogService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class BlogController extends Controller
{
    protected $blogService;

    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }

    public function index(Request $request)
    {
        if ($request->isMethod('post')) {
            try {
                $result = $this->blogService->handleFiltering($request->all());
                return response()->json($result);
            } catch (\Exception $e) {
                Log::error('Blog filtering failed: ' . $e->getMessage());
                return response()->json([
                    'error' => 'Failed to filter blogs: ' . $e->getMessage()
                ], 500);
            }
        }

        return $this->renderBlogList();
    }

    protected function renderBlogList()
    {
        $blogs = $this->blogService->getAllPaginated();

        return Inertia::render('Backend/Blogs/List/index', [
            'blogs' => $blogs,
            'filters' => [
                'search' => '',
                'perPage' => 10,
                'page' => 1,
                'sort' => '',
                'direction' => '',
                'filters' => [],
            ],
        ]);
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:blogs,id'
        ]);

        Blog::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Selected blogs deleted successfully');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Blogs/Create/index');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BlogRequest $request)
    {
        $blog = $this->blogService->create($request->validated());

        return redirect()
            ->route('admin.blogs.index')
            ->with('success', 'Blog created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id)
    {
        $blog = new BlogResource(
            $this->blogService->find($id)
        );

        return Inertia::render('Backend/Blogs/Edit', [
            'blog' => $blog
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BlogRequest $request, int $id)
    {
        $this->blogService->update($id, $request->validated());

        return redirect()
            ->route('admin.blogs.index')
            ->with('success', 'Blog updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->blogService->delete($id);

        return redirect()
            ->route('admin.blogs.index')
            ->with('success', 'Blog deleted successfully.');
    }

    public function toggleStatus(int $id)
    {
        $blog = Blog::findOrFail($id);
        $blog->update([
            'is_published' => !$blog->is_published,
            'published_at' => !$blog->is_published ? now() : null,
        ]);

        return back()->with('success', 'Blog status updated successfully');
    }

    public function export(Request $request)
    {
        $request->validate([
            'format' => 'required|in:csv,xlsx,pdf'
        ]);

        $blogs = Blog::with('user')->get();

        // Handle different export formats
        switch ($request->format) {
            case 'csv':
                return Excel::download(new BlogsExport($blogs), 'blogs.csv');
            case 'xlsx':
                return Excel::download(new BlogsExport($blogs), 'blogs.xlsx');
            case 'pdf':
                return PDF::loadView('exports.blogs', ['blogs' => $blogs])
                    ->download('blogs.pdf');
        }
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,xlsx'
        ]);

        try {
            Excel::import(new BlogsImport, $request->file('file'));
            return back()->with('success', 'Blogs imported successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Import failed: ' . $e->getMessage());
        }
    }
}
