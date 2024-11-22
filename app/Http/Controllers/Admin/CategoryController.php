<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use App\Services\Admin\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

final class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService
    ) {}

    public function index(Request $request): Response
    {
        $type = $request->input('type', 'blog');

        $filters = [
            'search' => $request->input('search'),
            'type' => $type,
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : null,
            'parent_id' => $request->input('parent_id'),
            'per_page' => $request->input('per_page', 10),
        ];

        // Get categories with relationships
        $categories = $this->categoryService->getPaginated($filters);
        // Load counts and files
        $categories->each(function ($category) {
            $category->loadCount('blogs');
            $category->load('files');
        });

        $categoriesData = [
            'data' => $categories->items(),
            'meta' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
                'from' => $categories->firstItem() ?? 0,
                'to' => $categories->lastItem() ?? 0,
            ],
        ];

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categoriesData,
            'filters' => $filters,
            'parentCategories' => $this->categoryService->getParentCategories($type),
            'stats' => [
                'total' => Category::count(),
                'active' => Category::where('is_active', true)->count(),
                'inactive' => Category::where('is_active', false)->count(),
                'root' => Category::whereNull('parent_id')->count(),
            ],
            'can' => [
                'create' => Auth::user()?->can('create categories'),
                'edit' => Auth::user()?->can('edit categories'),
                'delete' => Auth::user()?->can('delete categories'),
                'manage' => Auth::user()?->can('manage categories'),
            ],
        ]);
    }

    public function store(CategoryRequest $request): RedirectResponse
    {
        try {
            $this->categoryService->store($request->validated());

            return redirect()
                ->back()
                ->with('success', 'Category created successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to create category: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        try {
            $this->categoryService->update($category->id, $request->validated());

            return redirect()
                ->back()
                ->with('success', 'Category updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update category: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(Category $category): RedirectResponse
    {
        try {
            $this->categoryService->delete($category->id);

            return redirect()
                ->back()
                ->with('success', 'Category deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete category: ' . $e->getMessage()]);
        }
    }

    public function reorder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => 'required|exists:categories,id',
            'order' => 'required|integer'
        ]);

        try {
            $this->categoryService->updateOrder($validated['id'], $validated['order']);

            return redirect()
                ->back()
                ->with('success', 'Category order updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update category order: ' . $e->getMessage()]);
        }
    }

    public function move(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        try {
            $this->categoryService->move($category->id, $validated['parent_id']);

            return redirect()
                ->back()
                ->with('success', 'Category moved successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to move category: ' . $e->getMessage()]);
        }
    }

    public function updateStatus(Request $request, Category $category): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'is_active' => 'required|boolean'
            ]);

            $this->categoryService->updateStatus($category->id, $validated['is_active']);

            return redirect()
                ->back()
                ->with('success', 'Category status updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update category status: ' . $e->getMessage()]);
        }
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id'
        ]);

        try {
            $this->categoryService->bulkDelete($validated['ids']);

            return redirect()
                ->back()
                ->with('success', 'Categories deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete categories: ' . $e->getMessage()]);
        }
    }

    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id',
            'is_active' => 'required|boolean'
        ]);

        try {
            $this->categoryService->bulkUpdateStatus($validated['ids'], $validated['is_active']);

            return redirect()
                ->back()
                ->with('success', 'Categories status updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update categories status: ' . $e->getMessage()]);
        }
    }
}
