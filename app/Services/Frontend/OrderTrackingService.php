<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Services\BaseService;

final class OrderTrackingService extends BaseService
{
    /**
     * Get all data needed for the order tracking page
     */
    public function getOrderTrackingPageData(string $orderNumber = null): array
    {
        try {
            return [
                'hero' => $this->getHeroSection(),
                'order' => $this->getOrderDetails($orderNumber),
                'delivery_person' => $this->getDeliveryPersonDetails($orderNumber),
                'tracking_updates' => $this->getTrackingUpdates($orderNumber),
                'map_data' => $this->getMapData($orderNumber),
                'order_items' => $this->getOrderItems($orderNumber),
                'similar_items' => $this->getSimilarItems($orderNumber),
                'restaurant' => $this->getRestaurantDetails($orderNumber),
                'support_info' => $this->getSupportInfo(),
                'faqs' => $this->getFaqs(),
            ];
        } catch (\Throwable $e) {
            Log::error('Error fetching order tracking data: ' . $e->getMessage(), [
                'order_number' => $orderNumber,
                'exception' => $e
            ]);
            
            return [
                'hero' => $this->getHeroSection(),
                'error' => 'Unable to load order tracking data. Please try again later.'
            ];
        }
    }

    /**
     * Get hero section data
     */
    private function getHeroSection(): array
    {
        return [
            'title' => 'Track Your Order',
            'subtitle' => 'Real-time updates',
            'description' => 'Stay updated with your food delivery status in real-time.',
            'image' => '/images/hero-tracking.jpg',
            'stats' => [
                [
                    'label' => 'Orders Delivered',
                    'value' => '10K+'
                ],
                [
                    'label' => 'Avg. Delivery Time',
                    'value' => '25min'
                ],
                [
                    'label' => 'Satisfaction Rate',
                    'value' => '99%'
                ],
                [
                    'label' => 'Active Drivers',
                    'value' => '500+'
                ]
            ]
        ];
    }

    /**
     * Get order details
     */
    private function getOrderDetails(string $orderNumber = null): array
    {
        if (empty($orderNumber)) {
            return $this->getDefaultOrderDetails();
        }

        // In a real app, you would fetch this from your database
        // For now, return demo data with the actual order number
        $demoOrder = $this->getDefaultOrderDetails();
        $demoOrder['order_number'] = $orderNumber;
        
        return $demoOrder;
    }

    /**
     * Get default order details (demo data)
     */
    private function getDefaultOrderDetails(): array
    {
        $statuses = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'on_the_way', 'delivered'];
        $currentStatus = $statuses[array_rand(array_slice($statuses, 0, 6))];
        
        // Generate a random order number if none provided
        $orderNumber = 'ORD-' . strtoupper(Str::random(8));
        
        // Calculate random order time (1-60 minutes ago)
        $orderTime = now()->subMinutes(rand(1, 60));
        
        // Calculate estimated delivery time (10-40 minutes from now)
        $estimatedDelivery = now()->addMinutes(rand(10, 40));
        
        // Calculate delivery progress percentage based on status
        $statusIndex = array_search($currentStatus, $statuses);
        $totalStatuses = count($statuses) - 1; // Exclude 'delivered' from progress calc
        $progressPercentage = min(100, round(($statusIndex / $totalStatuses) * 100));
        
        return [
            'order_number' => $orderNumber,
            'status' => $currentStatus,
            'progress_percentage' => $progressPercentage,
            'order_time' => $orderTime->format('Y-m-d H:i:s'),
            'estimated_delivery_time' => $estimatedDelivery->format('Y-m-d H:i:s'),
            'estimated_delivery_minutes' => $estimatedDelivery->diffInMinutes(now()),
            'total_amount' => number_format(rand(1500, 5000) / 100, 2),
            'payment_method' => ['Credit Card', 'PayPal', 'Cash on Delivery'][rand(0, 2)],
            'delivery_address' => [
                'street' => '123 Main Street',
                'city' => 'New York',
                'state' => 'NY',
                'zip' => '10001',
                'instructions' => 'Please ring the doorbell twice.'
            ],
            'customer' => [
                'name' => 'John Doe',
                'phone' => '+1 (555) 123-4567',
                'email' => 'john.doe@example.com'
            ]
        ];
    }

    /**
     * Get delivery person details
     */
    private function getDeliveryPersonDetails(string $orderNumber = null): array
    {
        // Demo data
        return [
            'name' => 'Michael Rodriguez',
            'phone' => '+1 (555) 987-6543',
            'rating' => 4.8,
            'total_deliveries' => rand(100, 1000),
            'photo' => '/images/delivery-person-' . rand(1, 3) . '.jpg',
            'transportation' => [
                'type' => ['Bicycle', 'Motorcycle', 'Car'][rand(0, 2)],
                'color' => ['Red', 'Blue', 'Black', 'White'][rand(0, 3)],
                'model' => ['Honda CBR', 'Toyota Prius', 'Trek FX3'][rand(0, 2)],
                'license_plate' => strtoupper(Str::random(3)) . '-' . rand(1000, 9999)
            ],
            'is_online' => (bool)rand(0, 1),
            'last_seen' => now()->subMinutes(rand(0, 5))->format('Y-m-d H:i:s')
        ];
    }

    /**
     * Get tracking updates
     */
    private function getTrackingUpdates(string $orderNumber = null): array
    {
        // Base times
        $orderTime = now()->subMinutes(rand(30, 60));
        $confirmedTime = $orderTime->copy()->addMinutes(rand(1, 5));
        $preparingTime = $confirmedTime->copy()->addMinutes(rand(5, 10));
        $readyTime = $preparingTime->copy()->addMinutes(rand(5, 15));
        $pickedUpTime = $readyTime->copy()->addMinutes(rand(2, 8));
        $onTheWayTime = $pickedUpTime->copy()->addMinutes(rand(1, 3));
        $deliveredTime = $onTheWayTime->copy()->addMinutes(rand(10, 20));
        
        // Determine which statuses have already occurred
        $currentTime = now();
        
        return [
            [
                'status' => 'Order Placed',
                'description' => 'Your order has been received by our system.',
                'time' => $orderTime->format('Y-m-d H:i:s'),
                'completed' => true,
                'current' => $currentTime->lessThan($confirmedTime),
            ],
            [
                'status' => 'Order Confirmed',
                'description' => 'Restaurant has confirmed your order.',
                'time' => $confirmedTime->format('Y-m-d H:i:s'),
                'completed' => $currentTime->greaterThan($confirmedTime),
                'current' => $currentTime->greaterThan($confirmedTime) && $currentTime->lessThan($preparingTime),
            ],
            [
                'status' => 'Food Preparation',
                'description' => 'The restaurant is preparing your food.',
                'time' => $preparingTime->format('Y-m-d H:i:s'),
                'completed' => $currentTime->greaterThan($preparingTime),
                'current' => $currentTime->greaterThan($preparingTime) && $currentTime->lessThan($readyTime),
            ],
            [
                'status' => 'Ready for Pickup',
                'description' => 'Your order is ready for pickup by the delivery person.',
                'time' => $readyTime->format('Y-m-d H:i:s'),
                'completed' => $currentTime->greaterThan($readyTime),
                'current' => $currentTime->greaterThan($readyTime) && $currentTime->lessThan($pickedUpTime),
            ],
            [
                'status' => 'Picked Up',
                'description' => 'Your order has been picked up by the delivery person.',
                'time' => $pickedUpTime->format('Y-m-d H:i:s'),
                'completed' => $currentTime->greaterThan($pickedUpTime),
                'current' => $currentTime->greaterThan($pickedUpTime) && $currentTime->lessThan($onTheWayTime),
            ],
            [
                'status' => 'On the Way',
                'description' => 'Your order is on the way to your location.',
                'time' => $onTheWayTime->format('Y-m-d H:i:s'),
                'completed' => $currentTime->greaterThan($onTheWayTime),
                'current' => $currentTime->greaterThan($onTheWayTime) && $currentTime->lessThan($deliveredTime),
            ],
            [
                'status' => 'Delivered',
                'description' => 'Your order has been delivered. Enjoy your meal!',
                'time' => $deliveredTime->format('Y-m-d H:i:s'),
                'completed' => $currentTime->greaterThan($deliveredTime),
                'current' => $currentTime->greaterThan($deliveredTime),
            ]
        ];
    }

    /**
     * Get map data
     */
    private function getMapData(string $orderNumber = null): array
    {
        // Demo data - coordinates for New York City
        $customerLatitude = 40.7128;
        $customerLongitude = -74.0060;
        
        // Random offset for restaurant (0.01-0.05 degrees in any direction)
        $restaurantLatOffset = (rand(10, 50) / 1000) * (rand(0, 1) ? 1 : -1);
        $restaurantLngOffset = (rand(10, 50) / 1000) * (rand(0, 1) ? 1 : -1);
        
        $restaurantLatitude = $customerLatitude + $restaurantLatOffset;
        $restaurantLongitude = $customerLongitude + $restaurantLngOffset;
        
        // Random position for delivery person between restaurant and customer
        $progress = rand(10, 90) / 100;
        $deliveryPersonLatitude = $restaurantLatitude + ($customerLatitude - $restaurantLatitude) * $progress;
        $deliveryPersonLongitude = $restaurantLongitude + ($customerLongitude - $restaurantLongitude) * $progress;
        
        return [
            'customer_location' => [
                'lat' => $customerLatitude,
                'lng' => $customerLongitude,
                'address' => '123 Main Street, New York, NY 10001'
            ],
            'restaurant_location' => [
                'lat' => $restaurantLatitude,
                'lng' => $restaurantLongitude,
                'name' => 'Tasty Bites Restaurant',
                'address' => '456 Park Avenue, New York, NY 10022'
            ],
            'delivery_person_location' => [
                'lat' => $deliveryPersonLatitude,
                'lng' => $deliveryPersonLongitude,
                'heading' => rand(0, 359)
            ],
            'route' => [
                [
                    'lat' => $restaurantLatitude,
                    'lng' => $restaurantLongitude
                ],
                // Generate some intermediate points
                [
                    'lat' => $restaurantLatitude + ($customerLatitude - $restaurantLatitude) * 0.25,
                    'lng' => $restaurantLongitude + ($customerLongitude - $restaurantLongitude) * 0.25
                ],
                [
                    'lat' => $restaurantLatitude + ($customerLatitude - $restaurantLatitude) * 0.5,
                    'lng' => $restaurantLongitude + ($customerLongitude - $restaurantLongitude) * 0.5
                ],
                [
                    'lat' => $restaurantLatitude + ($customerLatitude - $restaurantLatitude) * 0.75,
                    'lng' => $restaurantLongitude + ($customerLongitude - $restaurantLongitude) * 0.75
                ],
                [
                    'lat' => $customerLatitude,
                    'lng' => $customerLongitude
                ]
            ],
            'zoom_level' => 14,
            'map_center' => [
                'lat' => ($customerLatitude + $restaurantLatitude) / 2,
                'lng' => ($customerLongitude + $restaurantLongitude) / 2
            ]
        ];
    }

    /**
     * Get order items
     */
    private function getOrderItems(string $orderNumber = null): array
    {
        $items = [];
        $itemCount = rand(2, 5);
        
        $dishOptions = [
            [
                'id' => 1,
                'name' => 'Margherita Pizza',
                'price' => 12.99,
                'quantity' => rand(1, 2),
                'image' => '/images/dishes/pizza-1.jpg',
                'options' => ['Size: Medium', 'Crust: Thin'],
                'restaurant' => 'Pizza Palace'
            ],
            [
                'id' => 2,
                'name' => 'Chicken Alfredo Pasta',
                'price' => 14.99,
                'quantity' => rand(1, 2),
                'image' => '/images/dishes/pasta-1.jpg',
                'options' => ['Extra cheese'],
                'restaurant' => 'Pasta Paradise'
            ],
            [
                'id' => 3,
                'name' => 'Vegetable Biryani',
                'price' => 13.50,
                'quantity' => rand(1, 2),
                'image' => '/images/dishes/biryani-1.jpg',
                'options' => ['Spice level: Medium'],
                'restaurant' => 'Spice of India'
            ],
            [
                'id' => 4,
                'name' => 'Classic Cheeseburger',
                'price' => 10.99,
                'quantity' => rand(1, 2),
                'image' => '/images/dishes/burger-1.jpg',
                'options' => ['No onions', 'Extra sauce'],
                'restaurant' => 'Burger Joint'
            ],
            [
                'id' => 5,
                'name' => 'Chicken Caesar Salad',
                'price' => 9.99,
                'quantity' => rand(1, 2),
                'image' => '/images/dishes/salad-1.jpg',
                'options' => ['Dressing on the side'],
                'restaurant' => 'Green Eats'
            ],
            [
                'id' => 6,
                'name' => 'Chocolate Brownie Sundae',
                'price' => 7.99,
                'quantity' => rand(1, 2),
                'image' => '/images/dishes/dessert-1.jpg',
                'options' => ['Extra chocolate sauce'],
                'restaurant' => 'Sweet Treats'
            ]
        ];
        
        // Select random items
        $selectedIndices = array_rand($dishOptions, min($itemCount, count($dishOptions)));
        if (!is_array($selectedIndices)) {
            $selectedIndices = [$selectedIndices];
        }
        
        foreach ($selectedIndices as $index) {
            $item = $dishOptions[$index];
            $items[] = $item;
        }
        
        return $items;
    }

    /**
     * Get similar items recommendations
     */
    private function getSimilarItems(string $orderNumber = null): array
    {
        $items = [];
        $itemCount = rand(4, 8);
        
        $dishOptions = [
            [
                'id' => 7,
                'name' => 'Pepperoni Pizza',
                'price' => 14.99,
                'image' => '/images/dishes/pizza-2.jpg',
                'restaurant' => 'Pizza Palace',
                'rating' => 4.7,
                'delivery_time' => '20-30 min'
            ],
            [
                'id' => 8,
                'name' => 'Spaghetti Bolognese',
                'price' => 13.99,
                'image' => '/images/dishes/pasta-2.jpg',
                'restaurant' => 'Pasta Paradise',
                'rating' => 4.5,
                'delivery_time' => '25-40 min'
            ],
            [
                'id' => 9,
                'name' => 'Chicken Tikka Masala',
                'price' => 15.50,
                'image' => '/images/dishes/curry-1.jpg',
                'restaurant' => 'Spice of India',
                'rating' => 4.8,
                'delivery_time' => '30-45 min'
            ],
            [
                'id' => 10,
                'name' => 'BBQ Bacon Burger',
                'price' => 12.99,
                'image' => '/images/dishes/burger-2.jpg',
                'restaurant' => 'Burger Joint',
                'rating' => 4.6,
                'delivery_time' => '15-25 min'
            ],
            [
                'id' => 11,
                'name' => 'Greek Salad',
                'price' => 8.99,
                'image' => '/images/dishes/salad-2.jpg',
                'restaurant' => 'Green Eats',
                'rating' => 4.3,
                'delivery_time' => '20-30 min'
            ],
            [
                'id' => 12,
                'name' => 'Tiramisu',
                'price' => 6.99,
                'image' => '/images/dishes/dessert-2.jpg',
                'restaurant' => 'Sweet Treats',
                'rating' => 4.9,
                'delivery_time' => '20-35 min'
            ],
            [
                'id' => 13,
                'name' => 'Chicken Wings',
                'price' => 11.99,
                'image' => '/images/dishes/wings-1.jpg',
                'restaurant' => 'Wing Haven',
                'rating' => 4.7,
                'delivery_time' => '25-40 min'
            ],
            [
                'id' => 14,
                'name' => 'Veggie Spring Rolls',
                'price' => 7.99,
                'image' => '/images/dishes/appetizer-1.jpg',
                'restaurant' => 'Asian Fusion',
                'rating' => 4.4,
                'delivery_time' => '15-30 min'
            ]
        ];
        
        // Select random items
        $selectedIndices = array_rand($dishOptions, min($itemCount, count($dishOptions)));
        if (!is_array($selectedIndices)) {
            $selectedIndices = [$selectedIndices];
        }
        
        foreach ($selectedIndices as $index) {
            $items[] = $dishOptions[$index];
        }
        
        return $items;
    }

    /**
     * Get restaurant details
     */
    private function getRestaurantDetails(string $orderNumber = null): array
    {
        // Demo data
        return [
            'id' => 1,
            'name' => 'Tasty Bites Restaurant',
            'logo' => '/images/restaurants/logo-' . rand(1, 5) . '.jpg',
            'cover_image' => '/images/restaurants/cover-' . rand(1, 5) . '.jpg',
            'rating' => number_format(rand(35, 49) / 10, 1),
            'reviews_count' => rand(100, 999),
            'cuisine_types' => ['Italian', 'American', 'Mediterranean'],
            'address' => [
                'street' => '456 Park Avenue',
                'city' => 'New York',
                'state' => 'NY',
                'zip' => '10022',
                'formatted' => '456 Park Avenue, New York, NY 10022'
            ],
            'phone' => '+1 (555) 123-7890',
            'email' => 'info@tastybites.com',
            'is_open' => true,
            'delivery_time' => '25-40 min',
            'delivery_fee' => number_format(rand(299, 599) / 100, 2),
            'minimum_order' => number_format(rand(1000, 1500) / 100, 2)
        ];
    }

    /**
     * Get support information
     */
    private function getSupportInfo(): array
    {
        return [
            'phone' => '+1 (800) 123-4567',
            'email' => 'support@restufood.com',
            'hours' => '24/7',
            'chat_url' => '/support/chat',
            'faq_url' => '/support/faq',
            'help_center_url' => '/support/help-center'
        ];
    }

    /**
     * Get FAQs
     */
    private function getFaqs(): array
    {
        return [
            [
                'question' => 'How do I contact my delivery person?',
                'answer' => 'You can call or message your delivery person directly through the app once they have been assigned to your order.'
            ],
            [
                'question' => 'What if my order is late?',
                'answer' => 'If your order is running late, you will receive notifications with updated delivery times. You can also contact customer support for assistance.'
            ],
            [
                'question' => 'Can I modify my order after placing it?',
                'answer' => 'You can modify your order if it hasn\'t been confirmed by the restaurant yet. Contact customer support immediately if you need to make changes.'
            ],
            [
                'question' => 'What if items are missing from my order?',
                'answer' => 'If items are missing, please report it in the app or contact customer support. We\'ll help resolve the issue with a refund or redelivery.'
            ],
            [
                'question' => 'How do I report issues with my delivery?',
                'answer' => 'You can report issues through the "Help" section in your order details or by contacting our customer support team.'
            ]
        ];
    }
} 