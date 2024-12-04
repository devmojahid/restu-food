<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductAddonCategory;
use App\Services\Admin\ProductAddonService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;

final class ProductAddonCategoryController extends Controller
{
    public function __construct(
        private readonly ProductAddonService $addonService
    ) {
        $this->middleware(['auth', 'role:Admin|Restaurant']);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_required' => ['boolean'],
            'min_selections' => ['required', 'integer', 'min:0'],
            'max_selections' => ['required', 'integer', 'min:1'],
            'addons' => ['nullable', 'array'],
            'addons.*' => ['exists:product_addons,id'],
        ]);

        $data = array_merge($validated, [
            'user_id' => Auth::id(),
            'restaurant_id' => Auth::user()->restaurant_id,
        ]);

        $this->addonService->createCategory($data);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, ProductAddonCategory $category): RedirectResponse
    {
        if (!Auth::user()->hasRole('Admin') && 
            $category->user_id !== Auth::id() && 
            $category->restaurant_id !== Auth::user()->restaurant_id
        ) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_required' => ['boolean'],
            'min_selections' => ['required', 'integer', 'min:0'],
            'max_selections' => ['required', 'integer', 'min:1'],
            'addons' => ['nullable', 'array'],
            'addons.*' => ['exists:product_addons,id'],
        ]);

        $this->addonService->updateCategory($category, $validated);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(ProductAddonCategory $category): RedirectResponse
    {
        if (!Auth::user()->hasRole('Admin') && 
            $category->user_id !== Auth::id() && 
            $category->restaurant_id !== Auth::user()->restaurant_id
        ) {
            abort(403);
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }

    public function updateOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'categories' => ['required', 'array'],
            'categories.*' => ['exists:product_addon_categories,id'],
        ]);

        $this->addonService->updateCategoryOrder($validated['categories']);

        return back()->with('success', 'Order updated successfully.');
    }
} 