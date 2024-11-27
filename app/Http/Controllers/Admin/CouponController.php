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

final class CouponController extends Controller
{
    public function __construct(
        private readonly CouponService $couponService
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'type' => $request->input('type'),
            'per_page' => $request->input('per_page', 10),
        ];

        $coupons = $this->couponService->getPaginated($filters);

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
            'stats' => [
                'total' => Coupon::count(),
                'active' => Coupon::active()->count(),
                'expired' => Coupon::expired()->count(),
            ],
            'can' => [
                'create' => Auth::user()?->can('coupon.create'),
                'edit' => Auth::user()?->can('coupon.edit'),
                'delete' => Auth::user()?->can('coupon.delete'),
                'manage' => Auth::user()?->can('manage.coupons'),
            ],
        ]);
    }

    public function store(CouponRequest $request): RedirectResponse
    {
        try {
            $this->couponService->store($request->validated());

            return redirect()
                ->back()
                ->with('success', 'Coupon created successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to create coupon: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function update(CouponRequest $request, Coupon $coupon): RedirectResponse
    {
        try {
            $this->couponService->update($coupon->id, $request->validated());

            return redirect()
                ->back()
                ->with('success', 'Coupon updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update coupon: ' . $e->getMessage()])
                ->withInput();
        }
    }

    public function destroy(Coupon $coupon): RedirectResponse
    {
        try {
            $this->couponService->delete($coupon->id);

            return redirect()
                ->back()
                ->with('success', 'Coupon deleted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete coupon: ' . $e->getMessage()]);
        }
    }

    public function updateStatus(Request $request, Coupon $coupon): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'is_active' => 'required|boolean'
            ]);

            $this->couponService->updateStatus($coupon->id, $validated['is_active']);

            return redirect()
                ->back()
                ->with('success', 'Coupon status updated successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update coupon status: ' . $e->getMessage()]);
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
} 