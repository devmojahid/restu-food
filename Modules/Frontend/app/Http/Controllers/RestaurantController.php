<?php

declare(strict_types=1);

namespace Modules\Frontend\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Modules\Frontend\Services\RestaurantService;  
use Inertia\Response;
use Inertia\Inertia;

final class RestaurantController extends Controller
{
    public function __construct(
        private readonly RestaurantService $restaurantService
    ) {}

    public function show(Restaurant $restaurant): Response
    {
        $data = $this->restaurantService->getRestaurantData($restaurant);
        
        return Inertia::module('Frontend::Restaurants/Show', [   
            'restaurant' => $data['details'],
            'menu' => $data['menu'],
            'reviews' => $data['reviews'],
            'gallery' => $data['gallery'],
            'location' => $data['location'],
            'hours' => $data['hours'],
            'features' => $data['features'],
            'similarRestaurants' => $data['similarRestaurants'],
            'offers' => $data['offers']
        ]);
    }
} 