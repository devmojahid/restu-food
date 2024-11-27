<?php

namespace Database\Factories;

use App\Models\ReviewReport;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewReportFactory extends Factory
{
    protected $model = ReviewReport::class;

    public function definition(): array
    {
        return [
            'review_id' => Review::factory(),
            'user_id' => User::factory(),
            'reason' => $this->faker->randomElement(['inappropriate', 'spam', 'offensive', 'irrelevant']),
            'details' => $this->faker->boolean(70) ? $this->faker->sentence() : null,
            'status' => $this->faker->randomElement(['pending', 'investigating', 'resolved']),
            'resolved_at' => null,
            'resolved_by' => null,
        ];
    }

    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
            'resolved_at' => now(),
            'resolved_by' => User::factory(),
        ]);
    }

    public function investigating(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'investigating',
        ]);
    }
} 