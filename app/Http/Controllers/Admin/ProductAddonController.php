<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductAddonRequest;
use App\Models\ProductAddon;
use App\Models\Category;
use App\Services\Admin\ProductAddonService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

final class ProductAddonController extends Controller
{
    public function __construct(
        private readonly ProductAddonService $addonService
    ) {}

    public function index(): Response
    {
        $query = ProductAddon::with(['restaurant', 'categories'])
            ->when(!Auth::user()->hasRole('Admin'), function ($query) {
                $query->where(function($q) {
                    $q->where('user_id', Auth::id())
                      ->orWhere('restaurant_id', Auth::user()->restaurant_id);
                });
            })
            ->latest();

        $addons = $query->paginate(10);

        return Inertia::render('Admin/Products/Addons/Index', [
            'addons' => $addons,
            'categories' => Category::select(['id', 'name'])
                ->where('type', 'addon')
                ->when(!Auth::user()->hasRole('Admin'), function ($query) {
                    $query->where(function($q) {
                        $q->where('user_id', Auth::id())
                          ->orWhere('restaurant_id', Auth::user()->restaurant_id);
                    });
                })
                ->orderBy('name')
                ->get(),
            'can' => [
                'create' => Auth::user()->hasAnyRole(['Admin', 'Restaurant']),
                'edit' => Auth::user()->hasAnyRole(['Admin', 'Restaurant']),
                'delete' => Auth::user()->hasAnyRole(['Admin', 'Restaurant']),
            ]
        ]);
    }

    public function store(ProductAddonRequest $request): RedirectResponse
    {
        $data = array_merge($request->validated(), [
            'user_id' => Auth::id(),
            'restaurant_id' => Auth::user()->restaurant_id,
        ]);

        $this->addonService->store($data);

        return redirect()
            ->route('app.products.addons.index')
            ->with('success', 'Add-on created successfully.');
    }

    public function update(ProductAddonRequest $request, ProductAddon $addon): RedirectResponse
    {
        $this->authorize('update', $addon);

        $this->addonService->update($addon, $request->validated());

        return redirect()
            ->route('app.products.addons.index')
            ->with('success', 'Add-on updated successfully.');
    }

    public function destroy(ProductAddon $addon): RedirectResponse
    {
        $this->authorize('delete', $addon);

        $addon->delete();

        return redirect()
            ->route('app.products.addons.index')
            ->with('success', 'Add-on deleted successfully.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:product_addons,id'],
            'action' => ['required', 'string', 'in:delete,activate,deactivate'],
        ]);

        match ($validated['action']) {
            'delete' => $this->addonService->bulkDelete($validated['ids']),
            'activate' => $this->addonService->bulkUpdateStatus($validated['ids'], true),
            'deactivate' => $this->addonService->bulkUpdateStatus($validated['ids'], false),
        };

        return back()->with('success', 'Bulk action completed successfully.');
    }

    public function updateOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:product_addon_categories,id'],
            'addons' => ['required', 'array'],
            'addons.*' => ['exists:product_addons,id'],
        ]);

        $this->addonService->updateAddonOrder(
            $validated['category_id'],
            $validated['addons']
        );

        return back()->with('success', 'Order updated successfully.');
    }
} 