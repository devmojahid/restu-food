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
    protected array $searchableFields = ['name', 'email', 'phone', 'address'];
    protected array $filterableFields = ['status', 'is_featured'];
    protected array $sortableFields = ['name', 'created_at', 'status'];
    protected array $relationships = ['owner', 'files'];

    public function store(array $data): Restaurant
    {
        try {
            DB::beginTransaction();

            // Generate slug
            $data['slug'] = Str::slug($data['name']);

            // Create restaurant
            $restaurant = $this->model::create($data);

            // Handle file uploads
            if (!empty($data['files'])) {
                $this->handleFileUploads($restaurant, $data['files']);
            }

            // Handle meta data
            if (!empty($data['meta'])) {
                $restaurant->syncMeta($data['meta']);
            }

            DB::commit();

            return $restaurant->fresh(['owner', 'files']);
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
                $data['slug'] = Str::slug($data['name']);
            }

            // Update restaurant
            $restaurant->update($data);

            // Handle file uploads
            if (isset($data['files'])) {
                $this->syncFileCollections($restaurant, $data['files']);
            }

            // Handle meta data
            if (isset($data['meta'])) {
                $restaurant->syncMeta($data['meta']);
            }

            DB::commit();

            return $restaurant->fresh(['owner', 'files']);
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

    public function getNearby(float $latitude, float $longitude, float $radius = 5.0): array
    {
        return $this->model::select([
            '*',
            DB::raw('(
                6371 * acos(
                    cos(radians(?)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) +
                    sin(radians(?)) * sin(radians(latitude))
                )
            ) AS distance')
        ])
        ->having('distance', '<=', $radius)
        ->orderBy('distance')
        ->setBindings([$latitude, $longitude, $latitude])
        ->get()
        ->toArray();
    }

    public function updateStatus(int $id, string $status): bool
    {
        try {
            $restaurant = $this->findOrFail($id);
            $restaurant->update(['status' => $status]);
            return true;
        } catch (\Exception $e) {
            Log::error('Restaurant status update failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    public function toggleFeatured(int $id): bool
    {
        try {
            $restaurant = $this->findOrFail($id);
            $restaurant->update(['is_featured' => !$restaurant->is_featured]);
            return true;
        } catch (\Exception $e) {
            Log::error('Restaurant featured toggle failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
} 