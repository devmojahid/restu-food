<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DeliveryTrackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\Delivery\UpdateLocationRequest;
use App\Http\Resources\DeliveryLocationResource;
use App\Http\Resources\DeliveryStatsResource;

final class DeliveryLocationController extends Controller
{
    public function __construct(
        private readonly DeliveryTrackingService $trackingService
    ) {}

    public function update(UpdateLocationRequest $request): JsonResponse
    {
        try {
            $this->trackingService->updateLocation(
                deliveryId: $request->validated('delivery_id'),
                location: $request->validated('location'),
                metadata: $request->validated('metadata', [])
            );

            return response()->json([
                'message' => 'Location updated successfully',
                'location' => $request->validated('location')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update location',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function history(int $deliveryId): JsonResponse
    {
        try {
            $history = $this->trackingService->getLocationHistory($deliveryId);
            
            return response()->json([
                'history' => DeliveryLocationResource::collection($history)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch location history',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function stats(int $deliveryId): JsonResponse
    {
        try {
            $stats = $this->trackingService->getDeliveryStats($deliveryId);
            
            return response()->json([
                'stats' => new DeliveryStatsResource($stats)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch delivery stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, int $deliveryId): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:assigned,picked_up,in_transit,delivered,cancelled'
        ]);

        try {
            $this->trackingService->updateDeliveryStatus(
                deliveryId: $deliveryId,
                status: $validated['status']
            );

            return response()->json([
                'message' => 'Delivery status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update delivery status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 