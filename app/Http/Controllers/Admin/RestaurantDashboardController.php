<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\RestaurantDashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class RestaurantDashboardController extends Controller
{
    public function __construct(
        private readonly RestaurantDashboardService $dashboardService
    ) {}

    public function index(Request $request): Response
    {
        $restaurantId = $request->user()->restaurant_id;
        
        return Inertia::render('Dashboard/Restaurant/Index', [
            'dashboardData' => $this->dashboardService->getData($restaurantId),
        ]);
    }
} 