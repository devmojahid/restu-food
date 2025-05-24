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
use Illuminate\Support\Facades\Log;

final class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService
    ) {}

    // Fixed Category Controller
    public function index(Request $request): Response
    {
        try {
            // Validate and clean filters
            $filters = $this->validateAndCleanFilters($request);
            
            // Get paginated categories
            $categories = $this->categoryService->getPaginated($filters);
            
            // Build comprehensive meta information
            $meta = $this->buildMetaInformation($categories);
            
            // Handle polling configuration
            $this->configurePolling($request, $filters);
            
            // Handle prefetching for next page
            $this->configurePrefetching($categories, $filters);

            return Inertia::render('Admin/Categories/Index', [
                'categories' => $categories, // This should match the prop name in your component
                'filters' => $filters,
                'meta' => $meta,
                'parentCategories' => fn () => $this->categoryService->getParentCategories($filters['type']),
                'stats' => fn () => $this->categoryService->getStats($filters['type']), // Lazy loading
                'can' => [
                    'create' => Auth::user()?->can('category.create'),
                    'edit' => Auth::user()?->can('category.edit'),
                    'delete' => Auth::user()?->can('category.delete'),
                    'manage' => Auth::user()?->can('manage.categories'),
                ],
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error in CategoryController@index', [
                'error' => $e->getMessage(),
                'filters' => $request->all()
            ]);
            
            // Return empty state on error
            return Inertia::render('Admin/Categories/Index', [
                'categories' => collect(),
                'filters' => [],
                'meta' => $this->getEmptyMeta(),
                'parentCategories' => [],
                'stats' => [],
                'error' => 'Failed to load categories data',
                'can' => [
                    'create' => false,
                    'edit' => false,
                    'delete' => false,
                    'manage' => false,
                ],
            ]);
        }
    }

    /**
     * Validate and clean request filters
     */
    private function validateAndCleanFilters(Request $request): array
    {
        $allowedSorts = ['name', 'sort_order', 'created_at', 'updated_at', 'blogs_count'];
        $allowedDirections = ['asc', 'desc'];
        $allowedTypes = ['blog', 'product', 'news', 'page']; // Add your allowed types
        
        return array_filter([
            'search' => $request->input('search'),
            'type' => in_array($request->input('type', 'blog'), $allowedTypes) ? $request->input('type', 'blog') : 'blog',
            'per_page' => min(max((int) $request->input('per_page', 10), 1), 100), // Limit between 1-100
            'sort' => in_array($request->input('sort'), $allowedSorts) ? $request->input('sort') : 'sort_order',
            'direction' => in_array($request->input('direction'), $allowedDirections) ? $request->input('direction') : 'asc',
            'is_active' => $request->has('is_active') ? $request->boolean('is_active') : null,
            'parent_id' => $request->input('parent_id'),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
            'page' => max((int) $request->input('page', 1), 1),
        ], function ($value) {
            return $value !== null && $value !== '' && $value !== 0;
        });
    }

    /**
     * Build comprehensive meta information
     */
    private function buildMetaInformation($categories): array
    {
        return [
            'hasMorePages' => $categories->hasMorePages(),
            'currentPage' => $categories->currentPage(),
            'lastPage' => $categories->lastPage(),
            'total' => $categories->total(),
            'from' => $categories->firstItem(),
            'to' => $categories->lastItem(),
            'perPage' => $categories->perPage(),
            'lastUpdated' => now()->toIso8601String(),
            'cacheControl' => 'private, max-age=60',
            'links' => [
                'first' => $categories->url(1),
                'last' => $categories->url($categories->lastPage()),
                'prev' => $categories->previousPageUrl(),
                'next' => $categories->nextPageUrl(),
            ]
        ];
    }

    /**
     * Get empty meta for error states
     */
    private function getEmptyMeta(): array
    {
        return [
            'hasMorePages' => false,
            'currentPage' => 1,
            'lastPage' => 1,
            'total' => 0,
            'from' => null,
            'to' => null,
            'perPage' => 10,
            'lastUpdated' => now()->toIso8601String(),
            'cacheControl' => 'no-cache',
            'links' => []
        ];
    }

    /**
     * Configure polling for real-time updates
     */
    private function configurePolling(Request $request, array $filters): void
    {
        $pollingInterval = $request->input('polling');
        
        if ($pollingInterval && is_numeric($pollingInterval) && $pollingInterval >= 5000) {
            Inertia::share('polling', [
                'interval' => (int) $pollingInterval,
                'endpoint' => route('app.categories.index', array_merge($filters, ['only' => 'categories,meta'])),
                'enabled' => true
            ]);
        }
    }

    /**
     * Configure prefetching for better performance
     */
    private function configurePrefetching($categories, array $filters): void
    {
        if ($categories->hasMorePages()) {
            Inertia::share('prefetch', [
                'next_page' => route('app.categories.index', array_merge($filters, [
                    'page' => $categories->currentPage() + 1,
                    'only' => 'categories,meta'
                ]))
            ]);
        }
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
                ->withErrors(['error' => 'Failed to category.delete: ' . $e->getMessage()]);
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
