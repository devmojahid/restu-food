<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CouponRequest;
use App\Models\Coupon;
use App\Services\Admin\CouponService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

final class CouponController extends Controller
{
    use HasRoles;

    public function __construct(
        private readonly CouponService $couponService
    ) {}

    public function index(Request $request): Response
    {
        try {
            $filters = [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
                'type' => $request->input('type'),
                'per_page' => $request->input('per_page', 10),
            ];

            $coupons = $this->couponService->getPaginated($filters);
            
            // Get stats with cache
            $stats = Cache::remember('coupon_stats', now()->addMinutes(5), function () {
                return [
                    'total' => Coupon::count(),
                    'active' => Coupon::active()->count(),
                    'expired' => Coupon::expired()->count(),
                ];
            });

            return Inertia::render('Admin/Coupons/Index', [
                'coupons' => [
                    'data' => $coupons->items(),
                    'meta' => [
                        'current_page' => $coupons->currentPage(),
                        'last_page' => $coupons->lastPage(),
                        'per_page' => $coupons->perPage(),
                        'total' => $coupons->total(),
                        'from' => $coupons->firstItem() ?? 0,
                        'to' => $coupons->lastItem() ?? 0,
                    ],
                ],
                'filters' => $filters,
                'stats' => $stats,
                'can' => [
                    'create' => Auth::user()?->can('coupon.create'),
                    'edit' => Auth::user()?->can('coupon.edit'),
                    'delete' => Auth::user()?->can('coupon.delete'),
                    'manage' => Auth::user()?->can('manage.coupons'),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load coupons index', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()->with('error', 'Failed to load coupons. Please try again.');
        }
    }

    public function store(CouponRequest $request): RedirectResponse
    {
        try {
            DB::beginTransaction();
            
            $coupon = $this->couponService->store($request->validated());
            
            DB::commit();

            return redirect()
                ->back()
                ->with([
                    'success' => true,
                    'message' => 'Coupon created successfully.',
                    'data' => $coupon
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create coupon', [
                'error' => $e->getMessage(),
                'data' => $request->validated()
            ]);

            return redirect()
                ->back()
                ->with([
                    'error' => true,
                    'message' => 'Failed to create coupon. Please try again.'
                ])
                ->withInput();
        }
    }

    public function update(CouponRequest $request, Coupon $coupon): RedirectResponse
    {
        try {
            $updatedCoupon = $this->couponService->update($coupon->id, $request->validated());

            return redirect()
                ->back()
                ->with([
                    'success' => true,
                    'message' => 'Coupon updated successfully.',
                    'data' => $updatedCoupon
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with([
                    'error' => true,
                    'message' => 'Failed to update coupon: ' . $e->getMessage()
                ])
                ->withInput();
        }
    }

    public function destroy(Coupon $coupon): RedirectResponse
    {
        try {
            DB::beginTransaction();

            // Get fresh coupon with usage stats
            $coupon = $this->couponService->getWithStats($coupon->id);

            // Delete the coupon
            $this->couponService->delete($coupon->id);

            DB::commit();

            return redirect()
                ->back()
                ->with([
                    'success' => true,
                    'message' => 'Coupon deleted successfully.'
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete coupon', [
                'coupon_id' => $coupon->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with([
                    'error' => true,
                    'message' => $e->getMessage()
                ]);
        }
    }

    public function updateStatus(Request $request, Coupon $coupon): RedirectResponse
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'is_active' => 'required|boolean'
            ]);

            // Get fresh coupon with stats
            $coupon = $this->couponService->getWithStats($coupon->id);

            // Check if status can be changed
            if ($validated['is_active'] && !$this->couponService->canBeActivated($coupon)) {
                throw new \Exception('This coupon cannot be activated.');
            }

            // Update status
            $updatedCoupon = $this->couponService->updateStatus($coupon->id, $validated['is_active']);

            DB::commit();

            return redirect()
                ->back()
                ->with([
                    'success' => true,
                    'message' => 'Coupon ' . ($validated['is_active'] ? 'activated' : 'deactivated') . ' successfully.',
                    'data' => $updatedCoupon
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update coupon status', [
                'coupon_id' => $coupon->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with([
                    'error' => true,
                    'message' => $e->getMessage()
                ]);
        }
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:coupons,id'
        ]);

        try {
            $this->couponService->bulkDelete($validated['ids']);

            return redirect()
                ->back()
                ->with('success', 'Coupons deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete coupons: ' . $e->getMessage()]);
        }
    }

    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:coupons,id',
            'is_active' => 'required|boolean'
        ]);

        try {
            $this->couponService->bulkUpdateStatus($validated['ids'], $validated['is_active']);

            return redirect()
                ->back()
                ->with('success', 'Coupons status updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update coupons status: ' . $e->getMessage()]);
        }
    }

    public function validate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string',
            'order_amount' => 'required|numeric|min:0',
        ]);

        try {
            $result = $this->couponService->validateCoupon(
                $validated['code'],
                $validated['order_amount'],
                Auth::user()
            );

            return redirect()
                ->back()
                ->with('success', 'Coupon is valid.')
                ->with('data', $result);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function usage(Coupon $coupon): Response
    {
        try {
            $usageData = $coupon->users()
                ->withPivot('order_id', 'discount_amount', 'created_at')
                ->orderByPivot('created_at', 'desc')
                ->paginate(10);

            return Inertia::render('Admin/Coupons/Usage', [
                'coupon' => $coupon->load('users'),
                'usage' => [
                    'data' => $usageData->items(),
                    'meta' => [
                        'current_page' => $usageData->currentPage(),
                        'last_page' => $usageData->lastPage(),
                        'per_page' => $usageData->perPage(),
                        'total' => $usageData->total(),
                        'from' => $usageData->firstItem() ?? 0,
                        'to' => $usageData->lastItem() ?? 0,
                    ],
                ],
                'stats' => [
                    'total_uses' => $coupon->used_count,
                    'max_uses' => $coupon->max_uses,
                    'total_discount' => $coupon->users()
                        ->sum('coupon_usage.discount_amount'),
                    'unique_users' => $coupon->users()->distinct()->count(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load coupon usage', [
                'coupon_id' => $coupon->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->route('app.coupons.index')
                ->with('error', 'Failed to load coupon usage data.');
        }
    }

    public function settings(Coupon $coupon): Response
    {
        return Inertia::render('Admin/Coupons/Settings', [
            'coupon' => $coupon,
        ]);
    }
} 