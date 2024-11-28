<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\RestaurantService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

final class RestaurantStatsController extends Controller
{
    public function __construct(
        private readonly RestaurantService $restaurantService
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'range' => $request->get('range', '30'),
            'ranges' => [
                ['value' => '7', 'label' => 'Last 7 days'],
                ['value' => '30', 'label' => 'Last 30 days'],
                ['value' => '90', 'label' => 'Last 90 days'],
                ['value' => '365', 'label' => 'Last year'],
            ],
        ];

        $stats = $this->getStats((int) $filters['range']);

        return Inertia::render('Admin/Restaurants/Stats', [
            'stats' => $stats,
            'filters' => $filters,
            'can' => [
                'viewStats' => $request->user()->can('view-stats'),
                'exportStats' => $request->user()->can('export-stats'),
            ],
        ]);
    }

    public function filter(Request $request): Response
    {
        $range = $request->validate([
            'range' => 'required|in:7,30,90,365',
        ])['range'];

        $stats = $this->getStats((int) $range);

        return back()->with([
            'stats' => $stats,
            'filters' => [
                'range' => $range,
            ],
        ]);
    }

    private function getStats(int $range): array
    {
        $cacheKey = "restaurant_stats_{$range}_" . auth()->id();
        
        return Cache::remember($cacheKey, 300, function () use ($range) {
            return $this->restaurantService->getDetailedStats($range);
        });
    }
} 