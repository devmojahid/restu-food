<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Events\OrderStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use League\Csv\Writer;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    public function export(Request $request)
    {
        try {
            $filters = $request->input('filters', []);
            
            $query = Order::query()
                ->with(['customer', 'items', 'restaurant']);

            // Apply filters
            if (!empty($filters['dateRange']['from'])) {
                $query->whereDate('created_at', '>=', $filters['dateRange']['from']);
            }
            if (!empty($filters['dateRange']['to'])) {
                $query->whereDate('created_at', '<=', $filters['dateRange']['to']);
            }
            if (!empty($filters['status'])) {
                $query->where('status', $filters['status']);
            }
            if (!empty($filters['search'])) {
                $query->where(function($q) use ($filters) {
                    $q->where('id', 'like', "%{$filters['search']}%")
                      ->orWhereHas('customer', function($q) use ($filters) {
                          $q->where('name', 'like', "%{$filters['search']}%");
                      });
                });
            }

            // Apply sorting
            switch ($filters['orderBy'] ?? 'latest') {
                case 'oldest':
                    $query->oldest();
                    break;
                case 'highest':
                    $query->orderByDesc('total');
                    break;
                case 'lowest':
                    $query->orderBy('total');
                    break;
                default:
                    $query->latest();
            }

            $orders = $query->get();

            // Create CSV in memory
            $csv = Writer::createFromString('');
            
            // Add headers
            $csv->insertOne([
                'Order ID',
                'Customer',
                'Items',
                'Total',
                'Status',
                'Created At'
            ]);

            // Add data rows
            foreach ($orders as $order) {
                $csv->insertOne([
                    $order->id,
                    $order->customer->name,
                    $order->items->count(),
                    $order->total,
                    $order->status,
                    $order->created_at
                ]);
            }

            // Generate unique filename
            $filename = 'orders-' . now()->format('Y-m-d-His') . '.csv';

            return response($csv->getContent())
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        } catch (\Exception $e) {
            Log::error('Order export failed: ' . $e->getMessage());
            return response()->json(['error' => 'Export failed'], 500);
        }
    }

    public function updateStatus(Request $request)
    {
        try {
            $request->validate([
                'orderId' => 'required|exists:orders,id',
                'status' => 'required|in:approved,rejected,preparing,completed'
            ]);

            $order = Order::findOrFail($request->orderId);
            $order->status = $request->status;
            $order->save();

            // Broadcast the update
            broadcast(new OrderStatusUpdated($order))->toOthers();

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Order status update failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status'
            ], 500);
        }
    }
} 