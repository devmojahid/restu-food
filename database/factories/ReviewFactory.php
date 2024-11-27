<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'reviewable_type' => Product::class,
            'reviewable_id' => Product::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'title' => $this->faker->sentence(),
            'comment' => $this->faker->paragraphs(2, true),
            'pros' => $this->faker->boolean(70) ? $this->faker->sentences(2, true) : null,
            'cons' => $this->faker->boolean(70) ? $this->faker->sentences(2, true) : null,
            'is_recommended' => $this->faker->boolean(80),
            'is_verified_purchase' => $this->faker->boolean(70),
            'is_approved' => $this->faker->boolean(60),
            'approved_at' => fn (array $attrs) => $attrs['is_approved'] ? now() : null,
            'approved_by' => fn (array $attrs) => $attrs['is_approved'] ? User::factory() : null,
            'status' => fn (array $attrs) => $attrs['is_approved'] ? 'approved' : $this->faker->randomElement(['pending', 'rejected']),
            'helpful_votes' => 0,
            'unhelpful_votes' => 0,
            'reported_count' => 0,
            'metadata' => [
                'browser' => $this->faker->userAgent(),
                'ip' => $this->faker->ipv4(),
                'platform' => $this->faker->randomElement(['Windows', 'MacOS', 'iOS', 'Android']),
            ],
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_approved' => true,
            'approved_at' => now(),
            'approved_by' => User::factory(),
            'status' => 'approved',
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_approved' => false,
            'status' => 'rejected',
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_approved' => false,
            'status' => 'pending',
        ]);
    }

    public function withVotes(int $helpful = 0, int $unhelpful = 0): static
    {
        return $this->state(fn (array $attributes) => [
            'helpful_votes' => $helpful,
            'unhelpful_votes' => $unhelpful,
        ]);
    }

    public function reported(int $count = 1): static
    {
        return $this->state(fn (array $attributes) => [
            'reported_count' => $count,
        ]);
    }

    public function reply(): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => Review::factory(),
            'rating' => null,
            'title' => null,
            'pros' => null,
            'cons' => null,
            'is_recommended' => null,
            'is_verified_purchase' => null,
        ]);
    }
} 