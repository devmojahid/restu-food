<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Restaurant;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

final class RestaurantService extends BaseService
{
    protected string $model = Restaurant::class;
    protected string $cachePrefix = 'restaurants:';
    protected array $searchableFields = ['name', 'email', 'address'];
    protected array $filterableFields = ['status', 'is_featured'];
    protected array $sortableFields = ['name', 'created_at', 'status'];
    protected array $relationships = ['files', 'owner'];

    public function store(array $data): Restaurant
    {
        try {
            DB::beginTransaction();

            // Generate slug if not provided
            $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
            
            // Set user_id to current authenticated user
            $data['user_id'] = auth()->id();

            // Create restaurant
            $restaurant = $this->model::create($data);

            // Handle file uploads
            if (!empty($data['files'])) {
                $this->handleFileUploads($restaurant, $data['files']);
            }

            DB::commit();
            return $restaurant->fresh(['files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Restaurant creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function update(int $id, array $data): Restaurant
    {
        try {
            DB::beginTransaction();

            $restaurant = $this->findOrFail($id);

            // Update slug if name changed
            if (isset($data['name']) && $data['name'] !== $restaurant->name) {
                $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
            }

            // Update restaurant
            $restaurant->update($data);

            // Handle file updates
            if (isset($data['files'])) {
                $this->syncFileCollections($restaurant, $data['files']);
            }

            DB::commit();
            return $restaurant->fresh(['files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Restaurant update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    protected function handleFileUploads(Restaurant $restaurant, array $files): void
    {
        // Handle logo
        if (!empty($files['logo'])) {
            $restaurant->attachFile($files['logo'], 'logo');
        }

        // Handle banner
        if (!empty($files['banner'])) {
            $restaurant->attachFile($files['banner'], 'banner');
        }

        // Handle gallery
        if (!empty($files['gallery'])) {
            $restaurant->syncFiles($files['gallery'], 'gallery');
        }
    }

    protected function syncFileCollections(Restaurant $restaurant, array $files): void
    {
        // Sync logo
        if (isset($files['logo'])) {
            if (empty($files['logo'])) {
                $restaurant->clearFiles('logo');
            } else {
                $restaurant->syncFiles([$files['logo']], 'logo');
            }
        }

        // Sync banner
        if (isset($files['banner'])) {
            if (empty($files['banner'])) {
                $restaurant->clearFiles('banner');
            } else {
                $restaurant->syncFiles([$files['banner']], 'banner');
            }
        }

        // Sync gallery
        if (isset($files['gallery'])) {
            if (empty($files['gallery'])) {
                $restaurant->clearFiles('gallery');
            } else {
                $restaurant->syncFiles($files['gallery'], 'gallery');
            }
        }
    }

    public function bulkDelete(array $ids): bool
    {
        try {
            DB::beginTransaction();

            $restaurants = $this->model::whereIn('id', $ids)->get();
            foreach ($restaurants as $restaurant) {
                // Clear all files
                $restaurant->clearFiles('logo');
                $restaurant->clearFiles('banner');
                $restaurant->clearFiles('gallery');
                
                $restaurant->delete();
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk delete failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function bulkUpdateStatus(array $ids, bool $status, string $field = 'is_active'): bool
    {
        try {
            DB::beginTransaction();

            // Map boolean status to restaurant status enum
            $restaurantStatus = $status ? 'active' : 'inactive';

            $this->model::whereIn('id', $ids)->update([
                'status' => $restaurantStatus
            ]);

            DB::commit();
            $this->clearCache();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk status update failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function updateRestaurantStatus(array $ids, string $status): bool
    {
        try {
            DB::beginTransaction();

            $this->model::whereIn('id', $ids)->update([
                'status' => $status
            ]);

            DB::commit();
            $this->clearCache();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Restaurant status update failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function updateOperatingHours(int $id, array $hours): Restaurant
    {
        try {
            DB::beginTransaction();
            
            $restaurant = $this->findOrFail($id);
            $restaurant->update([
                'opening_hours' => $hours
            ]);
            
            DB::commit();
            return $restaurant->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateDeliverySettings(int $id, array $settings): Restaurant
    {
        try {
            DB::beginTransaction();
            
            $restaurant = $this->findOrFail($id);
            $restaurant->update([
                'delivery_radius' => $settings['delivery_radius'] ?? $restaurant->delivery_radius,
                'minimum_order' => $settings['minimum_order'] ?? $restaurant->minimum_order,
                'delivery_fee' => $settings['delivery_fee'] ?? $restaurant->delivery_fee
            ]);
            
            DB::commit();
            return $restaurant->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateMenuItems(int $id, array $items): Restaurant
    {
        try {
            DB::beginTransaction();
            
            $restaurant = $this->findOrFail($id);
            
            // Update menu items logic here
            // This would interact with a MenuItem model/table
            
            DB::commit();
            return $restaurant->fresh(['menuItems']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateDeliveryZones(int $id, array $zones): Restaurant
    {
        try {
            DB::beginTransaction();
            
            $restaurant = $this->findOrFail($id);
            
            // Update delivery zones logic here
            // This would interact with a DeliveryZone model/table
            
            DB::commit();
            return $restaurant->fresh(['deliveryZones']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getAnalytics(int $id, array $params = []): array
    {
        $restaurant = $this->findOrFail($id);
        
        // Calculate various metrics
        return [
            'total_orders' => 0, // Implement actual calculation
            'total_revenue' => 0,
            'average_order_value' => 0,
            'popular_items' => [],
            'peak_hours' => [],
            'customer_satisfaction' => 0,
        ];
    }

    public function getDetailedStats(int $range = 30): array
    {
        try {
            $now = now();
            $startDate = $now->copy()->subDays($range);

            // Generate fake data for demonstration
            $revenueChart = collect(range(0, $range))->map(function ($day) use ($startDate) {
                $date = $startDate->copy()->addDays($day);
                return [
                    'date' => $date->format('Y-m-d'),
                    'revenue' => rand(1000, 5000),
                    'orders' => rand(10, 50)
                ];
            })->toArray();

            // Generate fake peak hours data
            $peakHours = collect(range(0, 23))->map(function ($hour) {
                return [
                    'hour' => $hour,
                    'orders' => rand(5, 100)
                ];
            })->toArray();

            // Generate fake category distribution
            $categories = [
                ['name' => 'Fast Food', 'value' => rand(100, 500)],
                ['name' => 'Beverages', 'value' => rand(50, 300)],
                ['name' => 'Desserts', 'value' => rand(30, 200)],
                ['name' => 'Main Course', 'value' => rand(80, 400)]
            ];

            return [
                'totalRestaurants' => rand(50, 100),
                'activeRestaurants' => rand(30, 50),
                'totalOrders' => rand(500, 1000),
                'totalRevenue' => rand(10000, 50000),
                'totalCustomers' => rand(200, 500),
                'averageRating' => rand(35, 50) / 10,
                'activeLocations' => rand(10, 30),
                'popularItems' => rand(20, 40),
                'growthRate' => rand(5, 15),
                'orderTrend' => rand(-10, 20),
                'revenueTrend' => rand(-5, 25),
                'customerTrend' => rand(-8, 18),
                'growthTrend' => rand(1, 10),
                'revenueChart' => $revenueChart,
                'orderChart' => $revenueChart, // Using same data for orders
                'peakHours' => $peakHours,
                'categoryDistribution' => $categories,
                'timeRanges' => [
                    ['value' => '7', 'label' => 'Last 7 days'],
                    ['value' => '30', 'label' => 'Last 30 days'],
                    ['value' => '90', 'label' => 'Last 90 days'],
                    ['value' => '365', 'label' => 'Last year'],
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Error generating restaurant statistics', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
} 