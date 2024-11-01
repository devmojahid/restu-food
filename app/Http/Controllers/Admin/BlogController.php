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
use Illuminate\Database\Eloquent\Builder;

class BlogController extends Controller
{
    protected $blogService;

    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }

    public function index(Request $request)
    {
        $query = Blog::query();

        // Handle sorting
        // if ($sort = $request->get('sort')) {
        //     [$column, $direction] = explode('.', $sort);
        //     if (in_array($column, ['name', 'category', 'price', 'created_at'])) {
        //         $query->orderBy($column, $direction === 'desc' ? 'desc' : 'asc');
        //     }
        // }

        // // Handle filtering
        // if ($filters = json_decode($request->get('filters'), true)) {
        //     $query->where(function (Builder $query) use ($filters) {
        //         foreach ($filters as $filter) {
        //             if (!isset($filter['id']) || !isset($filter['value'])) {
        //                 continue;
        //             }

        //             $column = $filter['id'];
        //             $value = $filter['value'];

        //             if (is_array($value)) {
        //                 $query->whereIn($column, $value);
        //             } else {
        //                 $query->where($column, 'like', "%{$value}%");
        //             }
        //         }
        //     });
        // }

        // // Handle pagination
        // $perPage = (int) $request->get('perPage', 10);
        // $foods = $query->paginate($perPage);

        // return Inertia::render('Foods/Index', [
        //     'foods' => $foods->items(),
        //     'pageCount' => $foods->lastPage(),
        //     'filters' => $request->only(['sort', 'filters'])
        // ]);
        return Inertia::render('Admin/Blogs/Index');
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
        return Inertia::render('Admin/Blogs/Create');
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
