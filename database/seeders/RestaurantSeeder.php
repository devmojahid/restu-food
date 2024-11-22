<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Restaurant;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $restaurants = [
            [
                'name' => 'KFC',
                'slug' => 'kfc',
                'address' => '123 Main St',
                'opening_time' => '10:00',
                'closing_time' => '22:00',
                'user_id' => 1,
            ],
            [
                'name' => 'McDonalds',
                'slug' => 'mcdonalds',
                'address' => '456 Elm St',
                'opening_time' => '10:00',
                'closing_time' => '22:00',
                'user_id' => 1,
            ],
            [
                'name' => 'Burger King',
                'slug' => 'burger-king',
                'address' => '789 Oak St',
                'opening_time' => '10:00',
                'closing_time' => '22:00',
                'user_id' => 1,
            ],
            [
                'name' => 'Taco Bell',
                'slug' => 'taco-bell',
                'address' => '101 Pine St',
                'opening_time' => '10:00',
                'closing_time' => '22:00',
                'user_id' => 1,
            ],
        ];

        foreach ($restaurants as $restaurant) {
            Restaurant::create($restaurant);
        }
    }
}
