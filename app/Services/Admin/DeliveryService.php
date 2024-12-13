<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Delivery;
use App\Models\DeliveryLocation;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

final class DeliveryService
{
    public function updateLocation(int $deliveryId, array $location): void
    {
        $delivery = Delivery::findOrFail($deliveryId);
        
        // Update current location
        $delivery->update([
            'current_location' => $location,
            'last_location_update' => now(),
        ]);

        // Store location history
        DeliveryLocation::create([
            'delivery_id' => $deliveryId,
            'latitude' => $location['lat'],
            'longitude' => $location['lng'],
            'recorded_at' => now(),
        ]);

        // Clear location cache
        Cache::tags(['delivery_locations'])->forget("delivery:{$deliveryId}:location");
    }

    public function getLocationHistory(int $deliveryId): Collection
    {
        return DeliveryLocation::where('delivery_id', $deliveryId)
            ->orderBy('recorded_at', 'desc')
            ->get()
            ->map(function ($location) {
                return [
                    'lat' => $location->latitude,
                    'lng' => $location->longitude,
                    'timestamp' => $location->recorded_at->toIso8601String(),
                ];
            });
    }

    public function getActiveDeliveries(): Collection
    {
        return Delivery::with(['order', 'driver'])
            ->whereIn('status', ['assigned', 'picked_up', 'in_transit'])
            ->get();
    }

    public function calculateETA(array $origin, array $destination): ?int
    {
        try {
            $response = Http::get('https://maps.googleapis.com/maps/api/distancematrix/json', [
                'origins' => "{$origin['lat']},{$origin['lng']}",
                'destinations' => "{$destination['lat']},{$destination['lng']}",
                'key' => config('services.google.maps_api_key'),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['rows'][0]['elements'][0]['duration']['value'] ?? null;
            }
        } catch (\Exception $e) {
            \Log::error('Failed to calculate ETA: ' . $e->getMessage());
        }

        return null;
    }
} 