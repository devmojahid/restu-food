<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\Frontend\HomeService;

final class HomeController extends Controller
{
    public function __construct(
        private readonly HomeService $homeService
    ) {}

    public function index()
    {
        $data = $this->homeService->getHomePageData();
     
        return Inertia::render('Frontend/Home/Index', [
            'heroSlides' => $data['heroSlides'],
            'featuredRestaurants' => $data['featuredRestaurants'],
            'popularDishes' => $data['popularDishes'],
            'specialOffers' => $data['specialOffers'],
            'stats' => $data['stats']
        ]);
    }
} 