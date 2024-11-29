<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\RestaurantService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;
use App\Exports\RestaurantStatsExport;
use Maatwebsite\Excel\Facades\Excel;

final class RestaurantStatsController extends Controller
{
    public function __construct(
        private readonly RestaurantService $restaurantService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $filters = [
            'range' => $request->get('range', '30'),
            'restaurant_id' => $user->hasRole('Admin') ? null : $user->restaurant_id,
            'ranges' => [
                ['value' => '7', 'label' => 'Last 7 days'],
                ['value' => '30', 'label' => 'Last 30 days'],
                ['value' => '90', 'label' => 'Last 90 days'],
                ['value' => '365', 'label' => 'Last year'],
            ],
        ];

        $stats = $this->getStats((int) $filters['range'], $filters['restaurant_id']);

        return Inertia::render('Admin/Restaurants/Stats', [
            'stats' => $stats,
            'filters' => $filters,
            'can' => [
                'viewStats' => $user->can('view-stats'),
                'exportStats' => $user->can('export-stats'),
                'viewAllRestaurants' => $user->hasRole('Admin'),
            ],
        ]);
    }

    public function filter(Request $request): Response
    {
        $range = $request->validate([
            'range' => 'required|in:7,30,90,365',
        ])['range'];

        $restaurantId = !$request->user()->hasRole('Admin') 
            ? $request->user()->restaurant_id 
            : null;

        $stats = $this->getStats((int) $range, $restaurantId);

        return back()->with([
            'stats' => $stats,
            'filters' => [
                'range' => $range,
            ],
        ]);
    }

    public function export(Request $request)
    {
        $range = $request->get('range', 30);
        $restaurantId = !$request->user()->hasRole('Admin') 
            ? $request->user()->restaurant_id 
            : null;

        return Excel::download(
            new RestaurantStatsExport($range, $restaurantId),
            'restaurant-stats.xlsx'
        );
    }

    private function getStats(int $range, ?int $restaurantId = null): array
    {
        $cacheKey = sprintf(
            "restaurant_stats_%d_%s_%s",
            $range,
            $restaurantId ?? 'all',
            auth()->id()
        );
        
        return Cache::remember($cacheKey, 300, function () use ($range, $restaurantId) {
            return $this->restaurantService->getDetailedStats($range, $restaurantId);
        });
    }
} 