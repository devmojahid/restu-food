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
use Illuminate\Support\Facades\Log;

final class ProductAddonController extends Controller
{
    public function __construct(
        private readonly ProductAddonService $addonService
    ) {}

    public function index(): Response
    {
        $query = ProductAddon::query()
            ->with(['restaurant', 'categories' => function ($query) {
                $query->where('type', 'addon')
                      ->select('categories.id', 'categories.name');
            }])
            ->select([
                'product_addons.id',
                'product_addons.name',
                'product_addons.price',
                'product_addons.stock_status',
                'product_addons.is_active',
                'product_addons.restaurant_id',
                'product_addons.created_at'
            ])
            ->when(!Auth::user()->hasRole('Admin'), function ($query) {
                $query->where(function($q) {
                    $q->where('product_addons.user_id', Auth::id())
                      ->orWhere('product_addons.restaurant_id', Auth::user()->restaurant_id);
                });
            })
            ->groupBy('product_addons.id')
            ->latest('product_addons.created_at');

        $addons = $query->paginate(10)
            ->through(fn ($addon) => [
                'id' => $addon->id,
                'name' => $addon->name,
                'price' => $addon->price,
                'stock_status' => $addon->stock_status,
                'is_active' => $addon->is_active,
                'restaurant' => $addon->restaurant ? [
                    'id' => $addon->restaurant->id,
                    'name' => $addon->restaurant->name,
                ] : null,
                'categories' => $addon->categories->map(fn ($cat) => [
                    'id' => $cat->id,
                    'name' => $cat->name,
                ]),
                'thumbnail' => $addon->thumbnail,
                'created_at' => $addon->created_at,
            ]);

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
            'user_id' => Auth::user()->id,
            'restaurant_id' => Auth::user()->restaurant_id,
        ]);

        $this->addonService->store($data);

        return redirect()
            ->route('app.products.addons.index')
            ->with('success', 'Add-on created successfully.');
    }

    public function update(ProductAddonRequest $request, ProductAddon $addon): RedirectResponse
    {
        try {
            $data = $request->validated();
            
            // Handle boolean values properly
            $data['is_active'] = $request->boolean('is_active');
            
            $this->addonService->update($addon, $data);

            return redirect()
                ->route('app.products.addons.index')
                ->with('success', 'Add-on updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update addon', [
                'addon_id' => $addon->id,
                'error' => $e->getMessage()
            ]);

            return back()
                ->withErrors(['error' => 'Failed to update add-on. Please try again.'])
                ->withInput();
        }
    }

    public function destroy(ProductAddon $addon): RedirectResponse
    {
        $addon->delete();

        return redirect()
            ->route('app.products.addons.index')
            ->with('success', 'Add-on deleted successfully.');
    }

    public function bulkAction(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => ['required', 'array'],
                'ids.*' => ['exists:product_addons,id'],
                'action' => ['required', 'string', 'in:delete,activate,deactivate'],
            ]);

            match ($validated['action']) {
                'delete' => $this->addonService->bulkDelete($validated['ids']),
                'activate' => $this->addonService->bulkUpdateStatus($validated['ids'], true),
                'deactivate' => $this->addonService->bulkUpdateStatus($validated['ids'], false),
                default => throw new \InvalidArgumentException('Invalid action')
            };

            return back()->with('success', 'Bulk action completed successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to perform bulk action', [
                'error' => $e->getMessage()
            ]);

            return back()->withErrors(['error' => 'Failed to perform bulk action. Please try again.']);
        }
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