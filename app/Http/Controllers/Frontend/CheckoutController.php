<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\CheckoutService;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

final class CheckoutController extends Controller
{
    public function __construct(
        private readonly CheckoutService $checkoutService
    ) {}

    /**
     * Display checkout page
     */
    public function index(): Response
    {
        try {
            $data = $this->checkoutService->getCheckoutPageData();
            return Inertia::render('Frontend/Checkout/Index', $data);
        } catch (\Throwable $e) {
            report($e);
            return Inertia::render('Frontend/Checkout/Index', [
                'error' => $this->getSafeErrorMessage($e)
            ]);
        }
    }

    /**
     * Process checkout
     */
    public function processCheckout(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'shipping_address_id' => 'required|integer',
                'payment_method_id' => 'required|string',
                'tip_amount' => 'nullable|numeric|min:0',
                'special_instructions' => 'nullable|string|max:500',
            ]);

            $result = $this->checkoutService->processCheckout(
                (int) $validated['shipping_address_id'],
                $validated['payment_method_id'],
                $validated['tip_amount'] ?? 0,
                $validated['special_instructions'] ?? ''
            );

            if ($result) {
                return redirect()->route('frontend.checkout.success')
                    ->with('success', 'Your order has been placed successfully!');
            }

            return redirect()->back()
                ->with('error', 'There was an error processing your order. Please try again.');
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput();
        } catch (\Throwable $e) {
            report($e);
            return redirect()->back()
                ->with('error', $this->getSafeErrorMessage($e))
                ->withInput();
        }
    }

    /**
     * Update shipping address
     */
    public function updateShippingAddress(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'address_id' => 'required|integer',
            ]);

            $result = $this->checkoutService->updateShippingAddress((int) $validated['address_id']);

            if ($result) {
                return redirect()->back()
                    ->with('success', 'Shipping address updated successfully.');
            }

            return redirect()->back()
                ->with('error', 'Failed to update shipping address.');
        } catch (\Throwable $e) {
            report($e);
            return redirect()->back()
                ->with('error', $this->getSafeErrorMessage($e));
        }
    }

    /**
     * Update payment method
     */
    public function updatePaymentMethod(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'payment_method_id' => 'required|string',
            ]);

            $result = $this->checkoutService->updatePaymentMethod($validated['payment_method_id']);

            if ($result) {
                return redirect()->back()
                    ->with('success', 'Payment method updated successfully.');
            }

            return redirect()->back()
                ->with('error', 'Failed to update payment method.');
        } catch (\Throwable $e) {
            report($e);
            return redirect()->back()
                ->with('error', $this->getSafeErrorMessage($e));
        }
    }

    /**
     * Display checkout success page
     */
    public function success(): Response
    {
        try {
            $data = $this->checkoutService->getSuccessPageData();
            return Inertia::render('Frontend/Checkout/Success', $data);
        } catch (\Throwable $e) {
            report($e);
            return Inertia::render('Frontend/Checkout/Success', [
                'error' => $this->getSafeErrorMessage($e)
            ]);
        }
    }

    /**
     * Display tracking page for an order
     */
    public function tracking(string $id): Response
    {
        try {
            $data = $this->checkoutService->getTrackingPageData($id);
            return Inertia::render('Frontend/Checkout/Tracking', $data);
        } catch (\Throwable $e) {
            report($e);
            return Inertia::render('Frontend/Checkout/Tracking', [
                'error' => $this->getSafeErrorMessage($e)
            ]);
        }
    }

    /**
     * Get safe error message for frontend
     */
    private function getSafeErrorMessage(\Throwable $e): string
    {
        if (app()->environment('production')) {
            return 'An unexpected error occurred. Please try again later.';
        }

        return $e->getMessage();
    }
} 