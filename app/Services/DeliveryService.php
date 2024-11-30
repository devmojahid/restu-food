<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class DeliveryService
{
    public function getDashboardStats(User $deliveryPerson): array
    {
        return [
            'active_deliveries_count' => $this->getActiveDeliveriesCount($deliveryPerson),
            'total_distance_today' => $this->calculateTotalDistanceToday($deliveryPerson),
            'avg_delivery_time' => $this->calculateAverageDeliveryTime($deliveryPerson),
            'earnings_today' => $this->calculateEarningsToday($deliveryPerson),
            'active_deliveries' => $this->getActiveDeliveries($deliveryPerson),
            'completed_deliveries' => $this->getCompletedDeliveries($deliveryPerson),
            'analytics_data' => $this->getAnalyticsData($deliveryPerson),
            'urgent_notifications' => $this->getUrgentNotifications($deliveryPerson),
            'performance_metrics' => $this->getPerformanceMetrics($deliveryPerson),
        ];
    }

    private function getActiveDeliveries(User $deliveryPerson): Collection
    {
        return Order::with(['restaurant', 'customer'])
            ->where('delivery_person_id', $deliveryPerson->id)
            ->whereIn('status', ['assigned', 'picked_up'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_id' => $order->order_number,
                    'status' => $order->status,
                    'restaurant' => [
                        'name' => $order->restaurant->name,
                        'address' => $order->restaurant->address,
                    ],
                    'customer' => [
                        'name' => $order->customer->name,
                        'phone' => $order->customer->phone,
                    ],
                    'pickup_location' => [
                        'latitude' => $order->restaurant->latitude,
                        'longitude' => $order->restaurant->longitude,
                    ],
                    'delivery_location' => [
                        'latitude' => $order->delivery_latitude,
                        'longitude' => $order->delivery_longitude,
                    ],
                    'delivery_address' => $order->delivery_address,
                    'pickup_time' => $order->picked_up_at?->format('H:i'),
                    'eta' => $this->calculateETA($order),
                    'total' => $order->total,
                    'distance' => $this->calculateDistance($order),
                    'duration' => $this->calculateDuration($order),
                ];
            });
    }

    private function getAnalyticsData(User $deliveryPerson): array
    {
        $cacheKey = "delivery_analytics_{$deliveryPerson->id}";
        
        return Cache::remember($cacheKey, 300, function () use ($deliveryPerson) {
            $now = Carbon::now();
            $startOfDay = $now->copy()->startOfDay();
            
            $hourlyData = Order::where('delivery_person_id', $deliveryPerson->id)
                ->whereBetween('created_at', [$startOfDay, $now])
                ->get()
                ->groupBy(function ($order) {
                    return $order->created_at->format('H');
                })
                ->map(function ($orders) {
                    return [
                        'deliveries' => $orders->count(),
                        'earnings' => $orders->sum('delivery_fee'),
                        'avg_time' => $orders->avg('delivery_duration'),
                    ];
                });

            return [
                'performance' => $this->formatHourlyData($hourlyData),
                'timing' => $this->getTimingData($deliveryPerson),
                'metrics' => [
                    'on_time_rate' => $this->calculateOnTimeRate($deliveryPerson),
                    'avg_rating' => $this->calculateAverageRating($deliveryPerson),
                    'efficiency_score' => $this->calculateEfficiencyScore($deliveryPerson),
                ],
            ];
        });
    }

    private function calculateETA(Order $order): string
    {
        // Implement Google Maps Distance Matrix API for accurate ETA
        $baseTime = 15; // Base delivery time in minutes
        $trafficMultiplier = $this->getTrafficMultiplier();
        $distance = $this->calculateDistance($order);
        
        $estimatedMinutes = ($baseTime + ($distance * 2)) * $trafficMultiplier;
        
        return Carbon::now()->addMinutes($estimatedMinutes)->format('H:i');
    }

    private function getTrafficMultiplier(): float
    {
        $hour = Carbon::now()->hour;
        
        // Peak hours
        if (($hour >= 8 && $hour <= 10) || ($hour >= 17 && $hour <= 19)) {
            return 1.5;
        }
        
        return 1.0;
    }

    private function calculateDistance(Order $order): float
    {
        // Implement Google Maps Distance Matrix API for accurate distance
        return $this->haversineDistance(
            $order->restaurant->latitude,
            $order->restaurant->longitude,
            $order->delivery_latitude,
            $order->delivery_longitude
        );
    }

    private function haversineDistance(
        float $lat1, 
        float $lon1, 
        float $lat2, 
        float $lon2
    ): float {
        $earthRadius = 6371; // Radius of the Earth in kilometers

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($lonDelta / 2) * sin($lonDelta / 2);
            
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c, 2);
    }

    private function getActiveDeliveriesCount(User $deliveryPerson): int
    {
        return Order::where('delivery_person_id', $deliveryPerson->id)
            ->whereIn('status', ['assigned', 'picked_up'])
            ->count();
    }

    private function calculateTotalDistanceToday(User $deliveryPerson): float
    {
        return Order::where('delivery_person_id', $deliveryPerson->id)
            ->whereDate('created_at', today())
            ->get()
            ->sum(function ($order) {
                return $this->calculateDistance($order);
            });
    }

    private function calculateAverageDeliveryTime(User $deliveryPerson): int
    {
        return (int) Order::where('delivery_person_id', $deliveryPerson->id)
            ->whereDate('created_at', today())
            ->whereNotNull('delivered_at')
            ->avg('delivery_duration');
    }

    private function calculateEarningsToday(User $deliveryPerson): float
    {
        return Order::where('delivery_person_id', $deliveryPerson->id)
            ->whereDate('created_at', today())
            ->sum('delivery_fee');
    }

    private function getCompletedDeliveries(User $deliveryPerson): Collection
    {
        return Order::with(['restaurant', 'customer'])
            ->where('delivery_person_id', $deliveryPerson->id)
            ->where('status', 'delivered')
            ->whereDate('created_at', today())
            ->latest()
            ->take(10)
            ->get();
    }

    private function getUrgentNotifications(User $deliveryPerson): array
    {
        return [
            'delayed_orders' => $this->getDelayedOrders($deliveryPerson),
            'priority_orders' => $this->getPriorityOrders($deliveryPerson),
            'system_alerts' => $this->getSystemAlerts($deliveryPerson),
        ];
    }

    private function getPerformanceMetrics(User $deliveryPerson): array
    {
        return [
            'on_time_delivery_rate' => $this->calculateOnTimeRate($deliveryPerson),
            'customer_satisfaction' => $this->calculateAverageRating($deliveryPerson),
            'efficiency_score' => $this->calculateEfficiencyScore($deliveryPerson),
            'total_deliveries' => $this->getTotalDeliveries($deliveryPerson),
            'total_earnings' => $this->getTotalEarnings($deliveryPerson),
        ];
    }

    private function calculateDuration(Order $order): int
    {
        if (!$order->picked_up_at) {
            return 0;
        }

        $end = $order->delivered_at ?? now();
        return $order->picked_up_at->diffInMinutes($end);
    }

    private function formatHourlyData(Collection $hourlyData): array
    {
        $hours = range(0, 23);
        $formattedData = [];

        foreach ($hours as $hour) {
            $formattedData[] = [
                'time' => Carbon::today()->setHour($hour)->format('Y-m-d H:i:s'),
                'deliveries' => $hourlyData->get($hour)?->get('deliveries') ?? 0,
                'earnings' => $hourlyData->get($hour)?->get('earnings') ?? 0,
                'avg_time' => $hourlyData->get($hour)?->get('avg_time') ?? 0,
            ];
        }

        return $formattedData;
    }

    private function getTimingData(User $deliveryPerson): array
    {
        return Order::where('delivery_person_id', $deliveryPerson->id)
            ->whereDate('created_at', today())
            ->get()
            ->groupBy(function ($order) {
                return $order->created_at->format('H');
            })
            ->map(function ($orders) {
                return [
                    'avg_pickup_time' => $orders->avg('pickup_duration'),
                    'avg_delivery_time' => $orders->avg('delivery_duration'),
                    'avg_total_time' => $orders->avg('total_duration'),
                ];
            })
            ->toArray();
    }

    private function calculateOnTimeRate(User $deliveryPerson): float
    {
        $orders = Order::where('delivery_person_id', $deliveryPerson->id)
            ->whereDate('created_at', today())
            ->whereNotNull('delivered_at')
            ->get();

        if ($orders->isEmpty()) {
            return 0;
        }

        $onTimeCount = $orders->filter(function ($order) {
            return $order->delivered_at <= $order->expected_delivery_time;
        })->count();

        return round(($onTimeCount / $orders->count()) * 100, 2);
    }

    private function calculateAverageRating(User $deliveryPerson): float
    {
        return round(Order::where('delivery_person_id', $deliveryPerson->id)
            ->whereNotNull('delivery_rating')
            ->avg('delivery_rating') ?? 0, 2);
    }

    private function calculateEfficiencyScore(User $deliveryPerson): float
    {
        $onTimeRate = $this->calculateOnTimeRate($deliveryPerson);
        $avgRating = $this->calculateAverageRating($deliveryPerson);
        $deliverySpeed = $this->calculateDeliverySpeedScore($deliveryPerson);

        return round(($onTimeRate * 0.4) + ($avgRating * 20 * 0.4) + ($deliverySpeed * 0.2), 2);
    }

    public function updateDeliveryStatus(
        int $deliveryId,
        string $status,
        array $location,
        ?string $notes = null
    ): Order {
        $order = Order::findOrFail($deliveryId);
        
        $order->update([
            'status' => $status,
            'last_location_latitude' => $location['latitude'],
            'last_location_longitude' => $location['longitude'],
            'notes' => $notes,
            'status_updated_at' => now(),
        ]);

        if ($status === 'picked_up') {
            $order->update(['picked_up_at' => now()]);
        } elseif ($status === 'delivered') {
            $order->update(['delivered_at' => now()]);
        }

        return $order->fresh();
    }

    private function getDelayedOrders(User $deliveryPerson): Collection
    {
        return Order::where('delivery_person_id', $deliveryPerson->id)
            ->whereIn('status', ['assigned', 'picked_up'])
            ->where('expected_delivery_time', '<', now())
            ->with(['restaurant', 'customer'])
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'delay_minutes' => now()->diffInMinutes($order->expected_delivery_time),
                    'customer_name' => $order->customer->name,
                    'restaurant_name' => $order->restaurant->name,
                    'status' => $order->status,
                    'priority_level' => $this->calculatePriorityLevel($order),
                ];
            });
    }

    private function getPriorityOrders(User $deliveryPerson): Collection
    {
        return Order::where('delivery_person_id', $deliveryPerson->id)
            ->where('is_priority', true)
            ->whereIn('status', ['assigned', 'picked_up'])
            ->with(['restaurant', 'customer'])
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'time_remaining' => now()->diffInMinutes($order->expected_delivery_time, false),
                    'customer_name' => $order->customer->name,
                    'restaurant_name' => $order->restaurant->name,
                    'special_instructions' => $order->special_instructions,
                    'status' => $order->status,
                ];
            });
    }

    private function getSystemAlerts(User $deliveryPerson): array
    {
        return [
            'weather_alerts' => $this->getWeatherAlerts(),
            'traffic_alerts' => $this->getTrafficAlerts($deliveryPerson),
            'system_maintenance' => $this->getMaintenanceAlerts(),
            'important_updates' => $this->getImportantUpdates($deliveryPerson),
        ];
    }

    private function getTotalDeliveries(User $deliveryPerson): array
    {
        $now = now();
        $startOfDay = $now->copy()->startOfDay();
        $startOfWeek = $now->copy()->startOfWeek();
        $startOfMonth = $now->copy()->startOfMonth();

        return [
            'today' => Order::where('delivery_person_id', $deliveryPerson->id)
                ->where('status', 'delivered')
                ->whereBetween('created_at', [$startOfDay, $now])
                ->count(),
            'week' => Order::where('delivery_person_id', $deliveryPerson->id)
                ->where('status', 'delivered')
                ->whereBetween('created_at', [$startOfWeek, $now])
                ->count(),
            'month' => Order::where('delivery_person_id', $deliveryPerson->id)
                ->where('status', 'delivered')
                ->whereBetween('created_at', [$startOfMonth, $now])
                ->count(),
            'total' => Order::where('delivery_person_id', $deliveryPerson->id)
                ->where('status', 'delivered')
                ->count(),
        ];
    }

    private function getTotalEarnings(User $deliveryPerson): array
    {
        $now = now();
        $startOfDay = $now->copy()->startOfDay();
        $startOfWeek = $now->copy()->startOfWeek();
        $startOfMonth = $now->copy()->startOfMonth();

        return [
            'today' => Order::where('delivery_person_id', $deliveryPerson->id)
                ->where('status', 'delivered')
                ->whereBetween('created_at', [$startOfDay, $now])
                ->sum('delivery_fee'),
            'week' => Order::where('delivery_person_id', $deliveryPerson->id)
                ->where('status', 'delivered')
                ->whereBetween('created_at', [$startOfWeek, $now])
                ->sum('delivery_fee'),
            'month' => Order::where('delivery_person_id', $deliveryPerson->id)
                ->where('status', 'delivered')
                ->whereBetween('created_at', [$startOfMonth, $now])
                ->sum('delivery_fee'),
            'total' => Order::where('delivery_person_id', $deliveryPerson->id)
                ->where('status', 'delivered')
                ->sum('delivery_fee'),
        ];
    }

    private function calculateDeliverySpeedScore(User $deliveryPerson): float
    {
        $averageDeliveryTime = Order::where('delivery_person_id', $deliveryPerson->id)
            ->where('status', 'delivered')
            ->whereDate('created_at', today())
            ->avg('delivery_duration') ?? 0;

        $targetDeliveryTime = 30; // Target delivery time in minutes
        $maxScore = 100;

        if ($averageDeliveryTime <= $targetDeliveryTime) {
            return $maxScore;
        }

        $penaltyPerMinute = 2; // Points deducted per minute over target
        $minutesOver = $averageDeliveryTime - $targetDeliveryTime;
        $penalty = $minutesOver * $penaltyPerMinute;

        return max(0, $maxScore - $penalty);
    }

    private function calculatePriorityLevel(Order $order): string
    {
        $minutesDelayed = now()->diffInMinutes($order->expected_delivery_time);
        $isVipCustomer = $order->customer->is_vip;
        $isPriorityOrder = $order->is_priority;

        if ($minutesDelayed > 30 || ($isVipCustomer && $minutesDelayed > 15)) {
            return 'critical';
        }

        if ($minutesDelayed > 15 || ($isVipCustomer && $minutesDelayed > 5)) {
            return 'high';
        }

        if ($minutesDelayed > 5 || $isPriorityOrder) {
            return 'medium';
        }

        return 'low';
    }

    private function getWeatherAlerts(): array
    {
        // Integrate with a weather API service
        return [
            'type' => 'weather',
            'severity' => 'moderate',
            'message' => 'Light rain expected in delivery areas',
            'affected_areas' => ['Downtown', 'Suburb Area'],
            'duration' => '2 hours',
        ];
    }

    private function getTrafficAlerts(User $deliveryPerson): array
    {
        // Integrate with a traffic API service
        $currentLocation = [
            'latitude' => $deliveryPerson->last_latitude,
            'longitude' => $deliveryPerson->last_longitude,
        ];

        return [
            'type' => 'traffic',
            'severity' => 'high',
            'message' => 'Heavy traffic on Main Street',
            'location' => $currentLocation,
            'alternative_routes' => [
                'Take 2nd Avenue to bypass congestion',
                'Use Park Road as alternative',
            ],
        ];
    }

    private function getMaintenanceAlerts(): array
    {
        return [
            'type' => 'system',
            'severity' => 'low',
            'message' => 'System maintenance scheduled',
            'scheduled_time' => now()->addDays(2)->format('Y-m-d H:i:s'),
            'duration' => '30 minutes',
        ];
    }

    private function getImportantUpdates(User $deliveryPerson): array
    {
        return [
            [
                'type' => 'bonus',
                'message' => 'Complete 5 more deliveries to earn bonus',
                'progress' => $this->calculateBonusProgress($deliveryPerson),
                'expires_at' => now()->addHours(4)->format('Y-m-d H:i:s'),
            ],
            [
                'type' => 'achievement',
                'message' => 'New achievement unlocked: Speed Demon',
                'reward' => '$10 bonus',
            ],
        ];
    }

    private function calculateBonusProgress(User $deliveryPerson): array
    {
        $deliveriesCompleted = Order::where('delivery_person_id', $deliveryPerson->id)
            ->where('status', 'delivered')
            ->whereDate('created_at', today())
            ->count();

        $targetDeliveries = 15;
        $progress = ($deliveriesCompleted / $targetDeliveries) * 100;

        return [
            'current' => $deliveriesCompleted,
            'target' => $targetDeliveries,
            'percentage' => round($progress, 2),
            'remaining' => $targetDeliveries - $deliveriesCompleted,
        ];
    }

    // Add more helper methods...
} 