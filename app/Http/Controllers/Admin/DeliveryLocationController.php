<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\DeliveryTrackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\Delivery\UpdateLocationRequest;

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
            \Log::error('Location update failed: ' . $e->getMessage());
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
            return response()->json(['history' => $history]);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch location history: ' . $e->getMessage());
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
            return response()->json(['stats' => $stats]);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch delivery stats: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch delivery stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, int $deliveryId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'required|string|in:assigned,picked_up,in_transit,delivered,cancelled'
            ]);

            $this->trackingService->updateDeliveryStatus(
                deliveryId: $deliveryId,
                status: $validated['status']
            );

            return response()->json(['message' => 'Status updated successfully']);
        } catch (\Exception $e) {
            \Log::error('Failed to update delivery status: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function pairDevice(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'delivery_id' => 'required|integer',
                'device_id' => 'required|string',
                'role' => 'required|in:customer,driver'
            ]);

            $this->trackingService->pairDevice(
                deliveryId: $validated['delivery_id'],
                deviceId: $validated['device_id'],
                role: $validated['role']
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Device paired successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Device pairing failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to pair device'
            ], 500);
        }
    }

    public function unpairDevice(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'delivery_id' => 'required|integer',
                'device_id' => 'required|string'
            ]);

            $this->trackingService->unpairDevice(
                deliveryId: $validated['delivery_id'],
                deviceId: $validated['device_id']
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Device unpaired successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Device unpairing failed: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to unpair device'
            ], 500);
        }
    }

    public function getActiveDevices(int $deliveryId): JsonResponse
    {
        try {
            $devices = $this->trackingService->getActiveDevices($deliveryId);
            return response()->json(['devices' => $devices]);
        } catch (\Exception $e) {
            \Log::error('Failed to fetch active devices: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to fetch active devices',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 