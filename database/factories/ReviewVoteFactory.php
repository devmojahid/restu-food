<?php

namespace Database\Factories;

use App\Models\ReviewVote;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewVoteFactory extends Factory
{
    protected $model = ReviewVote::class;

    public function definition(): array
    {
        return [
            'review_id' => Review::factory(),
            'user_id' => User::factory(),
            'vote_type' => $this->faker->randomElement(['helpful', 'unhelpful']),
        ];
    }

    public function helpful(): static
    {
        return $this->state(fn (array $attributes) => [
            'vote_type' => 'helpful',
        ]);
    }

    public function unhelpful(): static
    {
        return $this->state(fn (array $attributes) => [
            'vote_type' => 'unhelpful',
        ]);
    }
} 