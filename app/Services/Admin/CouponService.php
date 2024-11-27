<?php

declare(strict_types=1);

namespace App\Services\Admin;

use App\Models\Coupon;
use App\Models\User;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Pagination\LengthAwarePaginator;

final class CouponService extends BaseService
{
    protected string $model = Coupon::class;
    protected string $cachePrefix = 'coupons:';
    protected array $searchableFields = ['code', 'description'];
    protected array $filterableFields = ['type', 'is_active', 'status'];
    protected array $sortableFields = ['code', 'value', 'used_count', 'created_at'];

    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        $query = $this->model::query();

        // Apply search filter
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                foreach ($this->searchableFields as $field) {
                    $q->orWhere($field, 'like', "%{$filters['search']}%");
                }
            });
        }

        // Apply status filter
        if (!empty($filters['status'])) {
            switch ($filters['status']) {
                case 'active':
                    $query->active();
                    break;
                case 'expired':
                    $query->expired();
                    break;
                case 'scheduled':
                    $query->where('start_date', '>', now());
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
            }
        }

        // Apply type filter
        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        // Apply sorting
        $query->orderBy('created_at', 'desc');

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function store(array $data): Model
    {
        try {
            DB::beginTransaction();

            // Format dates if provided
            if (!empty($data['start_date'])) {
                $data['start_date'] = now()->parse($data['start_date']);
            }
            if (!empty($data['end_date'])) {
                $data['end_date'] = now()->parse($data['end_date']);
            }

            // Create coupon
            $coupon = $this->model::create($data);

            DB::commit();
            $this->clearCache();

            return $coupon;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Coupon creation failed', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function update(int $id, array $data): Model
    {
        try {
            DB::beginTransaction();

            $coupon = $this->findOrFail($id);

            // Format dates if provided
            if (!empty($data['start_date'])) {
                $data['start_date'] = now()->parse($data['start_date']);
            }
            if (!empty($data['end_date'])) {
                $data['end_date'] = now()->parse($data['end_date']);
            }

            $coupon->update($data);

            DB::commit();
            $this->clearCache();

            return $coupon->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Coupon update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            throw $e;
        }
    }

    public function validateCoupon(string $code, float $orderAmount, ?User $user = null): array
    {
        $coupon = $this->model::where('code', $code)->firstOrFail();

        if (!$coupon->isValid()) {
            throw new \Exception('This coupon is not valid.');
        }

        if ($coupon->min_order_value && $orderAmount < $coupon->min_order_value) {
            throw new \Exception("Minimum order amount of {$coupon->min_order_value} required.");
        }

        if ($user && !$coupon->canBeUsedByUser($user)) {
            throw new \Exception('You are not eligible to use this coupon.');
        }

        $discountAmount = $coupon->calculateDiscount($orderAmount);

        return [
            'coupon' => $coupon,
            'discount_amount' => $discountAmount,
            'final_amount' => $orderAmount - $discountAmount
        ];
    }

    public function updateStatus(int $id, bool $status): bool
    {
        try {
            DB::beginTransaction();

            $coupon = $this->findOrFail($id);
            $coupon->update(['is_active' => $status]);

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Coupon status update failed', [
                'id' => $id,
                'status' => $status,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function bulkDelete(array $ids): bool
    {
        try {
            DB::beginTransaction();

            $this->model::whereIn('id', $ids)->delete();

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk coupon deletion failed', [
                'ids' => $ids,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    public function bulkUpdateStatus(array $ids, bool $status, string $field = 'is_active'): bool
    {
        try {
            DB::beginTransaction();

            $this->model::whereIn('id', $ids)->update([$field => $status]);

            DB::commit();
            $this->clearCache();

            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk coupon status update failed', [
                'ids' => $ids,
                'status' => $status,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    protected function clearCache(): void
    {
        Cache::tags(['coupons'])->flush();
    }
} 