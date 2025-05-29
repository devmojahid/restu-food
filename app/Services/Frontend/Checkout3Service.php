<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

final class Checkout3Service extends BaseService
{
    /**
     * Get data for the checkout page
     */
    public function getCheckoutPageData(): array
    {
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
            'recommended_items' => $this->getRecommendedItems(),
        ];
    }

    /**
     * Get success page data
     */
    public function getSuccessPageData(?int $orderId = null): array
    {
        return [
            'order' => $this->getOrderDetails($orderId),
            'tracking' => $this->getOrderTracking($orderId),
            'recommended_items' => $this->getRecommendedItems(),
        ];
    }

    /**
     * Get hero section data
     */
    private function getHeroSection(): array
    {
        return [
            'title' => 'Express Checkout',
            'subtitle' => 'Quick & Seamless',
            'description' => 'Complete your order with our streamlined single-page checkout',
            'image' => '/images/checkout-hero-3.jpg',
            'animation' => 'fade-in-up',
            'stats' => [
                ['label' => 'Secure Payment', 'value' => '100%', 'icon' => 'lock'],
                ['label' => 'Fast Delivery', 'value' => '30 min', 'icon' => 'truck'],
                ['label' => 'Customer Satisfaction', 'value' => '4.9/5', 'icon' => 'star']
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
                'id' => 1,
                'name' => 'Margherita Pizza',
                'price' => 12.99,
                'quantity' => 1,
                'image' => '/images/dishes/margherita-pizza.jpg',
                'restaurant' => [
                    'name' => 'Pizza Paradise',
                    'id' => 1,
                    'slug' => 'pizza-paradise'
                ],
                'options' => [
                    'size' => 'Medium',
                    'crust' => 'Thin',
                ],
                'special_instructions' => 'Extra cheese please',
                'is_vegetarian' => true,
                'preparation_time' => '15 min'
            ],
            [
                'id' => 2,
                'name' => 'Caesar Salad',
                'price' => 8.99,
                'quantity' => 1,
                'image' => '/images/dishes/caesar-salad.jpg',
                'restaurant' => [
                    'name' => 'Pizza Paradise',
                    'id' => 1,
                    'slug' => 'pizza-paradise'
                ],
                'options' => [
                    'dressing' => 'On side',
                    'croutons' => 'Yes',
                ],
                'special_instructions' => 'No onions',
                'is_vegetarian' => true,
                'preparation_time' => '5 min'
            ],
            [
                'id' => 3,
                'name' => 'Chicken Wings',
                'price' => 14.99,
                'quantity' => 2,
                'image' => '/images/dishes/chicken-wings.jpg',
                'restaurant' => [
                    'name' => 'Pizza Paradise',
                    'id' => 1,
                    'slug' => 'pizza-paradise'
                ],
                'options' => [
                    'flavor' => 'Buffalo',
                    'spice_level' => 'Medium',
                ],
                'special_instructions' => 'Extra sauce on the side',
                'is_vegetarian' => false,
                'preparation_time' => '20 min'
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

        $tax = $subtotal * 0.0825; // 8.25% tax
        $deliveryFee = 3.99;
        $serviceFee = 1.99;

        return [
            'subtotal' => $subtotal,
            'tax' => $tax,
            'delivery_fee' => $deliveryFee,
            'service_fee' => $serviceFee,
            'discount' => 0,
            'tip' => 0,
            'total' => $subtotal + $tax + $deliveryFee + $serviceFee,
            'currency' => 'USD',
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
                'address_line_1' => '123 Main St',
                'address_line_2' => 'Apt 4B',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10001',
                'country' => 'USA',
                'phone' => '+1 (212) 555-1234',
                'is_default' => true,
                'type' => 'home',
                'coordinates' => [
                    'lat' => 40.7128,
                    'lng' => -74.0060
                ]
            ],
            [
                'id' => 2,
                'name' => 'Work',
                'address_line_1' => '85 5th Ave',
                'address_line_2' => 'Floor 22',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10003',
                'country' => 'USA',
                'phone' => '+1 (212) 555-5678',
                'is_default' => false,
                'type' => 'work',
                'coordinates' => [
                    'lat' => 40.7372,
                    'lng' => -73.9903
                ]
            ],
            [
                'id' => 3,
                'name' => "Friend's Place",
                'address_line_1' => '500 W 42nd St',
                'address_line_2' => 'Apt 25C',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10036',
                'country' => 'USA',
                'phone' => '+1 (212) 555-9876',
                'is_default' => false,
                'type' => 'other',
                'coordinates' => [
                    'lat' => 40.7592,
                    'lng' => -73.9957
                ]
            ]
        ];
    }

    /**
     * Get payment methods
     */
    private function getPaymentMethods(): array
    {
        return [
            [
                'id' => 'card_visa_1234',
                'type' => 'card',
                'brand' => 'Visa',
                'last4' => '1234',
                'exp_month' => '12',
                'exp_year' => '2025',
                'holder_name' => 'John Smith',
                'is_default' => true
            ],
            [
                'id' => 'card_mastercard_5678',
                'type' => 'card',
                'brand' => 'Mastercard',
                'last4' => '5678',
                'exp_month' => '08',
                'exp_year' => '2024',
                'holder_name' => 'John Smith',
                'is_default' => false
            ],
            [
                'id' => 'paypal_user',
                'type' => 'paypal',
                'email' => 'john.smith@example.com',
                'is_default' => false
            ],
            [
                'id' => 'apple_pay',
                'type' => 'apple_pay',
                'is_default' => false
            ],
            [
                'id' => 'cash_on_delivery',
                'type' => 'cash',
                'name' => 'Cash on Delivery',
                'is_default' => false
            ]
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
     * Get delivery options
     */
    private function getDeliveryOptions(): array
    {
        return [
            [
                'id' => 'standard',
                'name' => 'Standard Delivery',
                'description' => 'Estimated delivery time: 30-45 minutes',
                'price' => 3.99,
                'is_default' => true,
                'estimated_time' => '30-45 min',
                'min_order_free_delivery' => 25.00
            ],
            [
                'id' => 'express',
                'name' => 'Express Delivery',
                'description' => 'Estimated delivery time: 15-25 minutes',
                'price' => 7.99,
                'is_default' => false,
                'estimated_time' => '15-25 min',
                'min_order_free_delivery' => 50.00
            ],
            [
                'id' => 'scheduled',
                'name' => 'Scheduled Delivery',
                'description' => 'Choose a specific time for delivery',
                'price' => 3.99,
                'is_default' => false,
                'estimated_time' => 'As scheduled',
                'min_order_free_delivery' => 25.00,
                'schedule_options' => [
                    'today' => ['11:00 AM', '12:00 PM', '1:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'],
                    'tomorrow' => ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'],
                ],
            ]
        ];
    }

    /**
     * Get promo codes
     */
    private function getPromoCodes(): array
    {
        return [
            [
                'code' => 'WELCOME15',
                'description' => '15% off your first order',
                'discount_type' => 'percentage',
                'discount_value' => 15,
                'minimum_order' => 20,
                'valid_until' => '2023-12-31',
                'is_one_time' => true
            ],
            [
                'code' => 'FREESHIP',
                'description' => 'Free shipping on orders over $25',
                'discount_type' => 'fixed',
                'discount_value' => 3.99,
                'minimum_order' => 25,
                'valid_until' => '2023-12-31',
                'is_one_time' => false
            ],
            [
                'code' => 'SAVE10',
                'description' => '$10 off orders over $50',
                'discount_type' => 'fixed',
                'discount_value' => 10,
                'minimum_order' => 50,
                'valid_until' => '2023-12-31',
                'is_one_time' => false
            ]
        ];
    }

    /**
     * Get recommended items
     */
    private function getRecommendedItems(): array
    {
        return [
            [
                'id' => 4,
                'name' => 'Chocolate Brownie',
                'price' => 5.99,
                'description' => 'Warm chocolate brownie with vanilla ice cream',
                'image' => '/images/dishes/brownie.jpg',
                'category' => 'Dessert',
                'restaurant' => [
                    'name' => 'Pizza Paradise',
                    'id' => 1,
                    'slug' => 'pizza-paradise'
                ],
                'rating' => 4.8,
                'reviews_count' => 45,
                'is_vegetarian' => true
            ],
            [
                'id' => 5,
                'name' => 'Garlic Bread',
                'price' => 4.99,
                'description' => 'Freshly baked garlic bread with herbs',
                'image' => '/images/dishes/garlic-bread.jpg',
                'category' => 'Sides',
                'restaurant' => [
                    'name' => 'Pizza Paradise',
                    'id' => 1,
                    'slug' => 'pizza-paradise'
                ],
                'rating' => 4.6,
                'reviews_count' => 32,
                'is_vegetarian' => true
            ],
            [
                'id' => 6,
                'name' => 'Tiramisu',
                'price' => 6.99,
                'description' => 'Classic Italian dessert with coffee and mascarpone',
                'image' => '/images/dishes/tiramisu.jpg',
                'category' => 'Dessert',
                'restaurant' => [
                    'name' => 'Pizza Paradise',
                    'id' => 1,
                    'slug' => 'pizza-paradise'
                ],
                'rating' => 4.9,
                'reviews_count' => 28,
                'is_vegetarian' => true
            ],
            [
                'id' => 7,
                'name' => 'Cheesy Fries',
                'price' => 5.99,
                'description' => 'Crispy fries topped with melted cheese and herbs',
                'image' => '/images/dishes/cheesy-fries.jpg',
                'category' => 'Sides',
                'restaurant' => [
                    'name' => 'Pizza Paradise',
                    'id' => 1,
                    'slug' => 'pizza-paradise'
                ],
                'rating' => 4.5,
                'reviews_count' => 37,
                'is_vegetarian' => true
            ]
        ];
    }

    /**
     * Get order details
     */
    private function getOrderDetails(?int $orderId): array
    {
        $orderNumber = $orderId ?? rand(10000, 99999);
        
        return [
            'id' => $orderNumber,
            'number' => 'ORD-' . $orderNumber,
            'created_at' => now()->toDateTimeString(),
            'items' => $this->getCartItems(),
            'status' => 'confirmed',
            'delivery_address' => $this->getDefaultAddress(),
            'payment_method' => $this->getDefaultPaymentMethod(),
            'delivery_option' => $this->getDeliveryOptions()[0],
            'summary' => $this->getOrderSummary(),
            'estimated_delivery' => now()->addMinutes(30)->format('h:i A'),
            'contact' => [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'phone' => '+1 (212) 555-1234'
            ]
        ];
    }

    /**
     * Get order tracking details
     */
    private function getOrderTracking(?int $orderId): array
    {
        return [
            'current_status' => 'preparing',
            'estimated_delivery_time' => now()->addMinutes(30)->format('h:i A'),
            'restaurant_name' => 'Pizza Paradise',
            'restaurant_address' => '789 Pizzeria St, New York, NY 10022',
            'restaurant_phone' => '+1 (212) 555-7890',
            'delivery_person' => [
                'name' => 'Michael Johnson',
                'phone' => '+1 (917) 555-4321',
                'rating' => 4.8,
                'photo' => '/images/delivery/driver-1.jpg',
                'vehicle' => 'Honda Scooter (Red)',
                'vehicle_number' => 'NY 12345'
            ],
            'tracking_steps' => [
                [
                    'status' => 'confirmed',
                    'title' => 'Order Confirmed',
                    'description' => 'Your order has been received',
                    'time' => now()->subMinutes(5)->format('h:i A'),
                    'completed' => true
                ],
                [
                    'status' => 'preparing',
                    'title' => 'Preparing Your Order',
                    'description' => 'The restaurant is preparing your food',
                    'time' => now()->format('h:i A'),
                    'completed' => true
                ],
                [
                    'status' => 'ready_for_pickup',
                    'title' => 'Ready for Pickup',
                    'description' => 'Your order is ready for pickup by delivery person',
                    'time' => now()->addMinutes(10)->format('h:i A'),
                    'completed' => false
                ],
                [
                    'status' => 'on_the_way',
                    'title' => 'On the Way',
                    'description' => 'Your order is on the way',
                    'time' => now()->addMinutes(15)->format('h:i A'),
                    'completed' => false
                ],
                [
                    'status' => 'delivered',
                    'title' => 'Delivered',
                    'description' => 'Enjoy your meal!',
                    'time' => now()->addMinutes(30)->format('h:i A'),
                    'completed' => false
                ]
            ]
        ];
    }

    /**
     * Apply a promo code
     */
    public function applyPromoCode(string $code): array
    {
        $promoCodes = $this->getPromoCodes();
        $foundPromo = null;
        
        foreach ($promoCodes as $promo) {
            if (strtoupper($promo['code']) === strtoupper($code)) {
                $foundPromo = $promo;
                break;
            }
        }
        
        if (!$foundPromo) {
            return ['success' => false, 'error' => 'Invalid promo code'];
        }
        
        // Get the order summary
        $summary = $this->getOrderSummary();
        
        // Check minimum order requirement
        if ($summary['subtotal'] < $foundPromo['minimum_order']) {
            return [
                'success' => false, 
                'error' => "Order must be at least $" . $foundPromo['minimum_order'] . " to use this code"
            ];
        }
        
        // Calculate discount based on type
        $discount = 0;
        if ($foundPromo['discount_type'] === 'percentage') {
            $discount = $summary['subtotal'] * ($foundPromo['discount_value'] / 100);
        } else {
            $discount = $foundPromo['discount_value'];
        }
        
        // Ensure discount doesn't exceed total
        $maxDiscount = $summary['subtotal'] + $summary['delivery_fee'];
        $discount = min($discount, $maxDiscount);
        
        return [
            'success' => true,
            'promo_code' => $foundPromo,
            'discount' => $discount,
            'total_after_discount' => $summary['total'] - $discount,
            'message' => 'Promo code applied successfully!'
        ];
    }

    /**
     * Process checkout
     */
    public function processCheckout(array $data): array
    {
        // In a real application, this would handle payment processing,
        // order creation, etc.
        
        $orderId = rand(10000, 99999);
        
        return [
            'success' => true,
            'order_id' => $orderId,
            'message' => 'Order processed successfully!'
        ];
    }
} 