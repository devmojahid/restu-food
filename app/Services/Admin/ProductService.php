<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

final class ProductService
{
    public function store(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            // Create the product
            $product = Product::create([
                ...$data,
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'sku' => $data['sku'] ?? $this->generateSku($data['name']),
            ]);

            // Handle file uploads
            $this->handleProductFiles($product, $data);

            // Handle categories
            if (isset($data['categories'])) {
                $categoryData = collect($data['categories'])->mapWithKeys(function ($categoryId, $index) {
                    return [$categoryId => ['sort_order' => $index]];
                })->all();
                
                $product->categories()->attach($categoryData);
            }

            // Handle variations with files
            if (!empty($data['variations'])) {
                foreach ($data['variations'] as $variation) {
                    $variant = $product->variants()->create([
                        'sku' => $variation['sku'] ?? $product->generateVariantSku($variation['attributes'] ?? []),
                        'price' => $variation['price'] ?? 0,
                        'sale_price' => $variation['sale_price'] ?? null,
                        'stock' => $variation['stock'] ?? 0,
                        'enabled' => $variation['enabled'] ?? true,
                        'virtual' => $variation['virtual'] ?? false,
                        'downloadable' => $variation['downloadable'] ?? false,
                        'manage_stock' => $variation['manage_stock'] ?? true,
                        'stock_status' => ($variation['stock'] ?? 0) > 0 ? 'instock' : 'outofstock',
                        'weight' => $variation['weight'] ?? null,
                        'length' => $variation['dimensions']['length'] ?? null,
                        'width' => $variation['dimensions']['width'] ?? null,
                        'height' => $variation['dimensions']['height'] ?? null,
                        'description' => $variation['description'] ?? null,
                    ]);

                    // Handle variation image
                    dd($variation);
                    if (!empty($variation['thumbnail'])) {
                        $variant->handleFile($variation['thumbnail'], ProductVariant::COLLECTION_THUMBNAIL);
                    }
                }
            }

            return $product->fresh();
        });
    }

    public function update(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            // Update basic product info
            $product->update([
                ...$data,
                'slug' => $data['slug'] ?? Str::slug($data['name']),
            ]);

            // Handle file updates
            $this->handleProductFiles($product, $data);

            // Update variants with files
            if (isset($data['variants'])) {
                foreach ($data['variants'] as $variantData) {
                    $variant = $product->variants()->updateOrCreate(
                        ['id' => $variantData['id'] ?? null],
                        array_except($variantData, ['image'])
                    );

                    // Handle variation image
                    if (isset($variantData['image'])) {
                        $variant->handleFile($variantData['image'], ProductVariant::COLLECTION_THUMBNAIL);
                    }
                }
            }

            // Sync categories
            if (isset($data['categories'])) {
                $product->categories()->sync($data['categories']);
            }

            // Update specifications
            if (isset($data['specifications'])) {
                $syncData = collect($data['specifications'])
                    ->mapWithKeys(fn ($value, $specId) => [$specId => ['value' => $value]]);
                $product->specifications()->sync($syncData);
            }

            // Update metadata
            if (isset($data['metadata'])) {
                foreach ($data['metadata'] as $key => $value) {
                    $product->setMeta($key, $value);
                }
            }

            return $product->fresh();
        });
    }

    private function generateSku(string $name): string
    {
        $prefix = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $name), 0, 3));
        $timestamp = now()->format('YmdHis');
        $random = strtoupper(Str::random(3));
        
        return "{$prefix}{$timestamp}{$random}";
    }

    public function updateStock(Product $product, int $quantity, string $operation = 'subtract'): void
    {
        DB::transaction(function () use ($product, $quantity, $operation) {
            $product->updateStock($quantity, $operation);

            // Log stock movement
            $product->setMeta('last_stock_update', [
                'quantity' => $quantity,
                'operation' => $operation,
                'previous_quantity' => $product->getOriginal('stock_quantity'),
                'new_quantity' => $product->stock_quantity,
                'timestamp' => now(),
                'user_id' => Auth::id() ?? null,
            ]);
        });
    }

    public function applySalePrice(
        Product $product,
        float $salePrice,
        ?\DateTime $startDate = null,
        ?\DateTime $endDate = null
    ): void {
        $product->update([
            'discounted_price' => $salePrice,
            'sale_price_from' => $startDate,
            'sale_price_to' => $endDate,
        ]);
    }

    /**
     * Handle product file uploads and updates
     */
    private function handleProductFiles(Product $product, array $data): void
    {
        // Handle product files
        $files = array_filter([
            Product::COLLECTION_THUMBNAIL => $data['thumbnail'] ?? null,
            Product::COLLECTION_GALLERY => $data['gallery'] ?? null,
        ]);

        if (!empty($files)) {
            $product->handleFiles($files);
        }

        // Handle variation files
        if (!empty($data['variations'])) {
            foreach ($data['variations'] as $variation) {
                if (empty($variation['id'])) continue;

                $variant = $product->variants()->find($variation['id']);
                if (!$variant) continue;

                if (isset($variation['thumbnail'])) {
                    $variant->handleFile(
                        $variation['thumbnail'], 
                        ProductVariant::COLLECTION_THUMBNAIL
                    );
                }
            }
        }
    }
} 