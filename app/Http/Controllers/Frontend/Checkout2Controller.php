<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\Checkout2Service;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

final class Checkout2Controller extends Controller
{
    public function __construct(
        private readonly Checkout2Service $checkout2Service
    ) {}

    /**
     * Display checkout2 page
     */
    public function index(): Response
    {
        try {
            $data = $this->checkout2Service->getCheckoutPageData();
            return Inertia::render('Frontend/Checkout2/Index', $data);
        } catch (\Throwable $e) {
            return Inertia::render('Frontend/Checkout2/Index', [
                'error' => 'An error occurred while loading checkout data. Please try again later.'
            ]);
        }
    }

    /**
     * Process the checkout
     */
    public function processCheckout(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'shipping_address_id' => 'required|numeric',
            'payment_method_id' => 'required|string',
            'delivery_option_id' => 'required|string',
            'tip_amount' => 'numeric|min:0',
            'special_instructions' => 'nullable|string|max:500',
            'promo_code' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        try {
            $result = $this->checkout2Service->processCheckout($validator->validated());
            
            if ($result['success']) {
                return redirect()->route('checkout2.success', ['order_id' => $result['order_id']]);
            }
            
            return redirect()->back()->with('error', $result['message'] ?? 'An error occurred during checkout.');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to process the checkout. Please try again later.');
        }
    }

    /**
     * Update the delivery address
     */
    public function updateAddress(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'address_id' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        try {
            $result = $this->checkout2Service->updateAddress($request->address_id);
            
            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            }
            
            return redirect()->back()->with('error', $result['message'] ?? 'Failed to update address.');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'An error occurred while updating the address.');
        }
    }

    /**
     * Update the payment method
     */
    public function updatePayment(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'payment_method_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        try {
            $result = $this->checkout2Service->updatePayment($request->payment_method_id);
            
            if ($result['success']) {
                return redirect()->back()->with('success', $result['message']);
            }
            
            return redirect()->back()->with('error', $result['message'] ?? 'Failed to update payment method.');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'An error occurred while updating the payment method.');
        }
    }

    /**
     * Apply promo code
     */
    public function applyPromoCode(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'promo_code' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator);
        }

        try {
            $result = $this->checkout2Service->applyPromoCode($request->promo_code);
            
            if ($result['success']) {
                return redirect()->back()->with('success', $result['message'])->with('discount', $result['discount']);
            }
            
            return redirect()->back()->withErrors(['promo_code' => $result['error'] ?? 'Invalid promo code.']);
        } catch (\Throwable $e) {
            return redirect()->back()->withErrors(['promo_code' => 'An error occurred while applying the promo code.']);
        }
    }

    /**
     * Show order success page
     */
    public function success(Request $request): Response
    {
        try {
            $orderId = $request->query('order_id');
            $data = $this->checkout2Service->getSuccessPageData($orderId);
            return Inertia::render('Frontend/Checkout2/Success', $data);
        } catch (\Throwable $e) {
            return Inertia::render('Frontend/Checkout2/Success', [
                'error' => 'An error occurred while loading order data. Please try again later.'
            ]);
        }
    }
} 