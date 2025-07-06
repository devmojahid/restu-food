<?php

declare(strict_types=1);

namespace Modules\Product\app\Services;

use App\Models\ProductAttribute;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

final class ProductAttributeService
{
    public function store(array $data): ProductAttribute
    {
        return DB::transaction(function () use ($data) {
            $attribute = ProductAttribute::create([
                'name' => $data['name'],
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'type' => $data['type'] ?? 'select',
                'is_global' => $data['is_global'] ?? true,
                'is_visible' => $data['is_visible'] ?? true,
                'is_variation' => $data['is_variation'] ?? true,
                'sort_order' => $data['sort_order'] ?? 0,
            ]);

            if (!empty($data['values'])) {
                $existingValues = collect();
                foreach ($data['values'] as $index => $valueData) {
                    $normalizedValue = Str::lower(trim($valueData['value']));
                    
                    // Skip if value already exists for this attribute
                    if ($existingValues->contains($normalizedValue)) {
                        continue;
                    }
                    
                    $existingValues->push($normalizedValue);
                    
                    $attribute->values()->create([
                        'value' => $valueData['value'],
                        'label' => $valueData['label'] ?? $valueData['value'],
                        'color_code' => $valueData['color_code'] ?? null,
                        'sort_order' => $index,
                    ]);
                }
            }

            return $attribute->load('values');
        });
    }

    public function update(ProductAttribute $attribute, array $data): ProductAttribute
    {
        return DB::transaction(function () use ($attribute, $data) {
            $attribute->update([
                'name' => $data['name'],
                'slug' => $data['slug'] ?? Str::slug($data['name']),
                'type' => $data['type'] ?? 'select',
                'is_global' => $data['is_global'] ?? true,
                'is_visible' => $data['is_visible'] ?? true,
                'is_variation' => $data['is_variation'] ?? true,
                'sort_order' => $data['sort_order'] ?? 0,
            ]);

            if (isset($data['values'])) {
                $existingIds = $attribute->values()->pluck('id')->toArray();
                $updatedIds = [];
                $existingValues = collect();

                foreach ($data['values'] as $index => $valueData) {
                    $normalizedValue = Str::lower(trim($valueData['value']));
                    
                    // Skip if value already exists for this attribute
                    if ($existingValues->contains($normalizedValue)) {
                        continue;
                    }
                    
                    $existingValues->push($normalizedValue);

                    if (isset($valueData['id'])) {
                        // Update existing value
                        $attribute->values()->where('id', $valueData['id'])->update([
                            'value' => $valueData['value'],
                            'label' => $valueData['label'] ?? $valueData['value'],
                            'color_code' => $valueData['color_code'] ?? null,
                            'sort_order' => $index,
                        ]);
                        $updatedIds[] = $valueData['id'];
                    } else {
                        // Create new value
                        try {
                            $value = $attribute->values()->create([
                                'value' => $valueData['value'],
                                'label' => $valueData['label'] ?? $valueData['value'],
                                'color_code' => $valueData['color_code'] ?? null,
                                'sort_order' => $index,
                            ]);
                            $updatedIds[] = $value->id;
                        } catch (\Illuminate\Database\QueryException $e) {
                            // Skip duplicate values
                            if ($e->getCode() !== '23000') { // If not a duplicate entry error
                                throw $e;
                            }
                        }
                    }
                }

                // Delete values that weren't updated or created
                $attribute->values()
                    ->whereIn('id', array_diff($existingIds, $updatedIds))
                    ->delete();
            }

            return $attribute->load('values');
        });
    }

    public function delete(ProductAttribute $attribute): bool
    {
        return DB::transaction(function () use ($attribute) {
            $attribute->values()->delete();
            return $attribute->delete();
        });
    }

    public function updateOrder(array $order): void
    {
        foreach ($order as $position => $id) {
            ProductAttribute::where('id', $id)->update(['sort_order' => $position]);
        }
    }

    public function bulkDelete(array $ids): void
    {
        DB::transaction(function () use ($ids) {
            ProductAttribute::whereIn('id', $ids)->each(function ($attribute) {
                $attribute->values()->delete();
                $attribute->delete();
            });
        });
    }

    public function bulkUpdateStatus(array $ids, bool $isVisible): void
    {
        ProductAttribute::whereIn('id', $ids)->update(['is_visible' => $isVisible]);
    }

    public function updateValues(ProductAttribute $attribute, array $values): void
    {
        DB::transaction(function () use ($attribute, $values) {
            // Delete existing values
            $attribute->values()->delete();

            // Create new values
            foreach ($values as $index => $value) {
                $attribute->values()->create([
                    'value' => $value['value'],
                    'label' => $value['label'] ?? $value['value'],
                    'color_code' => $value['color_code'] ?? null,
                    'sort_order' => $index,
                ]);
            }
        });
    }
} 