<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ProductAttribute;
use App\Models\ProductAttributeValue;
use Illuminate\Database\Seeder;

final class ProductAttributeSeeder extends Seeder
{
    public function run(): void
    {
        $attributes = [
            [
                'name' => 'Size',
                'type' => 'select',
                'values' => [
                    ['value' => 'Small', 'label' => 'S'],
                    ['value' => 'Medium', 'label' => 'M'],
                    ['value' => 'Large', 'label' => 'L'],
                    ['value' => 'Extra Large', 'label' => 'XL'],
                    ['value' => '2X Large', 'label' => '2XL'],
                ],
            ],
            [
                'name' => 'Color',
                'type' => 'color',
                'values' => [
                    ['value' => 'Red', 'color_code' => '#FF0000'],
                    ['value' => 'Blue', 'color_code' => '#0000FF'],
                    ['value' => 'Green', 'color_code' => '#00FF00'],
                    ['value' => 'Black', 'color_code' => '#000000'],
                    ['value' => 'White', 'color_code' => '#FFFFFF'],
                ],
            ],
            [
                'name' => 'Material',
                'type' => 'select',
                'values' => [
                    ['value' => 'Cotton'],
                    ['value' => 'Polyester'],
                    ['value' => 'Wool'],
                    ['value' => 'Silk'],
                    ['value' => 'Linen'],
                ],
            ],
            [
                'name' => 'Style',
                'type' => 'select',
                'values' => [
                    ['value' => 'Casual'],
                    ['value' => 'Formal'],
                    ['value' => 'Sport'],
                    ['value' => 'Business'],
                ],
            ],
        ];

        foreach ($attributes as $index => $attributeData) {
            $attribute = ProductAttribute::create([
                'name' => $attributeData['name'],
                'type' => $attributeData['type'],
                'is_global' => true,
                'is_visible' => true,
                'is_variation' => true,
                'sort_order' => $index,
            ]);

            foreach ($attributeData['values'] as $valueIndex => $valueData) {
                ProductAttributeValue::create([
                    'attribute_id' => $attribute->id,
                    'value' => $valueData['value'],
                    'label' => $valueData['label'] ?? null,
                    'color_code' => $valueData['color_code'] ?? null,
                    'sort_order' => $valueIndex,
                ]);
            }
        }
    }
} 