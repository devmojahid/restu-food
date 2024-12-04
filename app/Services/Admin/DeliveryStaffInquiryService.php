<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\DeliveryStaffInquiry;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

final class DeliveryStaffInquiryService
{
    private function encodeJsonField($data): ?string 
    {
        return is_array($data) ? json_encode($data) : $data;
    }

    public function getPaginated(array $filters): LengthAwarePaginator
    {
        $query = DeliveryStaffInquiry::query()
            ->with(['user'])
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
            ->when($filters['vehicle_type'] ?? null, fn($query, $type) => 
                $query->where('vehicle_type', $type)
            );

        // Add proper sorting
        $sortField = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $query->orderBy($sortField, $direction);

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function store(array $data): DeliveryStaffInquiry
    {
        return DB::transaction(function () use ($data) {
            // Encode array fields
            $data['availability_hours'] = $this->encodeJsonField($data['availability_hours'] ?? []);
            $data['preferred_areas'] = $this->encodeJsonField($data['preferred_areas'] ?? []);
            $data['delivery_experience'] = $this->encodeJsonField($data['delivery_experience'] ?? []);
            $data['language_skills'] = $this->encodeJsonField($data['language_skills'] ?? []);

            $inquiry = DeliveryStaffInquiry::create($data);
            
            // Add initial status history
            $inquiry->addStatusHistory(
                DeliveryStaffInquiry::STATUS_PENDING,
                'Application submitted'
            );

            // Handle file uploads
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

    public function approve(DeliveryStaffInquiry $inquiry): void
    {
        DB::transaction(function () use ($inquiry) {
            $inquiry->approve();
            $inquiry->addStatusHistory(
                DeliveryStaffInquiry::STATUS_APPROVED,
                'Application approved'
            );
        });
    }

    public function reject(DeliveryStaffInquiry $inquiry, string $reason): void
    {
        DB::transaction(function () use ($inquiry, $reason) {
            $inquiry->reject($reason);
            $inquiry->addStatusHistory(
                DeliveryStaffInquiry::STATUS_REJECTED,
                "Application rejected: $reason"
            );
        });
    }

    public function markAsUnderReview(DeliveryStaffInquiry $inquiry): void
    {
        DB::transaction(function () use ($inquiry) {
            $inquiry->update(['status' => DeliveryStaffInquiry::STATUS_UNDER_REVIEW]);
            $inquiry->addStatusHistory(
                DeliveryStaffInquiry::STATUS_UNDER_REVIEW,
                'Application under review'
            );
        });
    }

    public function bulkApprove(array $ids): void
    {
        DB::transaction(function () use ($ids) {
            $inquiries = DeliveryStaffInquiry::whereIn('id', $ids)->get();
            foreach ($inquiries as $inquiry) {
                $this->approve($inquiry);
            }
        });
    }

    public function bulkReject(array $ids, string $reason): void
    {
        DB::transaction(function () use ($ids, $reason) {
            $inquiries = DeliveryStaffInquiry::whereIn('id', $ids)->get();
            foreach ($inquiries as $inquiry) {
                $this->reject($inquiry, $reason);
            }
        });
    }
} 