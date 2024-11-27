<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        
        return [
            'restaurant_id' => Restaurant::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'sku' => strtoupper(Str::random(8)),
            'description' => $this->faker->paragraphs(3, true),
            'short_description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 5, 100),
            'cost_per_item' => $this->faker->randomFloat(2, 1, 50),
            'discounted_price' => null,
            'sale_price_from' => null,
            'sale_price_to' => null,
            'nutritional_info' => [
                'calories' => $this->faker->numberBetween(100, 1000),
                'protein' => $this->faker->numberBetween(5, 50),
                'carbohydrates' => $this->faker->numberBetween(10, 100),
                'fat' => $this->faker->numberBetween(2, 30),
            ],
            'is_featured' => $this->faker->boolean(20),
            'is_taxable' => $this->faker->boolean(80),
            'tax_rate' => $this->faker->randomFloat(2, 0, 20),
            'status' => $this->faker->randomElement(['active', 'inactive', 'draft']),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'stock_status' => $this->faker->randomElement(['in_stock', 'out_of_stock', 'low_stock']),
            'weight' => $this->faker->randomFloat(2, 0.1, 10),
            'length' => $this->faker->randomFloat(2, 1, 50),
            'width' => $this->faker->randomFloat(2, 1, 50),
            'height' => $this->faker->randomFloat(2, 1, 50),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    public function onSale(): static
    {
        return $this->state(function (array $attributes) {
            $price = $attributes['price'] ?? $this->faker->randomFloat(2, 5, 100);
            $discountPercentage = $this->faker->numberBetween(10, 50);
            $discountedPrice = $price * (1 - ($discountPercentage / 100));

            return [
                'price' => $price,
                'discounted_price' => round($discountedPrice, 2),
                'sale_price_from' => now(),
                'sale_price_to' => now()->addDays($this->faker->numberBetween(1, 30)),
            ];
        });
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
            'stock_status' => 'out_of_stock',
        ]);
    }
} 