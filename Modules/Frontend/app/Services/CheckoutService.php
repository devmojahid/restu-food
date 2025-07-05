<?php

declare(strict_types=1);

namespace Modules\Frontend\Services;  

use App\Services\BaseService;
use Illuminate\Support\Str;

final class CheckoutService extends BaseService
{
    /**
     * Get checkout page data
     */
    public function getCheckoutPageData(): array
    {
        try {
            return [
                'hero' => $this->getHeroSection(),
                'cart_items' => $this->getCartItems(),
                'summary' => $this->getOrderSummary(),
                'addresses' => $this->getDeliveryAddresses(),
                'payment_methods' => $this->getPaymentMethods(),
                'default_payment_method' => $this->getDefaultPaymentMethod(),
                'default_address' => $this->getDefaultAddress(),
                'delivery_options' => $this->getDeliveryOptions(),
                'promo_codes' => $this->getPromoCodes(),
                'error' => null,
            ];
        } catch (\Throwable $e) {
            report($e);
            return [
                'hero' => $this->getHeroSection(),
                'cart_items' => [],
                'summary' => $this->getDefaultOrderSummary(),
                'addresses' => [],
                'payment_methods' => [],
                'default_payment_method' => null,
                'default_address' => null,
                'delivery_options' => [],
                'promo_codes' => [],
                'error' => 'Failed to load checkout data. Please try again later.',
            ];
        }
    }

    /**
     * Get success page data
     */
    public function getSuccessPageData(): array
    {
        try {
            return [
                'hero' => [
                    'title' => 'Order Confirmed',
                    'subtitle' => 'Your order has been placed successfully!',
                    'description' => 'Thank you for your order. We\'ll keep you updated on the status.',
                    'image' => '/images/success-hero.jpg',
                ],
                'order' => $this->getOrderDetails(),
                'tracking_info' => $this->getTrackingInfo(),
                'estimated_delivery' => $this->getEstimatedDelivery(),
                'recommended_items' => $this->getRecommendedItems(),
                'error' => null,
            ];
        } catch (\Throwable $e) {
            report($e);
            return [
                'hero' => [
                    'title' => 'Order Confirmed',
                    'subtitle' => 'Your order has been placed successfully!',
                    'description' => 'Thank you for your order. We\'ll keep you updated on the status.',
                    'image' => '/images/success-hero.jpg',
                ],
                'order' => [],
                'tracking_info' => [],
                'estimated_delivery' => null,
                'recommended_items' => [],
                'error' => 'Failed to load order details. Please check your order history.',
            ];
        }
    }

    /**
     * Process checkout
     */
    public function processCheckout(
        int $shippingAddressId,
        string $paymentMethodId,
        float $tipAmount = 0,
        string $specialInstructions = ''
    ): bool {
        try {
            // In a real application, this would process the payment and create the order
            // For demo purposes, we'll just return true
            return true;
        } catch (\Throwable $e) {
            report($e);
            return false;
        }
    }

    /**
     * Update shipping address
     */
    public function updateShippingAddress(int $addressId): bool
    {
        try {
            // In a real application, this would update the user's selected shipping address
            // For demo purposes, we'll just return true
            return true;
        } catch (\Throwable $e) {
            report($e);
            return false;
        }
    }

    /**
     * Update payment method
     */
    public function updatePaymentMethod(string $paymentMethodId): bool
    {
        try {
            // In a real application, this would update the user's selected payment method
            // For demo purposes, we'll just return true
            return true;
        } catch (\Throwable $e) {
            report($e);
            return false;
        }
    }

    /**
     * Get hero section content
     */
    private function getHeroSection(): array
    {
        return [
            'title' => 'Checkout',
            'subtitle' => 'Complete Your Order',
            'description' => 'You\'re just a few steps away from enjoying your delicious meal.',
            'image' => '/images/checkout-hero.jpg',
            'steps' => [
                [
                    'id' => 1,
                    'name' => 'Delivery Address',
                    'description' => 'Choose your delivery location'
                ],
                [
                    'id' => 2,
                    'name' => 'Payment Method',
                    'description' => 'Select how you want to pay'
                ],
                [
                    'id' => 3,
                    'name' => 'Review Order',
                    'description' => 'Verify your order details'
                ],
                [
                    'id' => 4,
                    'name' => 'Confirmation',
                    'description' => 'Receive order confirmation'
                ]
            ]
        ];
    }

    /**
     * Get cart items
     */
    private function getCartItems(): array
    {
        return [
            [
                'id' => '1',
                'name' => 'Spicy Chicken Burger',
                'slug' => 'spicy-chicken-burger',
                'price' => 12.99,
                'quantity' => 2,
                'image' => '/images/dishes/burger-1.jpg',
                'restaurant' => [
                    'id' => '1',
                    'name' => 'Burger King',
                    'slug' => 'burger-king',
                ],
                'options' => [
                    'Size' => 'Large',
                    'Spice Level' => 'Medium',
                    'Add Cheese' => 'Yes',
                ],
                'instructions' => 'Extra sauce on the side please.',
                'is_available' => true,
            ],
            [
                'id' => '2',
                'name' => 'Margherita Pizza',
                'slug' => 'margherita-pizza',
                'price' => 14.50,
                'quantity' => 1,
                'image' => '/images/dishes/pizza-1.jpg',
                'restaurant' => [
                    'id' => '2',
                    'name' => 'Pizza Hut',
                    'slug' => 'pizza-hut',
                ],
                'options' => [
                    'Size' => 'Medium',
                    'Crust' => 'Thin',
                ],
                'instructions' => '',
                'is_available' => true,
            ],
            [
                'id' => '3',
                'name' => 'Chicken Caesar Salad',
                'slug' => 'chicken-caesar-salad',
                'price' => 9.99,
                'quantity' => 1,
                'image' => '/images/dishes/salad-1.jpg',
                'restaurant' => [
                    'id' => '3',
                    'name' => 'Healthy Eats',
                    'slug' => 'healthy-eats',
                ],
                'options' => [
                    'Dressing' => 'On the side',
                    'Croutons' => 'Yes',
                ],
                'instructions' => 'No onions please',
                'is_available' => true,
            ],
        ];
    }

    /**
     * Get order summary
     */
    private function getOrderSummary(): array
    {
        $cartItems = $this->getCartItems();
        $subtotal = array_reduce($cartItems, function ($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        $tax = $subtotal * 0.07; // 7% tax
        $delivery = $subtotal >= 30 ? 0 : 3.99;
        $tipOptions = [0, 2, 3, 5, 10];
        $tip = 0; // Default tip
        $discount = isset($this->getActivePromoCode()['discount']) ? $this->getActivePromoCode()['discount'] : 0;
        $discountAmount = $subtotal * ($discount / 100);
        $total = $subtotal + $tax + $delivery + $tip - $discountAmount;

        return [
            'subtotal' => round($subtotal, 2),
            'tax' => round($tax, 2),
            'delivery_fee' => round($delivery, 2),
            'tip' => round($tip, 2),
            'tip_options' => $tipOptions,
            'discount' => round($discountAmount, 2),
            'total' => round($total, 2),
            'active_promo' => $this->getActivePromoCode(),
        ];
    }

    /**
     * Get default order summary for fallback
     */
    private function getDefaultOrderSummary(): array
    {
        return [
            'subtotal' => 0,
            'tax' => 0,
            'delivery_fee' => 0,
            'tip' => 0,
            'tip_options' => [0, 2, 3, 5, 10],
            'discount' => 0,
            'total' => 0,
            'active_promo' => null,
        ];
    }

    /**
     * Get delivery addresses
     */
    private function getDeliveryAddresses(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Home',
                'recipient' => 'John Doe',
                'address_line1' => '123 Main Street',
                'address_line2' => 'Apt 4B',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10001',
                'country' => 'United States',
                'phone' => '+1 (555) 123-4567',
                'delivery_instructions' => 'Doorman building, please call upon arrival',
                'is_default' => true,
            ],
            [
                'id' => 2,
                'name' => 'Work',
                'recipient' => 'John Doe',
                'address_line1' => '456 Business Ave',
                'address_line2' => '15th Floor',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10022',
                'country' => 'United States',
                'phone' => '+1 (555) 987-6543',
                'delivery_instructions' => 'Please check in at reception',
                'is_default' => false,
            ],
            [
                'id' => 3,
                'name' => 'Apartment',
                'recipient' => 'John Doe',
                'address_line1' => '789 Residential Blvd',
                'address_line2' => 'Unit 303',
                'city' => 'Brooklyn',
                'state' => 'NY',
                'postal_code' => '11201',
                'country' => 'United States',
                'phone' => '+1 (555) 456-7890',
                'delivery_instructions' => 'Gate code: 1234',
                'is_default' => false,
            ],
        ];
    }

    /**
     * Get default address
     */
    private function getDefaultAddress(): ?array
    {
        $addresses = $this->getDeliveryAddresses();
        foreach ($addresses as $address) {
            if ($address['is_default']) {
                return $address;
            }
        }
        return count($addresses) > 0 ? $addresses[0] : null;
    }

    /**
     * Get payment methods
     */
    private function getPaymentMethods(): array
    {
        return [
            [
                'id' => 'card_visa_1234',
                'type' => 'credit_card',
                'brand' => 'visa',
                'last4' => '1234',
                'exp_month' => 12,
                'exp_year' => 2025,
                'holder_name' => 'John Doe',
                'is_default' => true,
                'icon' => '/images/payment/visa.svg',
            ],
            [
                'id' => 'card_mastercard_5678',
                'type' => 'credit_card',
                'brand' => 'mastercard',
                'last4' => '5678',
                'exp_month' => 8,
                'exp_year' => 2024,
                'holder_name' => 'John Doe',
                'is_default' => false,
                'icon' => '/images/payment/mastercard.svg',
            ],
            [
                'id' => 'paypal_johndoe',
                'type' => 'paypal',
                'email' => 'john.doe@example.com',
                'is_default' => false,
                'icon' => '/images/payment/paypal.svg',
            ],
            [
                'id' => 'apple_pay',
                'type' => 'apple_pay',
                'is_default' => false,
                'icon' => '/images/payment/apple-pay.svg',
            ],
            [
                'id' => 'google_pay',
                'type' => 'google_pay',
                'is_default' => false,
                'icon' => '/images/payment/google-pay.svg',
            ],
            [
                'id' => 'cash_on_delivery',
                'type' => 'cash',
                'is_default' => false,
                'icon' => '/images/payment/cash.svg',
            ],
        ];
    }

    /**
     * Get default payment method
     */
    private function getDefaultPaymentMethod(): ?array
    {
        $paymentMethods = $this->getPaymentMethods();
        foreach ($paymentMethods as $method) {
            if ($method['is_default']) {
                return $method;
            }
        }
        return count($paymentMethods) > 0 ? $paymentMethods[0] : null;
    }

    /**
     * Get delivery options
     */
    private function getDeliveryOptions(): array
    {
        return [
            [
                'id' => 'standard',
                'name' => 'Standard Delivery',
                'description' => 'Estimated delivery: 30-45 minutes',
                'price' => 3.99,
                'is_default' => true,
                'min_order_free_delivery' => 30.00,
            ],
            [
                'id' => 'express',
                'name' => 'Express Delivery',
                'description' => 'Estimated delivery: 15-25 minutes',
                'price' => 7.99,
                'is_default' => false,
                'min_order_free_delivery' => 50.00,
            ],
            [
                'id' => 'scheduled',
                'name' => 'Scheduled Delivery',
                'description' => 'Choose a specific time for delivery',
                'price' => 3.99,
                'is_default' => false,
                'min_order_free_delivery' => 30.00,
                'schedule_options' => [
                    'today' => ['11:00 AM', '12:00 PM', '1:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'],
                    'tomorrow' => ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'],
                ],
            ],
        ];
    }

    /**
     * Get promo codes
     */
    private function getPromoCodes(): array
    {
        return [
            [
                'code' => 'WELCOME20',
                'description' => '20% off your first order',
                'discount_type' => 'percentage',
                'discount_value' => 20,
                'min_order_value' => 25.00,
                'expiry_date' => '2023-12-31',
                'is_active' => true,
            ],
            [
                'code' => 'FREESHIP',
                'description' => 'Free shipping on all orders',
                'discount_type' => 'free_shipping',
                'discount_value' => 0,
                'min_order_value' => 0,
                'expiry_date' => '2023-11-30',
                'is_active' => true,
            ],
            [
                'code' => 'SAVE10',
                'description' => '$10 off orders of $50+',
                'discount_type' => 'fixed',
                'discount_value' => 10,
                'min_order_value' => 50.00,
                'expiry_date' => '2023-12-15',
                'is_active' => true,
            ],
        ];
    }

    /**
     * Get active promo code
     */
    private function getActivePromoCode(): ?array
    {
        // Simulate an active promo code. In a real app, this would come from the session or database
        return null;
    }

    /**
     * Get recommended items
     */
    private function getRecommendedItems(): array
    {
        return [
            [
                'id' => '101',
                'name' => 'BBQ Chicken Wings',
                'slug' => 'bbq-chicken-wings',
                'price' => 8.99,
                'image' => '/images/dishes/wings-1.jpg',
                'restaurant' => [
                    'id' => '1',
                    'name' => 'Burger King',
                    'slug' => 'burger-king',
                ],
                'rating' => 4.8,
                'ratings_count' => 245,
            ],
            [
                'id' => '102',
                'name' => 'Chocolate Brownie Sundae',
                'slug' => 'chocolate-brownie-sundae',
                'price' => 6.99,
                'image' => '/images/dishes/dessert-1.jpg',
                'restaurant' => [
                    'id' => '1',
                    'name' => 'Burger King',
                    'slug' => 'burger-king',
                ],
                'rating' => 4.9,
                'ratings_count' => 178,
            ],
            [
                'id' => '103',
                'name' => 'Garlic Breadsticks',
                'slug' => 'garlic-breadsticks',
                'price' => 4.99,
                'image' => '/images/dishes/sides-2.jpg',
                'restaurant' => [
                    'id' => '2',
                    'name' => 'Pizza Hut',
                    'slug' => 'pizza-hut',
                ],
                'rating' => 4.7,
                'ratings_count' => 156,
            ],
            [
                'id' => '104',
                'name' => 'Strawberry Smoothie',
                'slug' => 'strawberry-smoothie',
                'price' => 5.49,
                'image' => '/images/dishes/drink-2.jpg',
                'restaurant' => [
                    'id' => '3',
                    'name' => 'Healthy Eats',
                    'slug' => 'healthy-eats',
                ],
                'rating' => 4.6,
                'ratings_count' => 132,
            ],
        ];
    }

    /**
     * Get order details for success page
     */
    private function getOrderDetails(): array
    {
        $orderId = 'ORD-' . strtoupper(Str::random(8));
        $cartItems = $this->getCartItems();
        $summary = $this->getOrderSummary();
        $address = $this->getDefaultAddress();
        $paymentMethod = $this->getDefaultPaymentMethod();

        return [
            'id' => $orderId,
            'date' => now()->format('M d, Y, h:i A'),
            'status' => 'confirmed',
            'items' => $cartItems,
            'summary' => $summary,
            'shipping_address' => $address,
            'payment_method' => $paymentMethod,
            'special_instructions' => 'Please ring the doorbell upon arrival.',
        ];
    }

    /**
     * Get tracking info for success page
     */
    private function getTrackingInfo(): array
    {
        $trackingId = 'TRK-' . strtoupper(Str::random(8));
        
        return [
            'id' => $trackingId,
            'url' => route('frontend.tracking', ['id' => $trackingId]),
            'steps' => [
                [
                    'id' => 1,
                    'name' => 'Order Received',
                    'description' => 'Your order has been received and is being processed.',
                    'time' => now()->format('h:i A'),
                    'completed' => true,
                ],
                [
                    'id' => 2,
                    'name' => 'Preparing Food',
                    'description' => 'The restaurant is preparing your delicious meal.',
                    'time' => now()->addMinutes(5)->format('h:i A'),
                    'completed' => false,
                ],
                [
                    'id' => 3,
                    'name' => 'Ready for Pickup',
                    'description' => 'Your food is ready and awaiting pickup by the delivery driver.',
                    'time' => now()->addMinutes(15)->format('h:i A'),
                    'completed' => false,
                ],
                [
                    'id' => 4,
                    'name' => 'On the Way',
                    'description' => 'Your order is on the way to your location.',
                    'time' => now()->addMinutes(20)->format('h:i A'),
                    'completed' => false,
                ],
                [
                    'id' => 5,
                    'name' => 'Delivered',
                    'description' => 'Your order has been delivered. Enjoy your meal!',
                    'time' => now()->addMinutes(35)->format('h:i A'),
                    'completed' => false,
                ],
            ],
        ];
    }

    /**
     * Get estimated delivery info for success page
     */
    private function getEstimatedDelivery(): array
    {
        return [
            'time_range' => '30-45 minutes',
            'estimated_arrival' => now()->addMinutes(35)->format('h:i A'),
            'driver' => [
                'name' => 'Michael Rodriguez',
                'rating' => 4.9,
                'phone' => '+1 (555) 123-4567',
                'avatar' => '/images/drivers/driver-1.jpg',
            ],
        ];
    }

    /**
     * Get tracking page data
     */
    public function getTrackingPageData(string $trackingId): array
    {
        try {
            // In a real application, this would retrieve tracking information from a database
            // For demo purposes, we'll generate mock data based on the tracking ID
            $isValidTrackingId = preg_match('/^TRK-[A-Z0-9]{8}$/', $trackingId);
            
            if (!$isValidTrackingId) {
                throw new \InvalidArgumentException('Invalid tracking ID format');
            }
            
            // Generate a predictable "random" status based on the tracking ID
            $orderNumber = 'ORD-' . substr($trackingId, 4);
            $statusSeed = crc32($trackingId) % 5; // 0-4 for different statuses
            
            // Define status based on seed
            $currentStep = min($statusSeed + 1, 5);
            $steps = $this->getTrackingSteps($currentStep);
            
            // Get mock order details
            $order = $this->getMockOrderDetails($orderNumber, $currentStep);
            
            return [
                'hero' => [
                    'title' => 'Track Your Order',
                    'subtitle' => 'Order #' . $orderNumber,
                    'description' => 'Follow your order status in real-time',
                    'image' => '/images/tracking-hero.jpg',
                ],
                'tracking_info' => [
                    'id' => $trackingId,
                    'order_id' => $orderNumber,
                    'current_step' => $currentStep,
                    'steps' => $steps,
                ],
                'order' => $order,
                'estimated_delivery' => $this->getEstimatedDelivery($currentStep),
                'map_data' => [
                    'customer_location' => [
                        'lat' => 40.7128,
                        'lng' => -74.0060,
                    ],
                    'restaurant_location' => [
                        'lat' => 40.7305,
                        'lng' => -73.9925,
                    ],
                    'driver_location' => $currentStep >= 4 ? [
                        'lat' => 40.7200,
                        'lng' => -73.9950,
                    ] : null,
                    'zoom' => 14,
                ],
                'error' => null,
            ];
        } catch (\Throwable $e) {
            report($e);
            return [
                'hero' => [
                    'title' => 'Track Your Order',
                    'subtitle' => 'Tracking Details',
                    'description' => 'Follow your order status in real-time',
                    'image' => '/images/tracking-hero.jpg',
                ],
                'tracking_info' => null,
                'order' => null,
                'estimated_delivery' => null,
                'map_data' => null,
                'error' => 'Failed to load tracking data. Please check your tracking ID and try again.',
            ];
        }
    }

    /**
     * Get tracking steps based on current step
     */
    private function getTrackingSteps(int $currentStep): array
    {
        $now = now();
        
        return [
            [
                'id' => 1,
                'name' => 'Order Received',
                'description' => 'Your order has been received and is being processed.',
                'time' => $now->subMinutes(rand(5, 15))->format('h:i A'),
                'completed' => $currentStep >= 1,
            ],
            [
                'id' => 2,
                'name' => 'Preparing Food',
                'description' => 'The restaurant is preparing your delicious meal.',
                'time' => $currentStep >= 2 ? $now->addMinutes(5)->format('h:i A') : '--:--',
                'completed' => $currentStep >= 2,
            ],
            [
                'id' => 3,
                'name' => 'Ready for Pickup',
                'description' => 'Your food is ready and awaiting pickup by the delivery driver.',
                'time' => $currentStep >= 3 ? $now->addMinutes(15)->format('h:i A') : '--:--',
                'completed' => $currentStep >= 3,
            ],
            [
                'id' => 4,
                'name' => 'On the Way',
                'description' => 'Your order is on the way to your location.',
                'time' => $currentStep >= 4 ? $now->addMinutes(20)->format('h:i A') : '--:--',
                'completed' => $currentStep >= 4,
            ],
            [
                'id' => 5,
                'name' => 'Delivered',
                'description' => 'Your order has been delivered. Enjoy your meal!',
                'time' => $currentStep >= 5 ? $now->addMinutes(35)->format('h:i A') : '--:--',
                'completed' => $currentStep >= 5,
            ],
        ];
    }

    /**
     * Get mock order details
     */
    private function getMockOrderDetails(string $orderId, int $currentStep): array
    {
        $cartItems = $this->getCartItems();
        $subtotal = array_reduce($cartItems, function ($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);

        $tax = $subtotal * 0.07; // 7% tax
        $delivery = $subtotal >= 30 ? 0 : 3.99;
        $tip = 2.00; // Default tip
        $discount = 0;
        $total = $subtotal + $tax + $delivery + $tip - $discount;

        $statusMap = [
            1 => 'processing',
            2 => 'preparing',
            3 => 'ready_for_pickup',
            4 => 'on_the_way',
            5 => 'delivered',
        ];

        return [
            'id' => $orderId,
            'date' => now()->format('M d, Y, h:i A'),
            'status' => $statusMap[$currentStep] ?? 'processing',
            'items' => $cartItems,
            'summary' => [
                'subtotal' => round($subtotal, 2),
                'tax' => round($tax, 2),
                'delivery_fee' => round($delivery, 2),
                'tip' => round($tip, 2),
                'discount' => round($discount, 2),
                'total' => round($total, 2),
            ],
            'shipping_address' => $this->getDefaultAddress(),
            'payment_method' => $this->getDefaultPaymentMethod(),
            'special_instructions' => 'Please ring the doorbell upon arrival.',
        ];
    }
} 