<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RestaurantRequest;
use App\Models\Restaurant;
use App\Services\Admin\RestaurantService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

final class RestaurantController extends Controller
{
    public function __construct(
        private readonly RestaurantService $restaurantService
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'per_page' => $request->input('per_page', 10),
            'sort' => $request->input('sort', 'created_at'),
            'direction' => $request->input('direction', 'desc'),
        ];

        return Inertia::render('Admin/Restaurants/Index', [
            'restaurants' => $this->restaurantService->getPaginated($filters),
            'filters' => $filters
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Restaurants/Create');
    }

    public function store(RestaurantRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['files'] = [
                'logo' => $request->input('logo'),
                'banner' => $request->input('banner'),
                'gallery' => $request->input('gallery', []),
            ];

            $restaurant = $this->restaurantService->store($data);

            return redirect()
                ->route('app.restaurants.edit', $restaurant)
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Restaurant created successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error creating restaurant: ' . $e->getMessage()
                ]);
        }
    }

    public function edit(Restaurant $restaurant): Response
    {
        $restaurant->load(['files']);

        return Inertia::render('Admin/Restaurants/Edit', [
            'restaurant' => $restaurant
        ]);
    }

    public function update(RestaurantRequest $request, Restaurant $restaurant): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['files'] = [
                'logo' => $request->input('logo'),
                'banner' => $request->input('banner'),
                'gallery' => $request->input('gallery', []),
            ];

            $this->restaurantService->update($restaurant->id, $data);

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Restaurant updated successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error updating restaurant: ' . $e->getMessage()
                ]);
        }
    }

    public function destroy(Restaurant $restaurant): RedirectResponse
    {
        try {
            $this->restaurantService->delete($restaurant->id);
            return redirect()
                ->route('app.restaurants.index')
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Restaurant deleted successfully.'
                ]);
        } catch (\Exception $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error deleting restaurant: ' . $e->getMessage()
            ]);
        }
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:restaurants,id'
            ]);

            $this->restaurantService->bulkDelete($validated['ids']);

            return back()->with('toast', [
                'type' => 'success',
                'message' => 'Selected restaurants deleted successfully'
            ]);
        } catch (\Exception $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error deleting restaurants: ' . $e->getMessage()
            ]);
        }
    }

    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:restaurants,id',
                'status' => 'required|in:active,inactive,pending,suspended'
            ]);

            $this->restaurantService->bulkUpdateStatus(
                $validated['ids'], 
                $validated['status']
            );

            return back()->with('toast', [
                'type' => 'success',
                'message' => 'Restaurant status updated successfully'
            ]);
        } catch (\Exception $e) {
            return back()->with('toast', [
                'type' => 'error',
                'message' => 'Error updating status: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * @throws \Exception
     */
    public function show(Restaurant $restaurant): Response|RedirectResponse
    {
        try {
            $restaurant->load([
                'files',
                'menuCategories' => fn($query) => $query->orderBy('order'),
                'menuItems' => fn($query) => $query->orderBy('order'),
                'deliveryZones',
                'owner',
            ]);

            // Get restaurant analytics
            $analytics = $this->restaurantService->getAnalytics($restaurant->id);

            return Inertia::render('Admin/Restaurants/Show', [
                'restaurant' => $restaurant,
                'analytics' => $analytics,
                'meta' => [
                    'title' => $restaurant->name,
                    'description' => $restaurant->description,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing restaurant', [
                'restaurant_id' => $restaurant->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if (request()->wantsJson()) {
                return response()->json([
                    'message' => 'Error loading restaurant details',
                    'error' => $e->getMessage()
                ], SymfonyResponse::HTTP_INTERNAL_SERVER_ERROR);
            }

            return redirect()
                ->route('app.restaurants.index')
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error loading restaurant details: ' . $e->getMessage()
                ]);
        }
    }

    /**
     * Handle restaurant analytics
     */
    public function analytics(Restaurant $restaurant): Response|RedirectResponse
    {
        try {
            $analytics = $this->restaurantService->getDetailedAnalytics($restaurant->id);

            return Inertia::render('Admin/Restaurants/Analytics', [
                'restaurant' => $restaurant->only('id', 'name'),
                'analytics' => $analytics,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading restaurant analytics', [
                'restaurant_id' => $restaurant->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()
                ->route('app.restaurants.show', $restaurant)
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error loading analytics: ' . $e->getMessage()
                ]);
        }
    }

    /**
     * Handle menu management
     */
    public function menu(Restaurant $restaurant): Response|RedirectResponse
    {
        try {
            $restaurant->load([
                'menuCategories' => fn($query) => $query->orderBy('order'),
                'menuItems' => fn($query) => $query->orderBy('order'),
            ]);

            return Inertia::render('Admin/Restaurants/Menu', [
                'restaurant' => $restaurant,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading restaurant menu', [
                'restaurant_id' => $restaurant->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()
                ->route('app.restaurants.show', $restaurant)
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error loading menu: ' . $e->getMessage()
                ]);
        }
    }

    /**
     * Handle delivery zone management
     */
    public function deliveryZones(Restaurant $restaurant): Response|RedirectResponse
    {
        try {
            $restaurant->load('deliveryZones');

            return Inertia::render('Admin/Restaurants/DeliveryZones', [
                'restaurant' => $restaurant,
                'defaultLocation' => [
                    'lat' => $restaurant->latitude,
                    'lng' => $restaurant->longitude,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading delivery zones', [
                'restaurant_id' => $restaurant->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()
                ->route('app.restaurants.show', $restaurant)
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error loading delivery zones: ' . $e->getMessage()
                ]);
        }
    }
} 