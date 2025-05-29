<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\Checkout3Service;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

final class Checkout3Controller extends Controller
{
    public function __construct(
        private readonly Checkout3Service $checkout3Service
    ) {}

    /**
     * Display the single-page checkout
     */
    public function index(): Response
    {
        try {
            $data = $this->checkout3Service->getCheckoutPageData();
            return Inertia::render('Frontend/Checkout3/Index', $data);
        } catch (\Throwable $e) {
            return Inertia::render('Frontend/Checkout3/Index', [
                'error' => 'An error occurred while loading the checkout. Please try again later.'
            ]);
        }
    }

    /**
     * Process the checkout
     */
    public function processCheckout(Request $request): RedirectResponse
    {
        try {
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'shipping_address_id' => 'required',
                'payment_method_id' => 'required',
                'delivery_option_id' => 'required',
                'customer_info' => 'required|array',
                'customer_info.firstName' => 'required|string|max:255',
                'customer_info.lastName' => 'required|string|max:255',
                'customer_info.email' => 'required|email|max:255',
                'customer_info.phone' => 'required|string|max:20',
                'tip_amount' => 'numeric|min:0',
                'special_instructions' => 'nullable|string|max:1000',
                'promo_code' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return back()
                    ->withErrors($validator)
                    ->withInput();
            }

            // Process the checkout
            $result = $this->checkout3Service->processCheckout($request->all());

            if (!$result['success']) {
                return back()->with('error', $result['message'] ?? 'An error occurred during checkout.');
            }

            // Redirect to the success page with the order ID
            return redirect()->route('checkout3.success', ['id' => $result['order_id']]);
        } catch (ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Throwable $e) {
            return back()
                ->with('error', 'An unexpected error occurred. Please try again later.')
                ->withInput();
        }
    }

    /**
     * Apply a promo code
     */
    public function applyPromoCode(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'code' => 'required|string|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            $result = $this->checkout3Service->applyPromoCode($request->input('code'));

            return response()->json($result);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => 'An unexpected error occurred. Please try again later.',
            ], 500);
        }
    }

    /**
     * Show the checkout success page
     */
    public function success(Request $request): Response
    {
        try {
            $orderId = $request->route('id') ?? $request->query('id');
            $data = $this->checkout3Service->getSuccessPageData($orderId ? (int) $orderId : null);
            return Inertia::render('Frontend/Checkout3/Success', $data);
        } catch (\Throwable $e) {
            return Inertia::render('Frontend/Checkout3/Success', [
                'error' => 'An error occurred while loading the order details. Please check your email for confirmation.'
            ]);
        }
    }
} 