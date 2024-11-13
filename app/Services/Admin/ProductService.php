<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

final class ProductService
{
    public function create(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            // Create the product
            $product = Product::create([
                ...$data,
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'sku' => $data['sku'] ?? $this->generateSku($data['name']),
            ]);

            // Attach categories
            if (isset($data['categories'])) {
                $product->categories()->attach($data['categories']);
            }

            // Create variants
            if (isset($data['variants'])) {
                $product->variants()->createMany($data['variants']);
            }

            // Add specifications
            if (isset($data['specifications'])) {
                foreach ($data['specifications'] as $specId => $value) {
                    $product->specifications()->attach($specId, ['value' => $value]);
                }
            }

            // Set metadata
            if (isset($data['metadata'])) {
                foreach ($data['metadata'] as $key => $value) {
                    $product->setMeta($key, $value);
                }
            }

            return $product;
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

            // Sync categories
            if (isset($data['categories'])) {
                $product->categories()->sync($data['categories']);
            }

            // Update variants
            if (isset($data['variants'])) {
                // Delete removed variants
                $variantIds = collect($data['variants'])->pluck('id')->filter();
                $product->variants()->whereNotIn('id', $variantIds)->delete();

                // Update or create variants
                foreach ($data['variants'] as $variant) {
                    $product->variants()->updateOrCreate(
                        ['id' => $variant['id'] ?? null],
                        $variant
                    );
                }
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
} 