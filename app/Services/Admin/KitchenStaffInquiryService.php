<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\KitchenStaffInquiry;
use App\Models\User;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

final class KitchenStaffInquiryService extends BaseService
{
    protected string $model = KitchenStaffInquiry::class;
    protected string $cachePrefix = 'kitchen_staff_inquiries:';
    protected array $searchableFields = ['full_name', 'email', 'phone'];
    protected array $filterableFields = ['status', 'restaurant_id', 'position_applied'];
    protected array $sortableFields = ['created_at', 'full_name', 'status'];
    protected array $relationships = ['user', 'restaurant', 'approvedBy'];

    public function approve(int $id): KitchenStaffInquiry
    {
        try {
            DB::beginTransaction();

            $inquiry = $this->findOrFail($id);
            
            // Update inquiry status
            $inquiry->update([
                'status' => 'approved',
                'rejection_reason' => null,
                'approved_at' => now(),
                'approved_by' => Auth::id(),
            ]);

            // Assign Kitchen Staff role to user
            if ($inquiry->user) {
                $inquiry->user->roles()->detach();
                $inquiry->user->assignRole('Kitchen Staff');
            }

            // Add logging
            Log::info('Kitchen staff application approved', [
                'inquiry_id' => $id,
                'restaurant_id' => $inquiry->restaurant_id,
                'approved_by' => Auth::id()
            ]);

            DB::commit();
            return $inquiry->fresh(['user', 'restaurant', 'approvedBy']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Kitchen staff application approval failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function reject(int $id, string $reason): KitchenStaffInquiry
    {
        try {
            DB::beginTransaction();

            $inquiry = $this->findOrFail($id);
            
            $inquiry->update([
                'status' => 'rejected',
                'rejection_reason' => $reason,
            ]);

            Log::info('Kitchen staff application rejected', [
                'id' => $id,
                'reason' => $reason,
                'rejected_by' => Auth::id()
            ]);

            DB::commit();
            return $inquiry->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Kitchen staff application rejection failed', [
                'id' => $id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function store(array $data): KitchenStaffInquiry
    {
        try {
            DB::beginTransaction();

            // Create the inquiry
            $inquiry = $this->model::create($data);

            // Handle file attachments
            if (!empty($data['files'])) {
                $inquiry->handleFiles($data['files']);
            }

            Log::info('Kitchen staff application created', [
                'id' => $inquiry->id,
                'user_id' => $data['user_id'],
                'restaurant_id' => $data['restaurant_id'] ?? null
            ]);

            DB::commit();
            return $inquiry->fresh(['files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Kitchen staff application creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function getStats(): array
    {
        $total = $this->model::count();
        $pending = $this->model::where('status', 'pending')->count();
        $approved = $this->model::where('status', 'approved')->count();
        $rejected = $this->model::where('status', 'rejected')->count();

        // Calculate trend (percentage change in applications over last 30 days)
        $lastMonth = $this->model::where('created_at', '>=', now()->subDays(30))->count();
        $previousMonth = $this->model::whereBetween('created_at', [
            now()->subDays(60),
            now()->subDays(30)
        ])->count();

        $trend = $previousMonth > 0 
            ? (($lastMonth - $previousMonth) / $previousMonth) * 100 
            : 0;

        return [
            'totalApplications' => $total,
            'pendingApplications' => $pending,
            'approvedApplications' => $approved,
            'rejectedApplications' => $rejected,
            'applicationTrend' => round($trend, 2),
        ];
    }

    public function getRestaurantStats(int $restaurantId): array
    {
        return [
            'total' => $this->model::where('restaurant_id', $restaurantId)->count(),
            'pending' => $this->model::where('restaurant_id', $restaurantId)
                ->where('status', 'pending')
                ->count(),
            'approved' => $this->model::where('restaurant_id', $restaurantId)
                ->where('status', 'approved')
                ->count(),
            'rejected' => $this->model::where('restaurant_id', $restaurantId)
                ->where('status', 'rejected')
                ->count(),
        ];
    }
} 