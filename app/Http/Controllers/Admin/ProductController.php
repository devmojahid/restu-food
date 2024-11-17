<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Restaurant;
use App\Models\SpecificationGroup;
use App\Models\ProductAttribute;
use App\Services\Admin\ProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {}

    public function index(): Response
    {
        $products = Product::with(['restaurant', 'categories'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    public function create(): Response
    {
        $globalAttributes = ProductAttribute::with(['values' => function($query) {
            $query->orderBy('sort_order');
        }])
        ->where('is_global', true)
        ->orderBy('sort_order')
        ->get()
        ->map(function ($attribute) {
            return [
                'id' => $attribute->id,
                'name' => $attribute->name,
                'type' => $attribute->type,
                'values' => $attribute->values->map(function ($value) {
                    return [
                        'id' => $value->id,
                        'value' => $value->value,
                        'label' => $value->label,
                        'color_code' => $value->color_code,
                    ];
                })->values()->all(),
            ];
        });

        // Debug the attributes
        \Log::info('Global Attributes:', ['attributes' => $globalAttributes]);

        return Inertia::render('Admin/Products/Create', [
            'restaurants' => Restaurant::select('id', 'name')->get(),
            'categories' => Category::select('id', 'name')->get(),
            'specificationGroups' => SpecificationGroup::with('specifications')->get(),
            'globalAttributes' => $globalAttributes,
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        $this->productService->create($request->validated());

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $product->load(['categories', 'variants', 'specifications', 'metadata']);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'restaurants' => Restaurant::select('id', 'name')->get(),
            'categories' => Category::select('id', 'name')->get(),
            'specificationGroups' => SpecificationGroup::with('specifications')->get(),
        ]);
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $this->productService->update($product, $request->validated());

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function updateStock(Product $product, UpdateStockRequest $request): RedirectResponse
    {
        $this->productService->updateStock(
            $product,
            $request->validated('quantity'),
            $request->validated('operation')
        );

        return back()->with('success', 'Stock updated successfully.');
    }

    public function applySale(Product $product, ApplySaleRequest $request): RedirectResponse
    {
        $this->productService->applySalePrice(
            $product,
            $request->validated('sale_price'),
            $request->validated('start_date'),
            $request->validated('end_date')
        );

        return back()->with('success', 'Sale price applied successfully.');
    }
} 