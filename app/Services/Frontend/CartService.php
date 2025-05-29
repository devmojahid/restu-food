<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use App\Services\BaseService;

final class CartService extends BaseService
{
    /**
     * Get all cart page data
     */
    public function getCartPageData(): array
    {
        try {
            return [
                'hero' => $this->getHeroSection(),
                'cart_items' => $this->getCartItems(),
                'summary' => $this->getOrderSummary(),
                'addresses' => $this->getDeliveryAddresses(),
                'payment_methods' => $this->getPaymentMethods(),
                'promo_codes' => $this->getPromoCodes(),
                'recommended_items' => $this->getRecommendedItems(),
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
                'promo_codes' => [],
                'recommended_items' => [],
                'error' => 'Failed to load cart data. Please try again later.',
            ];
        }
    }

    /**
     * Get hero section content
     */
    private function getHeroSection(): array
    {
        return [
            'title' => 'Your Cart',
            'subtitle' => 'Complete Your Order',
            'description' => 'Review your cart, select delivery options, and proceed to checkout.',
            'image' => '/images/hero-cart.jpg',
            'stats' => [
                [
                    'label' => 'Items in Cart',
                    'value' => count($this->getCartItems()),
                ],
                [
                    'label' => 'Delivery Time',
                    'value' => '30-45 min',
                ],
                [
                    'label' => 'Free Delivery',
                    'value' => 'Orders $30+',
                ],
                [
                    'label' => 'Payment Methods',
                    'value' => count($this->getPaymentMethods()),
                ],
            ],
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
            [
                'id' => '4',
                'name' => 'Chocolate Milkshake',
                'slug' => 'chocolate-milkshake',
                'price' => 5.99,
                'quantity' => 2,
                'image' => '/images/dishes/drink-1.jpg',
                'restaurant' => [
                    'id' => '1',
                    'name' => 'Burger King',
                    'slug' => 'burger-king',
                ],
                'options' => [
                    'Size' => 'Large',
                    'Whipped Cream' => 'Yes',
                ],
                'instructions' => '',
                'is_available' => true,
            ],
            [
                'id' => '5',
                'name' => 'French Fries',
                'slug' => 'french-fries',
                'price' => 3.99,
                'quantity' => 2,
                'image' => '/images/dishes/sides-1.jpg',
                'restaurant' => [
                    'id' => '1',
                    'name' => 'Burger King',
                    'slug' => 'burger-king',
                ],
                'options' => [
                    'Size' => 'Large',
                    'Salt' => 'Regular',
                ],
                'instructions' => 'Extra crispy if possible',
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
        $discount = isset($this->getActivePromoCode()['discount']) ? $this->getActivePromoCode()['discount'] : 0;
        $discountAmount = $subtotal * ($discount / 100);
        $total = $subtotal + $tax + $delivery - $discountAmount;

        return [
            'subtotal' => round($subtotal, 2),
            'tax' => round($tax, 2),
            'delivery_fee' => round($delivery, 2),
            'discount' => round($discountAmount, 2),
            'discount_percent' => $discount,
            'total' => round($total, 2),
            'currency' => 'USD',
            'free_delivery_threshold' => 30.00,
            'min_order_amount' => 10.00,
            'active_promo' => $this->getActivePromoCode(),
        ];
    }

    /**
     * Get default order summary (for empty cart)
     */
    private function getDefaultOrderSummary(): array
    {
        return [
            'subtotal' => 0,
            'tax' => 0,
            'delivery_fee' => 3.99,
            'discount' => 0,
            'discount_percent' => 0,
            'total' => 0,
            'currency' => 'USD',
            'free_delivery_threshold' => 30.00,
            'min_order_amount' => 10.00,
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
                'id' => '1',
                'name' => 'Home',
                'address_line1' => '123 Main Street',
                'address_line2' => 'Apt 4B',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10001',
                'country' => 'USA',
                'phone' => '+1 (555) 123-4567',
                'is_default' => true,
                'delivery_instructions' => 'Ring doorbell twice',
            ],
            [
                'id' => '2',
                'name' => 'Work',
                'address_line1' => '456 Office Plaza',
                'address_line2' => 'Suite 300',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10022',
                'country' => 'USA',
                'phone' => '+1 (555) 987-6543',
                'is_default' => false,
                'delivery_instructions' => 'Leave with receptionist',
            ],
            [
                'id' => '3',
                'name' => 'Gym',
                'address_line1' => '789 Fitness Way',
                'address_line2' => '',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10018',
                'country' => 'USA',
                'phone' => '+1 (555) 555-5555',
                'is_default' => false,
                'delivery_instructions' => 'Ask for John at the front desk',
            ],
        ];
    }

    /**
     * Get payment methods
     */
    private function getPaymentMethods(): array
    {
        return [
            [
                'id' => '1',
                'type' => 'credit_card',
                'name' => 'Visa ending in 4242',
                'last_four' => '4242',
                'expiry' => '05/25',
                'icon' => 'visa',
                'is_default' => true,
            ],
            [
                'id' => '2',
                'type' => 'credit_card',
                'name' => 'Mastercard ending in 5555',
                'last_four' => '5555',
                'expiry' => '08/24',
                'icon' => 'mastercard',
                'is_default' => false,
            ],
            [
                'id' => '3',
                'type' => 'paypal',
                'name' => 'PayPal',
                'email' => 'user@example.com',
                'icon' => 'paypal',
                'is_default' => false,
            ],
            [
                'id' => '4',
                'type' => 'apple_pay',
                'name' => 'Apple Pay',
                'icon' => 'apple',
                'is_default' => false,
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
                'id' => '1',
                'code' => 'WELCOME10',
                'description' => '10% off your first order',
                'discount' => 10, // percentage
                'min_order' => 20.00,
                'expires_at' => now()->addDays(30)->toDateTimeString(),
                'is_active' => true,
            ],
            [
                'id' => '2',
                'code' => 'FREESHIP',
                'description' => 'Free shipping on orders over $15',
                'discount' => 100, // percentage of shipping
                'min_order' => 15.00,
                'applies_to' => 'shipping',
                'expires_at' => now()->addDays(15)->toDateTimeString(),
                'is_active' => true,
            ],
            [
                'id' => '3',
                'code' => 'SUMMER25',
                'description' => '25% off your order',
                'discount' => 25, // percentage
                'min_order' => 30.00,
                'max_discount' => 50.00,
                'expires_at' => now()->addDays(7)->toDateTimeString(),
                'is_active' => true,
            ],
        ];
    }

    /**
     * Get active promo code
     */
    private function getActivePromoCode(): ?array
    {
        // Simulate an active promo code (would normally be stored in session/database)
        return [
            'id' => '1',
            'code' => 'WELCOME10',
            'description' => '10% off your first order',
            'discount' => 10, // percentage
        ];
    }

    /**
     * Get recommended items
     */
    private function getRecommendedItems(): array
    {
        return [
            [
                'id' => '101',
                'name' => 'Garlic Bread',
                'slug' => 'garlic-bread',
                'price' => 4.99,
                'image' => '/images/dishes/sides-2.jpg',
                'restaurant' => [
                    'id' => '2',
                    'name' => 'Pizza Hut',
                    'slug' => 'pizza-hut',
                ],
                'rating' => 4.7,
                'preparation_time' => '10 min',
            ],
            [
                'id' => '102',
                'name' => 'Mozzarella Sticks',
                'slug' => 'mozzarella-sticks',
                'price' => 6.99,
                'image' => '/images/dishes/appetizer-1.jpg',
                'restaurant' => [
                    'id' => '2',
                    'name' => 'Pizza Hut',
                    'slug' => 'pizza-hut',
                ],
                'rating' => 4.5,
                'preparation_time' => '12 min',
            ],
            [
                'id' => '103',
                'name' => 'Chocolate Brownie',
                'slug' => 'chocolate-brownie',
                'price' => 5.49,
                'image' => '/images/dishes/dessert-1.jpg',
                'restaurant' => [
                    'id' => '1',
                    'name' => 'Burger King',
                    'slug' => 'burger-king',
                ],
                'rating' => 4.8,
                'preparation_time' => '5 min',
            ],
            [
                'id' => '104',
                'name' => 'Chicken Wings',
                'slug' => 'chicken-wings',
                'price' => 8.99,
                'image' => '/images/dishes/appetizer-2.jpg',
                'restaurant' => [
                    'id' => '1',
                    'name' => 'Burger King',
                    'slug' => 'burger-king',
                ],
                'rating' => 4.6,
                'preparation_time' => '15 min',
            ],
        ];
    }
} 