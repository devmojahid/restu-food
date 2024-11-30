<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Events\KitchenOrderStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KitchenOrderController extends Controller
{
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
            'notes' => 'nullable|string',
            'estimated_completion_time' => 'nullable|date',
        ]);

        $order->update([
            'status' => $validated['status'],
            'kitchen_notes' => $validated['notes'] ?? null,
            'estimated_completion_time' => $validated['estimated_completion_time'] ?? null,
        ]);

        // Record status change in order history
        $order->statusHistory()->create([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
            'changed_by' => $request->user()->id,
        ]);

        // Broadcast the update
        broadcast(new KitchenOrderStatusUpdated(
            $order, 
            $validated['status'], 
            $request->user()
        ))->toOthers();

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->fresh(['items', 'statusHistory'])
        ]);
    }

    public function assignStaff(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'staff_id' => 'required|exists:users,id',
            'station' => 'required|string',
        ]);

        $order->assignedStaff()->attach($validated['staff_id'], [
            'station' => $validated['station'],
            'assigned_at' => now(),
        ]);

        return response()->json([
            'message' => 'Staff assigned successfully'
        ]);
    }

    public function addNote(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'note' => 'required|string',
            'type' => 'required|in:preparation,quality,issue',
        ]);

        $order->notes()->create([
            'note' => $validated['note'],
            'type' => $validated['type'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Note added successfully'
        ]);
    }

    public function updatePreparationProgress(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'step_id' => 'required|exists:preparation_steps,id',
            'progress' => 'required|integer|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        $step = $order->preparationSteps()->findOrFail($validated['step_id']);
        $step->update([
            'progress' => $validated['progress'],
            'notes' => $validated['notes'],
        ]);

        if ($validated['progress'] === 100) {
            $step->complete($request->user());
        }

        return response()->json([
            'message' => 'Progress updated successfully'
        ]);
    }

    public function getKitchenLoad(): JsonResponse
    {
        $stats = [
            'active_orders' => Order::whereIn('status', ['pending', 'processing'])->count(),
            'staff_available' => User::role('Kitchen Staff')->where('status', 'active')->count(),
            'station_load' => [
                'grill' => $this->getStationLoad('grill'),
                'prep' => $this->getStationLoad('prep'),
                'fry' => $this->getStationLoad('fry'),
                'salad' => $this->getStationLoad('salad'),
            ],
        ];

        return response()->json($stats);
    }

    private function getStationLoad(string $station): array
    {
        $orders = Order::whereHas('items', function ($query) use ($station) {
            $query->where('station', $station);
        })->whereIn('status', ['pending', 'processing'])->count();

        $capacity = config("kitchen.station_capacity.$station", 10);
        $load = min(($orders / $capacity) * 100, 100);

        return [
            'orders' => $orders,
            'capacity' => $capacity,
            'load_percentage' => $load,
        ];
    }
} 