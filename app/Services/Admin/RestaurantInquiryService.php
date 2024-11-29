<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\RestaurantInquiry;
use App\Models\Restaurant;
use App\Models\User;
use App\Services\BaseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

final class RestaurantInquiryService extends BaseService
{
    protected string $model = RestaurantInquiry::class;
    protected string $cachePrefix = 'restaurant_inquiries:';
    protected array $searchableFields = ['restaurant_name', 'owner_name', 'restaurant_email'];
    protected array $filterableFields = ['status'];
    protected array $sortableFields = ['created_at', 'restaurant_name', 'status'];
    protected array $relationships = ['user', 'approvedBy'];

    public function approve(int $id): RestaurantInquiry
    {
        try {
            DB::beginTransaction();

            $inquiry = $this->findOrFail($id);
            
            // Update inquiry status using Auth facade
            $inquiry->update([
                'status' => 'approved',
                'rejection_reason' => null,
                'approved_at' => now(),
                'approved_by' => Auth::id(),
            ]);

            // Create restaurant from inquiry
            $restaurant = Restaurant::create([
                'user_id' => $inquiry->user_id,
                'name' => $inquiry->restaurant_name,
                'slug' => $inquiry->slug,
                'description' => $inquiry->description,
                'address' => $inquiry->address,
                'latitude' => $inquiry->latitude,
                'longitude' => $inquiry->longitude,
                'phone' => $inquiry->restaurant_phone,
                'email' => $inquiry->restaurant_email,
                'status' => 'active',
                'opening_time' => $inquiry->opening_time,
                'closing_time' => $inquiry->closing_time,
                'opening_hours' => $inquiry->opening_hours,
                'delivery_radius' => $inquiry->delivery_radius,
                'minimum_order' => $inquiry->minimum_order,
                'delivery_fee' => $inquiry->delivery_fee,
            ]);

            if ($inquiry->user) {
                $inquiry->user->roles()->detach();
                $inquiry->user->assignRole('Restaurant');
            }

            // Add logging to track the process
            Log::info('Restaurant inquiry approved', [
                'inquiry_id' => $id,
                'restaurant_id' => $restaurant->id,
                'approved_by' => Auth::id()
            ]);

            DB::commit();
            return $inquiry->fresh(['user', 'approvedBy']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Restaurant inquiry approval failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function reject(int $id, string $reason): RestaurantInquiry
    {
        try {
            DB::beginTransaction();

            $inquiry = $this->findOrFail($id);
            
            $inquiry->update([
                'status' => 'rejected',
                'rejection_reason' => $reason,
            ]);


            DB::commit();
            return $inquiry->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Restaurant inquiry rejection failed', [
                'id' => $id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function bulkApprove(array $ids): bool
    {
        try {
            DB::beginTransaction();

            foreach ($ids as $id) {
                $this->approve($id);
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk approval failed', [
                'ids' => $ids,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function bulkReject(array $ids, string $reason): bool
    {
        try {
            DB::beginTransaction();

            foreach ($ids as $id) {
                $this->reject($id, $reason);
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk rejection failed', [
                'ids' => $ids,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    public function store(array $data): RestaurantInquiry
    {
        try {
            DB::beginTransaction();

            // Generate slug from restaurant name
            $data['slug'] = Str::slug($data['restaurant_name']);

            // Create the inquiry
            $inquiry = $this->model::create($data);

            // Handle file attachments if present
            // if (!empty($data['files'])) {
            //     foreach ($data['files'] as $collection => $files) {
            //         if (empty($files)) continue;

            //         if (is_array($files)) {
            //             // For multiple files (like restaurant photos)
            //             foreach ($files as $file) {
            //                 if (!empty($file['uuid'])) {
            //                     $inquiry->attachFile($file['uuid'], $collection);
            //                 }
            //             }
            //         } else {
            //             // For single files (like business license or owner ID)
            //             if (!empty($files['uuid'])) {
            //                 $inquiry->attachFile($files['uuid'], $collection);
            //             }
            //         }
            //     }
            // }

            

            $inquiry->handleFiles($data['files']);

            DB::commit();
            return $inquiry->fresh(['files']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Restaurant inquiry creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }
} 