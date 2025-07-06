<?php

declare(strict_types=1);

namespace Modules\Product\app\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

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

            // Store product-specific attributes
            if (!empty($data['attributes'])) {
                foreach ($data['attributes'] as $index => $attribute) {
                    $product->specificAttributes()->create([
                    'name' => $attribute['name'],
                    'values' => $attribute['values'],
                    'is_variation' => $attribute['variation'] ?? true,
                    'sort_order' => $index,
                ]);
                }
            }

            // Handle variations with files
            if (!empty($data['variations'])) {
                foreach ($data['variations'] as $variation) {
                    // Debug log before creating variant
                    Log::info('Processing variation:', ['variation' => $variation]);

                    // Create variant first
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
                        'attributes' => collect($variation)
                            ->only(array_column($data['attributes'] ?? [], 'name'))
                            ->filter()
                            ->toArray()
                    ]);

                    // Handle thumbnail for the variant
                    if (!empty($variation['thumbnail'])) {
                        Log::info('Processing variation thumbnail', [
                            'variation_id' => $variant->id,
                            'thumbnail' => $variation['thumbnail']
                        ]);

                        // If thumbnail is an array with file data
                        if (is_array($variation['thumbnail']) && isset($variation['thumbnail']['id'])) {
                            $variant->handleFile($variation['thumbnail'], ProductVariant::COLLECTION_THUMBNAIL);
                        }
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

            // Handle categories
            if (isset($data['categories'])) {
                $categoryData = collect($data['categories'])->mapWithKeys(function ($categoryId, $index) {
                    return [$categoryId => ['sort_order' => $index]];
                })->all();

                $product->categories()->sync($categoryData);
            }

            // Handle product-specific attributes
            if (isset($data['attributes'])) {
                // First, remove attributes that are no longer present
                $product->specificAttributes()
                    ->whereNotIn('name', collect($data['attributes'])->pluck('name'))
                    ->delete();

                // Update or create attributes
                foreach ($data['attributes'] as $index => $attribute) {
                    $product->specificAttributes()->updateOrCreate(
                        ['name' => $attribute['name']],
                        [
                            'values' => $attribute['values'],
                            'is_variation' => $attribute['variation'] ?? true,
                            'sort_order' => $index,
                        ]
                    );
                }
            }
            // Handle variations - FIXED VERSION
            if (isset($data['variations'])) {
                // Get existing variations
                $existingVariants = $product->variants()->get()->keyBy('id');
                $submittedVariationIds = collect($data['variations'])
                    ->filter(function ($variation) {
                        return !empty($variation['id']);
                    })
                    ->pluck('id')
                    ->toArray();

                // Delete variations that are no longer present
                $product->variants()
                    ->whereNotIn('id', $submittedVariationIds)
                    ->delete();

                foreach ($data['variations'] as $variation) {
                    $variantData = [
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
                        'attributes' => collect($variation)
                            ->only(array_column($data['attributes'] ?? [], 'name'))
                            ->filter()
                            ->toArray()
                    ];

                    $variant = $existingVariants->get($variation['id']);
                    if ($variant) {
                        // Update existing variation
                        
                            $variant->update($variantData);

                            // Handle thumbnail update - FIXED LOGIC
                            // Only process thumbnail if it's explicitly provided and different
                            if (isset($variation['thumbnail'])) {
                                if (empty($variation['thumbnail'])) {
                                    // Remove thumbnail if explicitly set to empty
                                    $variant->clearFiles(ProductVariant::COLLECTION_THUMBNAIL);
                                } elseif (is_array($variation['thumbnail']) && !empty($variation['thumbnail']['id'])) {
                                    // Update thumbnail only if new file is provided
                                    $variant->handleFile($variation['thumbnail'], ProductVariant::COLLECTION_THUMBNAIL);
                                }
                                // If thumbnail is not empty but not an array with id, keep existing thumbnail
                            }
                    } else {
                        // Create new variation
                        $variant = $product->variants()->create($variantData);

                        // Handle thumbnail for new variation
                        if (!empty($variation['thumbnail']) && is_array($variation['thumbnail'])) {
                            $variant->handleFile($variation['thumbnail'], ProductVariant::COLLECTION_THUMBNAIL);
                        }
                    }
                }
            }

            // Handle product files - FIXED VERSION
            // Only update files if they are explicitly provided
            if (isset($data['thumbnail'])) {
                if (empty($data['thumbnail'])) {
                    $product->clearFiles(Product::COLLECTION_THUMBNAIL);
                } elseif (is_array($data['thumbnail']) && !empty($data['thumbnail']['id'])) {
                    $product->handleFile($data['thumbnail'], Product::COLLECTION_THUMBNAIL);
                }
                // If thumbnail is not empty but not a valid array, keep existing thumbnail
            }
            // If thumbnail key doesn't exist in data, keep existing thumbnail

            if (isset($data['gallery'])) {
                if (empty($data['gallery'])) {
                    $product->clearFiles(Product::COLLECTION_GALLERY);
                } elseif (is_array($data['gallery']) && !empty($data['gallery'])) {
                    $product->handleFile($data['gallery'], Product::COLLECTION_GALLERY);
                }
                // If gallery is not empty but not a valid array, keep existing gallery
            }
            // If gallery key doesn't exist in data, keep existing gallery

            return $product->fresh(['categories', 'variants', 'specificAttributes']);
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