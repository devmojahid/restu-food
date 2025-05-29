<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;
use App\Support\CartCalculator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

final class Cart2Service extends BaseService
{
    /**
     * Get all data needed for the Cart2 page
     * 
     * @return array
     */
    public function getCart2PageData(): array
    {
        try {
            return [
                'hero' => $this->getHeroSection(),
                'cart_items' => $this->getCartItems(),
                'recommended_items' => $this->getRecommendedItems(),
                'recent_items' => $this->getRecentItems(),
                'saved_for_later' => $this->getSavedForLaterItems(),
                'user_addresses' => $this->getUserAddresses(),
                'payment_methods' => $this->getPaymentMethods(),
                'summary' => $this->getCartSummary(),
                'promocodes' => $this->getAvailablePromoCodes(),
                'delivery_options' => $this->getDeliveryOptions(),
            ];
        } catch (\Throwable $e) {
            Log::error('Failed to get cart2 page data: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString()
            ]);
            
            return [
                'hero' => $this->getHeroSection(),
                'cart_items' => [],
                'recommended_items' => [],
                'recent_items' => [],
                'saved_for_later' => [],
                'user_addresses' => [],
                'payment_methods' => [],
                'summary' => $this->getDefaultCartSummary(),
                'promocodes' => [],
                'delivery_options' => $this->getDefaultDeliveryOptions(),
                'error' => 'Unable to retrieve cart data. Please try again later.'
            ];
        }
    }

    /**
     * Get hero section data
     * 
     * @return array
     */
    private function getHeroSection(): array
    {
        return [
            'title' => 'Your Shopping Cart',
            'subtitle' => 'Review & Checkout',
            'description' => 'Review your items, apply promo codes, and complete your purchase',
            'image' => '/images/hero/cart-hero.jpg',
            'stats' => [
                [
                    'label' => 'Secure Checkout',
                    'value' => '100%'
                ],
                [
                    'label' => 'Delivery Options',
                    'value' => '3+'
                ],
                [
                    'label' => 'Payment Methods',
                    'value' => '5+'
                ],
                [
                    'label' => 'Customer Support',
                    'value' => '24/7'
                ]
            ]
        ];
    }

    /**
     * Get cart items
     * 
     * @return array
     */
    private function getCartItems(): array
    {
        // In a real application, this would retrieve items from the user's cart
        // For demo purposes, we'll return dummy data
        return [
            [
                'id' => 1,
                'name' => 'Spicy Chicken Burger',
                'slug' => 'spicy-chicken-burger',
                'description' => 'Juicy chicken patty with spicy sauce and fresh vegetables',
                'image' => '/images/dishes/burger-1.jpg',
                'price' => 9.99,
                'discount' => 0,
                'quantity' => 2,
                'restaurant' => [
                    'id' => 1,
                    'name' => 'Burger Palace',
                    'slug' => 'burger-palace',
                    'logo' => '/images/restaurants/logo-1.jpg'
                ],
                'variations' => [
                    'Size' => 'Large',
                    'Spice Level' => 'Medium'
                ],
                'addons' => [
                    [
                        'name' => 'Extra Cheese',
                        'price' => 1.50,
                        'quantity' => 1
                    ]
                ],
                'instructions' => 'Please make it extra crispy'
            ],
            [
                'id' => 2,
                'name' => 'Margherita Pizza',
                'slug' => 'margherita-pizza',
                'description' => 'Classic pizza with tomato sauce, mozzarella and fresh basil',
                'image' => '/images/dishes/pizza-1.jpg',
                'price' => 12.99,
                'discount' => 10,
                'quantity' => 1,
                'restaurant' => [
                    'id' => 2,
                    'name' => 'Pizza Heaven',
                    'slug' => 'pizza-heaven',
                    'logo' => '/images/restaurants/logo-2.jpg'
                ],
                'variations' => [
                    'Size' => 'Medium',
                    'Crust' => 'Thin'
                ],
                'addons' => [],
                'instructions' => ''
            ],
            [
                'id' => 3,
                'name' => 'Chocolate Brownie Sundae',
                'slug' => 'chocolate-brownie-sundae',
                'description' => 'Warm chocolate brownie topped with vanilla ice cream and hot fudge',
                'image' => '/images/dishes/dessert-1.jpg',
                'price' => 6.99,
                'discount' => 0,
                'quantity' => 1,
                'restaurant' => [
                    'id' => 3,
                    'name' => 'Sweet Treats',
                    'slug' => 'sweet-treats',
                    'logo' => '/images/restaurants/logo-3.jpg'
                ],
                'variations' => [],
                'addons' => [
                    [
                        'name' => 'Extra Ice Cream',
                        'price' => 1.99,
                        'quantity' => 1
                    ],
                    [
                        'name' => 'Caramel Sauce',
                        'price' => 0.99,
                        'quantity' => 1
                    ]
                ],
                'instructions' => 'Extra hot fudge please'
            ]
        ];
    }

    /**
     * Get recommended items based on cart content
     * 
     * @return array
     */
    private function getRecommendedItems(): array
    {
        return [
            [
                'id' => 4,
                'name' => 'Classic French Fries',
                'slug' => 'classic-french-fries',
                'description' => 'Crispy golden french fries seasoned with sea salt',
                'image' => '/images/dishes/fries-1.jpg',
                'price' => 3.99,
                'discount' => 0,
                'restaurant' => [
                    'id' => 1,
                    'name' => 'Burger Palace',
                    'slug' => 'burger-palace'
                ],
                'rating' => 4.7,
                'reviews_count' => 326
            ],
            [
                'id' => 5,
                'name' => 'Caesar Salad',
                'slug' => 'caesar-salad',
                'description' => 'Fresh romaine lettuce with caesar dressing, croutons and parmesan',
                'image' => '/images/dishes/salad-1.jpg',
                'price' => 7.99,
                'discount' => 5,
                'restaurant' => [
                    'id' => 2,
                    'name' => 'Pizza Heaven',
                    'slug' => 'pizza-heaven'
                ],
                'rating' => 4.5,
                'reviews_count' => 218
            ],
            [
                'id' => 6,
                'name' => 'Chocolate Milkshake',
                'slug' => 'chocolate-milkshake',
                'description' => 'Rich and creamy chocolate milkshake topped with whipped cream',
                'image' => '/images/dishes/beverage-1.jpg',
                'price' => 4.99,
                'discount' => 0,
                'restaurant' => [
                    'id' => 3,
                    'name' => 'Sweet Treats',
                    'slug' => 'sweet-treats'
                ],
                'rating' => 4.8,
                'reviews_count' => 184
            ]
        ];
    }

    /**
     * Get recently viewed items
     * 
     * @return array
     */
    private function getRecentItems(): array
    {
        return [
            [
                'id' => 7,
                'name' => 'Vegetable Stir Fry',
                'slug' => 'vegetable-stir-fry',
                'description' => 'Fresh vegetables stir-fried in a savory sauce',
                'image' => '/images/dishes/stirfry-1.jpg',
                'price' => 10.99,
                'discount' => 0,
                'restaurant' => [
                    'id' => 4,
                    'name' => 'Asian Fusion',
                    'slug' => 'asian-fusion'
                ],
                'rating' => 4.6,
                'reviews_count' => 273
            ],
            [
                'id' => 8,
                'name' => 'BBQ Chicken Wings',
                'slug' => 'bbq-chicken-wings',
                'description' => 'Tender chicken wings coated in BBQ sauce',
                'image' => '/images/dishes/wings-1.jpg',
                'price' => 8.99,
                'discount' => 0,
                'restaurant' => [
                    'id' => 5,
                    'name' => 'Wing World',
                    'slug' => 'wing-world'
                ],
                'rating' => 4.9,
                'reviews_count' => 421
            ]
        ];
    }

    /**
     * Get items saved for later
     * 
     * @return array
     */
    private function getSavedForLaterItems(): array
    {
        return [
            [
                'id' => 9,
                'name' => 'Beef Tacos',
                'slug' => 'beef-tacos',
                'description' => 'Corn tortillas filled with seasoned beef, lettuce, tomato and cheese',
                'image' => '/images/dishes/taco-1.jpg',
                'price' => 8.99,
                'discount' => 0,
                'restaurant' => [
                    'id' => 6,
                    'name' => 'Taco Time',
                    'slug' => 'taco-time'
                ]
            ],
            [
                'id' => 10,
                'name' => 'Garlic Bread',
                'slug' => 'garlic-bread',
                'description' => 'Freshly baked bread with garlic butter and herbs',
                'image' => '/images/dishes/bread-1.jpg',
                'price' => 4.99,
                'discount' => 0,
                'restaurant' => [
                    'id' => 2,
                    'name' => 'Pizza Heaven',
                    'slug' => 'pizza-heaven'
                ]
            ]
        ];
    }

    /**
     * Get user addresses
     * 
     * @return array
     */
    private function getUserAddresses(): array
    {
        return [
            [
                'id' => 1,
                'type' => 'home',
                'address' => '123 Main St, Apt 4B',
                'city' => 'New York',
                'state' => 'NY',
                'zip' => '10001',
                'is_default' => true,
                'instructions' => 'Please buzz apartment 4B'
            ],
            [
                'id' => 2,
                'type' => 'work',
                'address' => '456 Park Ave, Floor 20',
                'city' => 'New York',
                'state' => 'NY',
                'zip' => '10022',
                'is_default' => false,
                'instructions' => 'Check in at reception'
            ]
        ];
    }

    /**
     * Get payment methods
     * 
     * @return array
     */
    private function getPaymentMethods(): array
    {
        return [
            [
                'id' => 1,
                'type' => 'credit_card',
                'name' => 'Visa ending in 4242',
                'icon' => 'visa',
                'is_default' => true,
                'expires' => '04/25'
            ],
            [
                'id' => 2,
                'type' => 'credit_card',
                'name' => 'Mastercard ending in 5678',
                'icon' => 'mastercard',
                'is_default' => false,
                'expires' => '09/26'
            ],
            [
                'id' => 3,
                'type' => 'paypal',
                'name' => 'PayPal',
                'icon' => 'paypal',
                'is_default' => false,
                'email' => 'user@example.com'
            ]
        ];
    }

    /**
     * Get cart summary with totals
     * 
     * @return array
     */
    private function getCartSummary(): array
    {
        $cartItems = $this->getCartItems();
        $subtotal = 0;
        $discount = 0;
        
        foreach ($cartItems as $item) {
            $itemTotal = $item['price'] * $item['quantity'];
            
            // Add addons
            if (isset($item['addons']) && is_array($item['addons'])) {
                foreach ($item['addons'] as $addon) {
                    $itemTotal += $addon['price'] * $addon['quantity'];
                }
            }
            
            $subtotal += $itemTotal;
            
            // Calculate discounts
            if (isset($item['discount']) && $item['discount'] > 0) {
                $itemDiscount = ($itemTotal * $item['discount']) / 100;
                $discount += $itemDiscount;
            }
        }
        
        $tax = $subtotal * 0.08; // 8% tax
        $deliveryFee = 3.99;
        $serviceFee = 1.99;
        $total = $subtotal - $discount + $tax + $deliveryFee + $serviceFee;
        
        return [
            'subtotal' => round($subtotal, 2),
            'discount' => round($discount, 2),
            'tax' => round($tax, 2),
            'delivery_fee' => round($deliveryFee, 2),
            'service_fee' => round($serviceFee, 2),
            'total' => round($total, 2),
            'estimated_time' => '30-45 min',
            'promo_applied' => false,
            'promo_code' => '',
            'promo_discount' => 0
        ];
    }

    /**
     * Get default cart summary when there's an error
     * 
     * @return array
     */
    private function getDefaultCartSummary(): array
    {
        return [
            'subtotal' => 0,
            'discount' => 0,
            'tax' => 0,
            'delivery_fee' => 0,
            'service_fee' => 0,
            'total' => 0,
            'estimated_time' => '30-45 min',
            'promo_applied' => false,
            'promo_code' => '',
            'promo_discount' => 0
        ];
    }

    /**
     * Get available promo codes
     * 
     * @return array
     */
    private function getAvailablePromoCodes(): array
    {
        return [
            [
                'code' => 'WELCOME10',
                'description' => '10% off your first order',
                'discount_type' => 'percentage',
                'discount_value' => 10,
                'min_order' => 20,
                'expires' => '2023-12-31',
                'terms' => 'Valid for first-time customers only. Minimum order $20.'
            ],
            [
                'code' => 'FREESHIP',
                'description' => 'Free delivery on your order',
                'discount_type' => 'delivery',
                'discount_value' => 100,
                'min_order' => 15,
                'expires' => '2023-10-31',
                'terms' => 'Valid for orders $15+. Cannot be combined with other offers.'
            ],
            [
                'code' => 'SAVE5',
                'description' => '$5 off your order',
                'discount_type' => 'fixed',
                'discount_value' => 5,
                'min_order' => 25,
                'expires' => '2023-11-15',
                'terms' => 'Valid for orders $25+. One use per customer.'
            ]
        ];
    }

    /**
     * Get delivery options
     * 
     * @return array
     */
    private function getDeliveryOptions(): array
    {
        return [
            [
                'id' => 'standard',
                'name' => 'Standard Delivery',
                'description' => 'Estimated delivery in 30-45 minutes',
                'price' => 3.99,
                'estimated_time' => '30-45 min',
                'is_default' => true
            ],
            [
                'id' => 'express',
                'name' => 'Express Delivery',
                'description' => 'Estimated delivery in 15-25 minutes',
                'price' => 6.99,
                'estimated_time' => '15-25 min',
                'is_default' => false
            ],
            [
                'id' => 'scheduled',
                'name' => 'Scheduled Delivery',
                'description' => 'Choose a delivery time up to 7 days in advance',
                'price' => 3.99,
                'estimated_time' => 'Scheduled',
                'is_default' => false
            ]
        ];
    }

    /**
     * Get default delivery options
     * 
     * @return array
     */
    private function getDefaultDeliveryOptions(): array
    {
        return [
            [
                'id' => 'standard',
                'name' => 'Standard Delivery',
                'description' => 'Estimated delivery in 30-45 minutes',
                'price' => 3.99,
                'estimated_time' => '30-45 min',
                'is_default' => true
            ]
        ];
    }
} 