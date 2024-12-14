<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Events\DeliveryLocationUpdated;
use Illuminate\Support\Facades\Cache;

final class DeliverySimulatorService
{
    private const SIMULATION_INTERVAL = 3; // seconds
    private const SPEED = 0.0001; // Degrees per interval

    public function startSimulation(int $deliveryId, int $orderId, array $route): void
    {
        $cacheKey = "delivery_simulation:{$deliveryId}";
        
        if (!Cache::has($cacheKey)) {
            Cache::put($cacheKey, [
                'current_point' => 0,
                'route' => $route,
                'is_active' => true
            ], now()->addHours(2));

            // Start simulation loop
            $this->simulateMovement($deliveryId, $orderId);
        }
    }

    public function stopSimulation(int $deliveryId): void
    {
        Cache::forget("delivery_simulation:{$deliveryId}");
    }

    private function simulateMovement(int $deliveryId, int $orderId): void
    {
        $cacheKey = "delivery_simulation:{$deliveryId}";
        $simulation = Cache::get($cacheKey);

        if (!$simulation || !$simulation['is_active']) {
            return;
        }

        $currentPoint = $simulation['current_point'];
        $route = $simulation['route'];

        if ($currentPoint >= count($route) - 1) {
            $this->stopSimulation($deliveryId);
            return;
        }

        $currentLocation = $route[$currentPoint];
        $nextLocation = $route[$currentPoint + 1];

        // Calculate new position
        $newLocation = $this->interpolatePosition(
            $currentLocation,
            $nextLocation,
            self::SPEED
        );

        // Broadcast new location
        broadcast(new DeliveryLocationUpdated(
            location: $newLocation,
            deliveryId: $deliveryId,
            orderId: $orderId,
            metadata: [
                'speed' => rand(20, 40) . ' km/h',
                'heading' => $this->calculateHeading($currentLocation, $nextLocation),
                'estimated_time' => $this->calculateETA($newLocation, end($route))
            ]
        ));

        // Update simulation state
        Cache::put($cacheKey, [
            'current_point' => $currentPoint + 1,
            'route' => $route,
            'is_active' => true
        ], now()->addHours(2));

        // Schedule next update
        dispatch(function () use ($deliveryId, $orderId) {
            $this->simulateMovement($deliveryId, $orderId);
        })->delay(now()->addSeconds(self::SIMULATION_INTERVAL));
    }

    private function interpolatePosition(array $start, array $end, float $step): array
    {
        $lat = $start['lat'] + ($end['lat'] - $start['lat']) * $step;
        $lng = $start['lng'] + ($end['lng'] - $start['lng']) * $step;

        return [
            'lat' => $lat,
            'lng' => $lng
        ];
    }

    private function calculateHeading(array $start, array $end): string
    {
        $lat1 = deg2rad($start['lat']);
        $lat2 = deg2rad($end['lat']);
        $lng1 = deg2rad($start['lng']);
        $lng2 = deg2rad($end['lng']);

        $y = sin($lng2 - $lng1) * cos($lat2);
        $x = cos($lat1) * sin($lat2) - sin($lat1) * cos($lat2) * cos($lng2 - $lng1);
        $bearing = atan2($y, $x);
        $bearing = rad2deg($bearing);
        $bearing = fmod(($bearing + 360), 360);

        $directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return $directions[round($bearing / 45) % 8];
    }

    private function calculateETA(array $current, array $destination): string
    {
        $distance = $this->calculateDistance($current, $destination);
        $speed = 30; // km/h
        $timeInHours = $distance / $speed;
        $timeInMinutes = ceil($timeInHours * 60);
        
        return $timeInMinutes . ' minutes';
    }

    private function calculateDistance(array $point1, array $point2): float
    {
        $lat1 = deg2rad($point1['lat']);
        $lat2 = deg2rad($point2['lat']);
        $lng1 = deg2rad($point1['lng']);
        $lng2 = deg2rad($point2['lng']);

        $dlat = $lat2 - $lat1;
        $dlng = $lng2 - $lng1;

        $a = sin($dlat/2) * sin($dlat/2) + cos($lat1) * cos($lat2) * sin($dlng/2) * sin($dlng/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        
        return 6371 * $c; // Earth's radius * c = distance in km
    }

    public function pairDevice(int $deliveryId, string $deviceId, string $role): void
    {
        $cacheKey = "delivery_devices:{$deliveryId}";
        
        $devices = Cache::get($cacheKey, []);
        $devices[$deviceId] = [
            'role' => $role,
            'last_seen' => now(),
            'is_active' => true
        ];
        
        Cache::put($cacheKey, $devices, now()->addDay());
    }

    public function unpairDevice(int $deliveryId, string $deviceId): void
    {
        $cacheKey = "delivery_devices:{$deliveryId}";
        
        $devices = Cache::get($cacheKey, []);
        unset($devices[$deviceId]);
        
        Cache::put($cacheKey, $devices, now()->addDay());
    }

    public function getActiveDevices(int $deliveryId): array
    {
        $cacheKey = "delivery_devices:{$deliveryId}";
        return Cache::get($cacheKey, []);
    }

    private function broadcastToDevices(int $deliveryId, array $data): void
    {
        $devices = $this->getActiveDevices($deliveryId);
        
        foreach ($devices as $deviceId => $device) {
            broadcast(new DeliveryDeviceUpdate(
                deliveryId: $deliveryId,
                deviceId: $deviceId,
                role: $device['role'],
                data: array_merge($data, [
                    'device_type' => $device['role'],
                    'last_update' => now()->toIso8601String()
                ])
            ))->toOthers();
        }
    }
} 