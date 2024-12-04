<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\KitchenStaffInquiry;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

final class KitchenStaffInquiryService
{
    private function encodeJsonField($data): ?string 
    {
        return is_array($data) ? json_encode($data) : $data;
    }

    private function decodeJsonField($data): ?array 
    {
        if (is_array($data)) {
            return $data;
        }
        return $data ? json_decode($data, true) : null;
    }

    public function getPaginated(array $filters): LengthAwarePaginator
    {
        dd($filters);
        $query = KitchenStaffInquiry::query()
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
            );

        // Add proper sorting
        $sortField = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $query->orderBy($sortField, $direction);

        $perPage = $filters['per_page'] ?? 10;

        return $query->paginate($perPage);
    }

    public function store(array $data): KitchenStaffInquiry
    {
        return DB::transaction(function () use ($data) {
            // Encode array fields before saving
            $data['specializations'] = $this->encodeJsonField($data['specializations'] ?? []);
            $data['culinary_certificates'] = $this->encodeJsonField($data['culinary_certificates'] ?? []);
            $data['availability_hours'] = $this->encodeJsonField($data['availability_hours'] ?? []);

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
            $inquiry->approve();
        });
    }

    public function reject(KitchenStaffInquiry $inquiry, string $reason): void
    {
        DB::transaction(function () use ($inquiry, $reason) {
            $inquiry->reject($reason);
        });
    }

    public function markAsUnderReview(KitchenStaffInquiry $inquiry): void
    {
        DB::transaction(function () use ($inquiry) {
            $inquiry->update(['status' => 'under_review']);
            $inquiry->addStatusHistory(
                'under_review',
                'Application under review',
                auth()->id()
            );
        });
    }

    public function getPaginatedForRestaurant(int $restaurantId, array $filters): LengthAwarePaginator
    {
        return KitchenStaffInquiry::query()
            ->where('restaurant_id', $restaurantId)
            ->with(['user', 'statusHistory' => fn($query) => $query->latest()])
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
            ->when($filters['experience_level'] ?? null, fn($query, $level) => 
                $query->where('years_of_experience', $level)
            )
            ->when($filters['position'] ?? null, fn($query, $position) => 
                $query->where('position_applied', $position)
            )
            ->latest()
            ->paginate($filters['per_page'] ?? 10);
    }

    // Add other necessary methods...
} 