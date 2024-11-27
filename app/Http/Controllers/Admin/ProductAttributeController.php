<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductAttributeRequest;
use App\Models\ProductAttribute;
use App\Services\Admin\ProductAttributeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductAttributesExport;
use App\Imports\ProductAttributesImport;


final class ProductAttributeController extends Controller
{
    public function __construct(
        private readonly ProductAttributeService $attributeService
    ) {
        // $this->middleware('permission:currency.list')->only(['index', 'show']);
        // $this->middleware('auth');
        // $this->middleware('permission:product-attributes.create')->only(['create', 'store']);
        // $this->middleware('permission:product-attributes.edit')->only(['edit', 'update', 'updateStatus', 'updateOrder', 'bulkUpdateStatus']);
        // $this->middleware('permission:product-attributes.delete')->only(['destroy', 'bulkDelete']);
    }

    public function index(): Response
    {
        $attributes = ProductAttribute::with(['values'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(10);

        return Inertia::render('Admin/ProductAttributes/Index', [
            'attributes' => $attributes,
            'filters' => request()->all('search', 'type', 'status'),
            'can' => [
                'create' => Auth::user()->can('product-attributes.create'),
                'edit' => Auth::user()->can('product-attributes.edit'),
                'delete' => Auth::user()->can('product-attributes.delete'),
            ],
        ]);
    }

    public function show(ProductAttribute $attribute): Response
    {
        return Inertia::render('Admin/ProductAttributes/Show', [
            'attribute' => $attribute->load('values'),
            'can' => [
                'edit' => Auth::user()->can('product-attributes.edit'),
                'delete' => Auth::user()->can('product-attributes.delete'),
            ],
        ]);
    }

    public function store(ProductAttributeRequest $request): RedirectResponse
    {
        $this->attributeService->store($request->validated());

        return redirect()
            ->route('app.product-attributes.index')
            ->with('success', 'Product attribute created successfully.');
    }

    public function edit(ProductAttribute $attribute): Response
    {
        return Inertia::render('Admin/ProductAttributes/Edit', [
            'attribute' => $attribute->load('values'),
            'can' => [
                'edit' => Auth::user()->can('product-attributes.edit'),
                'delete' => Auth::user()->can('product-attributes.delete'),
            ],
        ]);
    }

    public function update(ProductAttributeRequest $request, ProductAttribute $attribute): RedirectResponse
    {
        $this->attributeService->update($attribute, $request->validated());

        return redirect()
            ->route('app.product-attributes.index')
            ->with('success', 'Product attribute updated successfully.');
    }

    public function destroy(ProductAttribute $attribute): RedirectResponse
    {
        $this->attributeService->delete($attribute);

        return redirect()
            ->route('app.product-attributes.index')
            ->with('success', 'Product attribute deleted successfully.');
    }

    public function updateOrder(Request $request): RedirectResponse
    {
        $this->attributeService->updateOrder($request->get('order', []));

        return redirect()
            ->route('app.product-attributes.index')
            ->with('success', 'Attribute order updated successfully.');
    }

    public function updateStatus(Request $request, ProductAttribute $attribute): RedirectResponse
    {
        $attribute->update(['is_visible' => $request->boolean('is_visible')]);

        return back()->with('success', 'Attribute status updated successfully.');
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        $this->attributeService->bulkDelete($request->get('ids', []));

        return redirect()
            ->route('app.product-attributes.index')
            ->with('success', 'Selected attributes deleted successfully.');
    }

    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        $this->attributeService->bulkUpdateStatus(
            $request->get('ids', []),
            $request->boolean('is_visible')
        );

        return redirect()
            ->route('app.product-attributes.index')
            ->with('success', 'Selected attributes updated successfully.');
    }

    public function getValues(ProductAttribute $attribute): JsonResponse
    {
        return response()->json([
            'values' => $attribute->values()->orderBy('sort_order')->get()
        ]);
    }

    public function updateValues(Request $request, ProductAttribute $attribute): RedirectResponse
    {
        $this->attributeService->updateValues($attribute, $request->get('values', []));

        return back()->with('success', 'Attribute values updated successfully.');
    }

    public function export(): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        return Excel::download(new ProductAttributesExport, 'product-attributes.xlsx');
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,csv'],
        ]);

        Excel::import(new ProductAttributesImport, $request->file('file'));

        return redirect()
            ->route('app.product-attributes.index')
            ->with('success', 'Attributes imported successfully.');
    }
} 