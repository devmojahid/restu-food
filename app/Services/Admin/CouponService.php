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

    protected function getCacheKey(string $key): string
    {
        return $this->cachePrefix . $key;
    }

    protected function getFiltersCacheKey(array $filters = []): string 
    {
        $userId = auth()->id() ?? 'guest';
        $key = "user:{$userId}:" . md5(json_encode($filters));
        
        $this->storeCacheKey($this->getCacheKey($key));
        
        return $this->getCacheKey($key);
    }

    private function storeCacheKey(string $key): void
    {
        $keys = Cache::get($this->getCacheKey('cache_keys'), []);
        $keys[] = $key;
        Cache::put(
            $this->getCacheKey('cache_keys'), 
            array_unique($keys), 
            now()->addDays(7)
        );
    }

    public function clearAllCaches(): void
    {
        try {
            $keys = Cache::get($this->getCacheKey('cache_keys'), []);
            foreach ($keys as $key) {
                Cache::forget($key);
            }
            Cache::forget($this->getCacheKey('cache_keys'));

            $cacheKeys = [
                'all',
                'active',
                'stats',
                'latest',
                'popular',
            ];

            foreach ($cacheKeys as $key) {
                Cache::forget($this->getCacheKey($key));
            }

            if (config('cache.default') === 'redis') {
                $pattern = $this->cachePrefix . '*';
                $this->clearRedisCache($pattern);
            } else {
                $users = User::pluck('id')->toArray();
                foreach ($users as $userId) {
                    Cache::forget($this->getCacheKey("user:{$userId}:all"));
                    Cache::forget($this->getCacheKey("user:{$userId}:active"));
                }
            }

            // Clear stats cache
            Cache::forget('coupon_stats');
            
            // Refresh stats immediately
            $this->refreshStats();

            Log::info('Coupon caches cleared successfully');
        } catch (\Exception $e) {
            Log::error('Failed to clear coupon caches', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    private function clearRedisCache(string $pattern): void
    {
        try {
            $redis = Cache::getRedis();
            $keys = $redis->keys($pattern);
            
            if (!empty($keys)) {
                $redis->del($keys);
            }
        } catch (\Exception $e) {
            Log::warning('Redis cache clearing failed, falling back to regular cache clearing', [
                'error' => $e->getMessage()
            ]);
        }
    }

    public function warmCache(): void
    {
        try {
            $this->getPaginated(['per_page' => 10]);
            $this->model::active()->count();
            $this->model::expired()->count();
            
            Cache::remember('coupons:latest', now()->addHours(1), function () {
                return $this->model::latest()->take(5)->get();
            });
            
            Cache::remember('coupons:popular', now()->addHours(1), function () {
                return $this->model::orderBy('used_count', 'desc')->take(5)->get();
            });

            Log::info('Coupon cache warmed up successfully');
        } catch (\Exception $e) {
            Log::error('Failed to warm up coupon cache', [
                'error' => $e->getMessage()
            ]);
        }
    }

    public function getPaginated(array $filters = []): LengthAwarePaginator
    {
        $cacheKey = $this->getFiltersCacheKey($filters);
        
        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($filters) {
            $query = $this->model::query();

            // Apply search filter
            if (!empty($filters['search'])) {
                $query->where(function ($q) use ($filters) {
                    foreach ($this->searchableFields as $field) {
                        $q->orWhere($field, 'like', "%{$filters['search']}%");
                    }
                });
            }

            // Enhanced status filtering
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

            // Enhanced sorting with proper validation
            $sortField = in_array($filters['sort'] ?? '', $this->sortableFields) 
                ? $filters['sort'] 
                : 'created_at';
            
            $sortOrder = in_array($filters['order'] ?? '', ['asc', 'desc']) 
                ? $filters['order'] 
                : 'desc';

            $query->orderBy($sortField, $sortOrder);

            return $query->paginate($filters['per_page'] ?? 10);
        });
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
            
            // Clear all related caches
            $this->clearAllCaches();

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
            
            // Clear all related caches
            $this->clearAllCaches();

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

    protected function refreshStats(): void
    {
        try {
            $stats = [
                'total' => $this->model::count(),
                'active' => $this->model::active()->count(),
                'expired' => $this->model::expired()->count(),
            ];
            
            Cache::put('coupon_stats', $stats, now()->addMinutes(5));
        } catch (\Exception $e) {
            Log::error('Failed to refresh coupon stats', [
                'error' => $e->getMessage()
            ]);
        }
    }

    public function updateStatus(int $id, bool $status): Model
    {
        try {
            DB::beginTransaction();

            $coupon = $this->findOrFail($id);

            // Enhanced validation
            if ($status) {
                if ($coupon->isExpired()) {
                    throw new \Exception('Cannot activate expired coupon.');
                }
                if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) {
                    throw new \Exception('Cannot activate coupon that has reached its usage limit.');
                }
            }

            $coupon->update([
                'is_active' => $status,
                'updated_at' => now()
            ]);

            // Clear caches immediately
            $this->clearAllCaches();

            DB::commit();

            return $coupon->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Coupon status update failed', [
                'id' => $id,
                'status' => $status,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
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

    public function refreshCache(): void
    {
        $this->clearAllCaches();
        // Warm up commonly used caches
        $this->getPaginated(['per_page' => 10]);
        $this->model::active()->count();
        $this->model::expired()->count();
    }

    public function delete(int $id): bool
    {
        try {
            DB::beginTransaction();

            $coupon = $this->findOrFail($id);

            // Check if coupon can be deleted
            if ($coupon->used_count > 0) {
                throw new \Exception('Cannot delete coupon that has been used.');
            }

            $deleted = $coupon->delete();

            DB::commit();

            // Clear all related caches
            $this->clearAllCaches();
            $this->refreshStats();

            return $deleted;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Coupon deletion failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function canBeActivated(Model $coupon): bool
    {
        if ($coupon->isExpired()) {
            return false;
        }

        if ($coupon->max_uses && $coupon->used_count >= $coupon->max_uses) {
            return false;
        }

        return true;
    }

    public function getWithStats(int $id): Model
    {
        $coupon = $this->findOrFail($id);
        
        return $coupon->loadCount([
            'users as total_uses',
            'users as unique_users' => function ($query) {
                $query->distinct('user_id');
            }
        ]);
    }
} 