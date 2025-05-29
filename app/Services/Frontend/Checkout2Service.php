<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

final class Checkout2Service extends BaseService
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
     * Get order success page data
     */
    public function getSuccessPageData(int $orderId = null): array
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
            'title' => 'Secure Checkout',
            'subtitle' => 'Easy and Fast',
            'description' => 'Complete your order with our secure and easy checkout process',
            'image' => '/images/checkout-bg.jpg',
            'steps' => [
                ['id' => 1, 'title' => 'Shipping'],
                ['id' => 2, 'title' => 'Payment'],
                ['id' => 3, 'title' => 'Review'],
            ]
        ];
    }

    /**
     * Get mock cart items
     */
    private function getCartItems(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Margherita Pizza',
                'price' => 12.99,
                'quantity' => 1,
                'image' => '/images/products/pizza-1.jpg',
                'options' => ['Size' => 'Large', 'Crust' => 'Thin']
            ],
            [
                'id' => 2,
                'name' => 'Double Cheeseburger',
                'price' => 9.99,
                'quantity' => 2,
                'image' => '/images/products/burger-1.jpg',
                'options' => ['Size' => 'Regular', 'Extras' => 'Extra Cheese']
            ],
            [
                'id' => 3,
                'name' => 'Caesar Salad',
                'price' => 6.99,
                'quantity' => 1,
                'image' => '/images/products/salad-1.jpg',
                'options' => ['Size' => 'Regular', 'Dressing' => 'Caesar']
            ],
        ];
    }

    /**
     * Get mock order summary
     */
    private function getOrderSummary(): array
    {
        $subtotal = 39.96; // 12.99 + (9.99 * 2) + 6.99
        $tax = $subtotal * 0.0825; // 8.25% tax rate
        $delivery = 2.99;
        
        return [
            'subtotal' => $subtotal,
            'tax' => $tax,
            'delivery' => $delivery,
            'discount' => 0,
            'total' => $subtotal + $tax + $delivery,
        ];
    }

    /**
     * Get mock delivery addresses
     */
    private function getDeliveryAddresses(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Home',
                'address_line1' => '123 Main Street',
                'address_line2' => 'Apt 4B',
                'city' => 'New York',
                'state' => 'NY',
                'zipcode' => '10001',
                'country' => 'USA',
                'phone' => '(212) 555-1234',
                'instructions' => 'Leave with doorman',
                'is_default' => true
            ],
            [
                'id' => 2,
                'name' => 'Work',
                'address_line1' => '555 Tech Avenue',
                'address_line2' => '7th Floor',
                'city' => 'New York',
                'state' => 'NY',
                'zipcode' => '10016',
                'country' => 'USA',
                'phone' => '(212) 555-5678',
                'instructions' => '',
                'is_default' => false
            ],
            [
                'id' => 3,
                'name' => 'Gym',
                'address_line1' => '888 Fitness Lane',
                'address_line2' => '',
                'city' => 'Brooklyn',
                'state' => 'NY',
                'zipcode' => '11201',
                'country' => 'USA',
                'phone' => '(718) 555-9876',
                'instructions' => 'Call upon arrival',
                'is_default' => false
            ]
        ];
    }

    /**
     * Get mock payment methods
     */
    private function getPaymentMethods(): array
    {
        return [
            [
                'id' => 1,
                'type' => 'card',
                'brand' => 'Visa',
                'last4' => '4242',
                'exp_month' => '12',
                'exp_year' => '2025',
                'is_default' => true
            ],
            [
                'id' => 2,
                'type' => 'card',
                'brand' => 'Mastercard',
                'last4' => '5678',
                'exp_month' => '08',
                'exp_year' => '2024',
                'is_default' => false
            ],
            [
                'id' => 3,
                'type' => 'paypal',
                'email' => 'user@example.com',
                'is_default' => false
            ],
            [
                'id' => 4,
                'type' => 'cash',
                'name' => 'Cash on Delivery',
                'is_default' => false
            ]
        ];
    }

    /**
     * Get the default payment method
     */
    private function getDefaultPaymentMethod(): array
    {
        return Arr::first($this->getPaymentMethods(), function ($method) {
            return $method['is_default'] === true;
        }, []);
    }

    /**
     * Get the default delivery address
     */
    private function getDefaultAddress(): array
    {
        return Arr::first($this->getDeliveryAddresses(), function ($address) {
            return $address['is_default'] === true;
        }, []);
    }

    /**
     * Get available delivery options
     */
    private function getDeliveryOptions(): array
    {
        return [
            [
                'id' => 'standard',
                'name' => 'Standard Delivery',
                'description' => '30-45 minutes',
                'price' => 2.99,
                'is_default' => true
            ],
            [
                'id' => 'express',
                'name' => 'Express Delivery',
                'description' => '15-30 minutes',
                'price' => 4.99,
                'is_default' => false
            ],
            [
                'id' => 'scheduled',
                'name' => 'Scheduled Delivery',
                'description' => 'Choose your delivery time',
                'price' => 3.99,
                'is_default' => false,
                'available_times' => [
                    'today' => ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'],
                    'tomorrow' => ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
                    'day_after_tomorrow' => ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM']
                ]
            ]
        ];
    }

    /**
     * Get available promo codes
     */
    private function getPromoCodes(): array
    {
        return [
            [
                'code' => 'WELCOME15',
                'description' => 'Get 15% off your first order',
                'discount_type' => 'percentage',
                'discount_value' => 15,
                'minimum_order' => 20,
                'is_one_time' => true
            ],
            [
                'code' => 'FREESHIP',
                'description' => 'Free delivery on orders over $30',
                'discount_type' => 'fixed',
                'discount_value' => 2.99,
                'minimum_order' => 30,
                'is_one_time' => false
            ],
            [
                'code' => 'SAVE10',
                'description' => 'Save $10 on orders over $50',
                'discount_type' => 'fixed',
                'discount_value' => 10,
                'minimum_order' => 50,
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
                'name' => 'Pepperoni Pizza',
                'description' => 'Classic pepperoni pizza with extra cheese and our signature sauce',
                'price' => 14.99,
                'image' => '/images/products/pizza-2.jpg',
                'rating' => 4.8,
                'discount' => 0
            ],
            [
                'id' => 5,
                'name' => 'BBQ Chicken Wings',
                'description' => 'Crispy chicken wings tossed in our tangy BBQ sauce',
                'price' => 9.99,
                'image' => '/images/products/wings-1.jpg',
                'rating' => 4.5,
                'discount' => 10
            ],
            [
                'id' => 6,
                'name' => 'Garlic Bread',
                'description' => 'Fresh baked bread with garlic butter and herbs',
                'price' => 4.99,
                'original_price' => 5.99,
                'image' => '/images/products/bread-1.jpg',
                'rating' => 4.2,
                'discount' => 15
            ],
            [
                'id' => 7,
                'name' => 'Greek Salad',
                'description' => 'Fresh salad with feta cheese, olives, and our house dressing',
                'price' => 7.99,
                'image' => '/images/products/salad-2.jpg',
                'rating' => 4.3,
                'discount' => 0
            ],
            [
                'id' => 8,
                'name' => 'Chocolate Brownie',
                'description' => 'Rich chocolate brownie with vanilla ice cream',
                'price' => 5.99,
                'image' => '/images/products/dessert-1.jpg',
                'rating' => 4.9,
                'discount' => 0
            ]
        ];
    }

    /**
     * Get order details
     */
    private function getOrderDetails(?int $id): array
    {
        $subtotal = 39.96; // 12.99 + (9.99 * 2) + 6.99
        $tax = $subtotal * 0.0825; // 8.25% tax rate
        $deliveryFee = 2.99;
        $tip = 3.00;
        
        return [
            'id' => $id ?? 10001,
            'order_number' => 'ORD-' . ($id ?? rand(10000, 99999)),
            'created_at' => now()->format('Y-m-d H:i:s'),
            'subtotal' => $subtotal,
            'tax' => $tax,
            'delivery_fee' => $deliveryFee,
            'discount' => 0,
            'tip' => $tip,
            'total' => $subtotal + $tax + $deliveryFee + $tip,
            'status' => 'processing',
            'estimated_time' => '30-45 minutes',
            'tracking_url' => '/tracking/' . ($id ?? 10001),
            'items' => $this->getCartItems(),
            'address' => $this->getDefaultAddress(),
            'delivery_option' => $this->getDeliveryOptions()[0],
            'payment_method' => $this->getDefaultPaymentMethod(),
            'special_instructions' => 'Please make sure the food is well packed. Ring the doorbell upon arrival.'
        ];
    }

    /**
     * Get order tracking info
     */
    private function getOrderTracking(?int $id): array
    {
        return [
            'order_id' => $id ?? 10001,
            'confirmed' => true,
            'confirmed_time' => now()->subMinutes(15)->format('h:i A'),
            'preparing' => true,
            'preparing_time' => now()->subMinutes(10)->format('h:i A'),
            'on_the_way' => false,
            'on_the_way_time' => null,
            'delivered' => false,
            'delivered_time' => null,
            'current_status' => 'preparing',
            'estimated_delivery' => now()->addMinutes(25)->format('h:i A')
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
        $maxDiscount = $summary['subtotal'] + $summary['delivery'];
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
            'redirect_url' => route('checkout2.success', ['order_id' => $orderId])
        ];
    }

    /**
     * Update delivery address
     */
    public function updateAddress(int $addressId): array
    {
        // In a real application, this would update the user's selected address
        return [
            'success' => true,
            'message' => 'Address updated successfully'
        ];
    }

    /**
     * Update payment method
     */
    public function updatePayment(int $paymentMethodId): array
    {
        // In a real application, this would update the user's selected payment method
        return [
            'success' => true,
            'message' => 'Payment method updated successfully'
        ];
    }
} 