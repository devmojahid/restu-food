<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence();
        $isPublished = fake()->boolean(80); // 80% chance of being published

        return [
            'user_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'content' => fake()->paragraphs(rand(3, 7), true),
            'featured_image' => 'blogs/' . fake()->image('public/storage/blogs', 640, 480, null, false),
            'is_published' => $isPublished,
            'published_at' => $isPublished ? fake()->dateTimeBetween('-1 year', 'now') : null,
        ];
    }

    /**
     * Indicate that the blog is published.
     */
    public function published(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => true,
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }

    /**
     * Indicate that the blog is draft.
     */
    public function draft(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }
}
