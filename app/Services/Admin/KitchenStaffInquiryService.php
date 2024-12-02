<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\KitchenStaffInquiry;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

final class KitchenStaffInquiryService
{
    public function getPaginated(array $filters): LengthAwarePaginator
    {
        return KitchenStaffInquiry::query()
            ->with(['restaurant', 'user'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('full_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, fn($query, $status) => 
                $query->where('status', $status)
            )
            ->when($filters['restaurant_id'] ?? null, fn($query, $restaurantId) => 
                $query->where('restaurant_id', $restaurantId)
            )
            ->orderBy($filters['sort'] ?? 'created_at', $filters['direction'] ?? 'desc')
            ->paginate($filters['per_page'] ?? 10);
    }

    public function store(array $data): KitchenStaffInquiry
    {
        return DB::transaction(function () use ($data) {
            $inquiry = KitchenStaffInquiry::create($data);
            
            if (!empty($data['files'])) {
                foreach ($data['files'] as $collection => $file) {
                    if ($file) {
                        $inquiry->addMedia($file)->toMediaCollection($collection);
                    }
                }
            }

            return $inquiry;
        });
    }

    public function approve(KitchenStaffInquiry $inquiry): void
    {
        DB::transaction(function () use ($inquiry) {
            $inquiry->update(['status' => 'approved']);
            $inquiry->statusHistory()->create([
                'status' => 'approved',
                'comment' => 'Application approved',
                'user_id' => auth()->id()
            ]);
        });
    }

    public function reject(KitchenStaffInquiry $inquiry, string $reason): void
    {
        DB::transaction(function () use ($inquiry, $reason) {
            $inquiry->update(['status' => 'rejected']);
            $inquiry->statusHistory()->create([
                'status' => 'rejected',
                'comment' => $reason,
                'user_id' => auth()->id()
            ]);
        });
    }

    public function markAsUnderReview(KitchenStaffInquiry $inquiry): void
    {
        DB::transaction(function () use ($inquiry) {
            $inquiry->update(['status' => 'under_review']);
            $inquiry->statusHistory()->create([
                'status' => 'under_review',
                'comment' => 'Application under review',
                'user_id' => auth()->id()
            ]);
        });
    }

    // Add other necessary methods...
} 