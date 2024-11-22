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
use Illuminate\Support\Facades\Log;
use App\Http\Requests\Admin\UpdateStockRequest;
use App\Http\Requests\Admin\ApplySaleRequest;

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

        $categories = Category::select(['id', 'name', 'slug', 'parent_id'])
                ->where('type', 'product')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->with(['parent:id,name'])
                ->get()
                ->map(fn ($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'parent' => $category->parent ? [
                        'id' => $category->parent->id,
                        'name' => $category->parent->name
                        ] : null
                ])
            ->values()
            ->all();

        $restaurants = Restaurant::select(['id', 'name'])
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Products/Create', [
            'restaurants' => $restaurants,
            'categories' => $categories,
            'globalAttributes' => $globalAttributes,
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            
            // Handle file uploads
            $data['thumbnail'] = $request->input('thumbnail');
            $data['gallery'] = $request->input('gallery');
            
            // Handle variation files
            if (!empty($data['variations'])) {
                foreach ($data['variations'] as &$variation) {
                    $variation['thumbnail'] = $variation['thumbnail'] ?? null;
                }
            }

            $product = $this->productService->store($data);

            return redirect()
                ->route('app.products.edit', $product)
                ->with('success', 'Product created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', 'Error creating product: ' . $e->getMessage());
        }
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
            ->route('app.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()
            ->route('app.products.index')
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