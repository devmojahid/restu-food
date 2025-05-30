<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

final class RewardsService extends BaseService
{
    /**
     * Get all data needed for rewards page
     */
    public function getRewardsPageData(): array
    {
        try {
            $data = [
                'hero' => $this->getHeroSection(),
                'pointsSummary' => $this->getPointsSummary(),
                'rewardsProgram' => $this->getRewardsProgram(),
                'rewardsTiers' => $this->getRewardsTiers(),
                'availableRewards' => $this->getAvailableRewards(),
                'pointsHistory' => $this->getPointsHistory(),
                'howItWorks' => $this->getHowItWorks(),
                'faq' => $this->getFaqSection(),
                'testimonials' => $this->getTestimonialsSection(),
                'stats' => $this->getStatsSection(),
            ];

            return $data;
        } catch (\Exception $e) {
            // Log the error
            \Log::error('Error in RewardsService::getRewardsPageData: ' . $e->getMessage());
            
            // Return empty data with error message
            return [
                'error' => 'Unable to load rewards data. Please try again later.'
            ];
        }
    }

    /**
     * Get hero section data
     */
    private function getHeroSection(): array
    {
        return [
            'title' => 'Loyalty Rewards Program',
            'subtitle' => 'Earn points with every order',
            'description' => 'Join our rewards program and earn points with every order. Redeem your points for exclusive rewards and discounts.',
            'image' => '/images/rewards-hero.jpg',
            'cta' => [
                'text' => 'Start Earning',
                'link' => '/rewards/register'
            ],
            'stats' => [
                [
                    'label' => 'Points Earned',
                    'value' => '10M+',
                    'icon' => 'Trophy'
                ],
                [
                    'label' => 'Members',
                    'value' => '500K+',
                    'icon' => 'Users'
                ],
                [
                    'label' => 'Rewards Redeemed',
                    'value' => '250K+',
                    'icon' => 'Gift'
                ],
                [
                    'label' => 'Avg. Savings',
                    'value' => '15%',
                    'icon' => 'Percent'
                ]
            ]
        ];
    }

    /**
     * Get points summary for the current user
     */
    private function getPointsSummary(): array
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return [];
        }

        // In a real app, we would fetch this from the database
        return [
            'currentPoints' => 1250,
            'pointsToNextTier' => 750,
            'currentTier' => 'Silver',
            'nextTier' => 'Gold',
            'lifetime' => 4250,
            'pointsExpiring' => [
                'amount' => 300,
                'date' => '2023-12-31'
            ],
            'memberSince' => '2022-05-15',
            'progress' => 62, // percentage to next tier
            'recentActivity' => [
                [
                    'id' => 1,
                    'type' => 'earned',
                    'description' => 'Order #12345',
                    'points' => 250,
                    'date' => '2023-11-15T10:30:00'
                ],
                [
                    'id' => 2,
                    'type' => 'redeemed',
                    'description' => 'Free Delivery',
                    'points' => 300,
                    'date' => '2023-11-10T14:15:00'
                ],
                [
                    'id' => 3,
                    'type' => 'earned',
                    'description' => 'Order #12347',
                    'points' => 180,
                    'date' => '2023-11-05T19:45:00'
                ],
                [
                    'id' => 4,
                    'type' => 'earned',
                    'description' => 'Referral Bonus',
                    'points' => 300,
                    'date' => '2023-10-28T12:00:00'
                ]
            ]
        ];
    }

    /**
     * Get rewards program details
     */
    private function getRewardsProgram(): array
    {
        return [
            'title' => 'Earn & Redeem',
            'description' => 'Our loyalty program rewards you for every order. Earn points and redeem them for exclusive rewards.',
            'earnRules' => [
                [
                    'title' => 'Earn 1 Point',
                    'description' => 'For every $1 spent on orders',
                    'icon' => 'DollarSign'
                ],
                [
                    'title' => 'Bonus Points',
                    'description' => '2x points on weekend orders',
                    'icon' => 'CalendarDays'
                ],
                [
                    'title' => 'Birthday Bonus',
                    'description' => '500 points on your birthday',
                    'icon' => 'Cake'
                ],
                [
                    'title' => 'Referral Bonus',
                    'description' => '300 points for each friend referral',
                    'icon' => 'Users'
                ]
            ],
            'redeemOptions' => [
                [
                    'title' => 'Free Delivery',
                    'description' => 'No delivery fee on your next order',
                    'points' => 300,
                    'icon' => 'Truck'
                ],
                [
                    'title' => 'Free Appetizer',
                    'description' => 'Choose any appetizer for free',
                    'points' => 500,
                    'icon' => 'Utensils'
                ],
                [
                    'title' => '$10 Discount',
                    'description' => 'Get $10 off your next order',
                    'points' => 800,
                    'icon' => 'Tag'
                ],
                [
                    'title' => 'Free Meal',
                    'description' => 'Get any meal up to $25 for free',
                    'points' => 2000,
                    'icon' => 'ShoppingBag'
                ]
            ]
        ];
    }

    /**
     * Get rewards tiers information
     */
    private function getRewardsTiers(): array
    {
        return [
            'title' => 'Loyalty Tiers',
            'description' => 'The more you order, the more benefits you unlock. Climb through our tiers for exclusive rewards and benefits.',
            'tiers' => [
                [
                    'name' => 'Bronze',
                    'icon' => 'Medal',
                    'pointsRequired' => 0,
                    'color' => 'from-amber-700 to-amber-500',
                    'benefits' => [
                        'Earn 1 point per $1 spent',
                        'Birthday bonus points',
                        'Monthly newsletters with exclusive offers',
                    ],
                    'image' => 'https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
                ],
                [
                    'name' => 'Silver',
                    'icon' => 'Medal',
                    'pointsRequired' => 500,
                    'color' => 'from-gray-400 to-gray-300',
                    'benefits' => [
                        'All Bronze benefits',
                        'Earn 1.25 points per $1 spent',
                        'Free delivery once a month',
                        'Early access to new menu items',
                    ],
                    'image' => 'https://images.unsplash.com/photo-1551286923-c82d6a8ae079?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
                ],
                [
                    'name' => 'Gold',
                    'icon' => 'Award',
                    'pointsRequired' => 1000,
                    'color' => 'from-yellow-500 to-yellow-300',
                    'benefits' => [
                        'All Silver benefits',
                        'Earn 1.5 points per $1 spent',
                        'Free delivery on all orders',
                        'Monthly free appetizer',
                        'Priority customer support',
                    ],
                    'image' => 'https://images.unsplash.com/photo-1642427749670-f20e2e76ed8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
                ],
                [
                    'name' => 'Platinum',
                    'icon' => 'Gem',
                    'pointsRequired' => 2500,
                    'color' => 'from-indigo-600 to-indigo-400',
                    'benefits' => [
                        'All Gold benefits',
                        'Earn 2 points per $1 spent',
                        'Free delivery on all orders',
                        'Quarterly $25 reward credit',
                        'Exclusive tasting events',
                        'Dedicated concierge service',
                    ],
                    'image' => 'https://images.unsplash.com/photo-1551807501-9faaf45137a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
                ]
            ]
        ];
    }

    /**
     * Get available rewards for redeeming
     */
    private function getAvailableRewards(): array
    {
        return [
            'title' => 'Available Rewards',
            'description' => 'Redeem your points for these exclusive rewards. From free deliveries to discounts and special offers.',
            'rewards' => $this->getRewardsList(),
            'categories' => [
                [ 'id' => 'all', 'name' => 'All Rewards' ],
                [ 'id' => 'delivery', 'name' => 'Delivery' ],
                [ 'id' => 'food', 'name' => 'Food & Drinks' ],
                [ 'id' => 'discount', 'name' => 'Discounts' ],
                [ 'id' => 'special', 'name' => 'Special Offers' ]
            ]
        ];
    }

    /**
     * Get a list of rewards
     */
    private function getRewardsList(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Free Delivery',
                'description' => 'Get free delivery on your next order',
                'points' => 300,
                'category' => 'delivery',
                'image' => '/images/rewards/delivery.jpg',
                'featured' => true,
                'discountType' => 'delivery'
            ],
            [
                'id' => 2,
                'title' => 'Free Appetizer',
                'description' => 'Choose any appetizer for free with your meal',
                'points' => 500,
                'category' => 'food',
                'image' => '/images/rewards/appetizer.jpg',
                'featured' => false,
                'discountType' => 'item'
            ],
            [
                'id' => 3,
                'title' => '$10 Off Your Order',
                'description' => '$10 discount on your next order',
                'points' => 800,
                'category' => 'discount',
                'image' => '/images/rewards/discount.jpg',
                'featured' => true,
                'discountType' => 'amount'
            ],
            [
                'id' => 4,
                'title' => 'Free Dessert',
                'description' => 'Choose any dessert for free with your meal',
                'points' => 400,
                'category' => 'food',
                'image' => '/images/rewards/dessert.jpg',
                'featured' => false,
                'discountType' => 'item'
            ],
            [
                'id' => 5,
                'title' => '15% Off Your Order',
                'description' => '15% discount on your next order',
                'points' => 1000,
                'category' => 'discount',
                'image' => '/images/rewards/percentage.jpg',
                'featured' => false,
                'discountType' => 'percentage'
            ],
            [
                'id' => 6,
                'title' => 'Free Drink',
                'description' => 'Get a free drink with your meal',
                'points' => 300,
                'category' => 'food',
                'image' => '/images/rewards/drink.jpg',
                'featured' => false,
                'discountType' => 'item'
            ],
            [
                'id' => 7,
                'title' => 'Priority Delivery',
                'description' => 'Get priority delivery on your next 3 orders',
                'points' => 600,
                'category' => 'delivery',
                'image' => '/images/rewards/priority.jpg',
                'featured' => false,
                'discountType' => 'service'
            ],
            [
                'id' => 8,
                'title' => 'Birthday Special',
                'description' => 'Special birthday treat on your next order',
                'points' => 1200,
                'category' => 'special',
                'image' => '/images/rewards/birthday.jpg',
                'featured' => true,
                'discountType' => 'bundle'
            ]
        ];
    }

    /**
     * Get points history
     */
    private function getPointsHistory(): array
    {
        return [
            'title' => 'Points Activity',
            'description' => 'Track your points earning and spending history. View all your transactions in one place.',
            'history' => [
                [
                    'id' => 1,
                    'type' => 'earned',
                    'description' => 'Order #12345',
                    'amount' => 250,
                    'date' => '2023-11-15T10:30:00',
                    'details' => 'Points earned for your order at Restaurant Name.',
                    'orderReference' => '12345'
                ],
                [
                    'id' => 2,
                    'type' => 'redeemed',
                    'description' => 'Free Delivery',
                    'amount' => 300,
                    'date' => '2023-11-10T14:15:00',
                    'details' => 'Points redeemed for free delivery on order #12346.',
                    'orderReference' => '12346'
                ],
                [
                    'id' => 3,
                    'type' => 'earned',
                    'description' => 'Order #12347',
                    'amount' => 180,
                    'date' => '2023-11-05T19:45:00',
                    'details' => 'Points earned for your order at Another Restaurant.',
                    'orderReference' => '12347'
                ],
                [
                    'id' => 4,
                    'type' => 'earned',
                    'description' => 'Referral Bonus',
                    'amount' => 300,
                    'date' => '2023-10-28T12:00:00',
                    'details' => 'Bonus points for referring a friend.',
                    'orderReference' => null
                ],
                [
                    'id' => 5,
                    'type' => 'redeemed',
                    'description' => '$10 Discount',
                    'amount' => 800,
                    'date' => '2023-10-15T16:30:00',
                    'details' => 'Points redeemed for $10 discount on order #12348.',
                    'orderReference' => '12348'
                ],
                [
                    'id' => 6,
                    'type' => 'earned',
                    'description' => 'Order #12349',
                    'amount' => 220,
                    'date' => '2023-10-10T13:15:00',
                    'details' => 'Points earned for your order at Third Restaurant.',
                    'orderReference' => '12349'
                ],
                [
                    'id' => 7,
                    'type' => 'earned',
                    'description' => 'Birthday Bonus',
                    'amount' => 500,
                    'date' => '2023-10-05T00:00:00',
                    'details' => 'Bonus points for your birthday!',
                    'orderReference' => null
                ],
                [
                    'id' => 8,
                    'type' => 'redeemed',
                    'description' => 'Free Appetizer',
                    'amount' => 500,
                    'date' => '2023-09-20T19:30:00',
                    'details' => 'Points redeemed for a free appetizer on order #12350.',
                    'orderReference' => '12350'
                ]
            ],
            'currentPage' => 1,
            'totalPages' => 3
        ];
    }

    /**
     * Get how it works section data
     */
    private function getHowItWorks(): array
    {
        return [
            'title' => 'How It Works',
            'description' => 'Our rewards program is easy to use. Follow these simple steps to start earning and redeeming rewards.',
            'steps' => [
                [
                    'title' => 'Join the Program',
                    'description' => 'Sign up for our rewards program for free. It only takes a minute.',
                    'icon' => 'UserPlus',
                    'color' => 'bg-blue-500'
                ],
                [
                    'title' => 'Earn Points',
                    'description' => 'Earn points every time you order. The more you order, the more points you earn.',
                    'icon' => 'TrendingUp',
                    'color' => 'bg-green-500'
                ],
                [
                    'title' => 'Track Progress',
                    'description' => 'Monitor your points balance and progress towards the next tier in your account.',
                    'icon' => 'LineChart',
                    'color' => 'bg-purple-500'
                ],
                [
                    'title' => 'Redeem Rewards',
                    'description' => 'Use your points to redeem exciting rewards and discounts.',
                    'icon' => 'Gift',
                    'color' => 'bg-red-500'
                ]
            ]
        ];
    }

    /**
     * Get FAQ section data
     */
    private function getFaqSection(): array
    {
        return [
            'title' => 'Frequently Asked Questions',
            'description' => 'Find answers to common questions about our rewards program.',
            'faqs' => [
                [
                    'question' => 'How do I join the rewards program?',
                    'answer' => 'Joining is easy! You can sign up for our rewards program through our website or mobile app. Just create an account or log in to your existing account and opt in to the rewards program.'
                ],
                [
                    'question' => 'How do I earn points?',
                    'answer' => 'You earn points every time you make a purchase. You get 1 point for every $1 you spend. You can also earn bonus points through special promotions, referrals, and on your birthday.'
                ],
                [
                    'question' => 'When do my points expire?',
                    'answer' => 'Points expire 12 months after they are earned if not redeemed. Active members who make at least one purchase every 6 months may have their points extended automatically.'
                ],
                [
                    'question' => 'How do I redeem my points?',
                    'answer' => 'You can redeem your points through our website or mobile app. Simply log in to your account, go to the rewards section, and choose from the available redemption options.'
                ],
                [
                    'question' => 'How do I check my points balance?',
                    'answer' => 'You can check your points balance by logging into your account on our website or mobile app and visiting the rewards section. Your current balance will be displayed on your dashboard.'
                ],
                [
                    'question' => 'How do I move up to the next tier?',
                    'answer' => 'You move up to the next tier by earning a certain number of points within a calendar year. Bronze starts at 0 points, Silver at 500 points, Gold at 1,000 points, and Platinum at 2,500 points.'
                ],
                [
                    'question' => 'What happens to my tier status at the end of the year?',
                    'answer' => 'Your tier status is evaluated annually. If you maintain the required points threshold, you will remain at your current tier. Otherwise, you may be moved to a lower tier based on your points earned.'
                ],
                [
                    'question' => 'Can I transfer my points to someone else?',
                    'answer' => 'Currently, points cannot be transferred between accounts. They are tied to your personal account and can only be redeemed by you.'
                ]
            ],
            'contactEmail' => 'support@restufood.com',
            'contactPhone' => '+1 (555) 123-4567'
        ];
    }

    /**
     * Get testimonials section data
     */
    private function getTestimonialsSection(): array
    {
        return [
            'title' => 'What Our Members Say',
            'description' => 'Hear from people who are earning and enjoying rewards every day.',
            'testimonials' => [
                [
                    'id' => 1,
                    'name' => 'Jennifer Parker',
                    'location' => 'New York, NY',
                    'avatar' => '/images/avatar-1.jpg',
                    'rating' => 5,
                    'text' => 'I love the rewards program! I\'ve saved so much money on delivery fees and have enjoyed free appetizers with my orders. The points add up quickly.',
                    'memberSince' => '2021-03-15',
                    'memberTier' => 'Gold'
                ],
                [
                    'id' => 2,
                    'name' => 'Michael Johnson',
                    'location' => 'Chicago, IL',
                    'avatar' => '/images/avatar-2.jpg',
                    'rating' => 5,
                    'text' => 'The birthday bonus was a great surprise! I got 500 points just for having a birthday. I used those points for a free meal and it made my day special.',
                    'memberSince' => '2022-01-10',
                    'memberTier' => 'Silver'
                ],
                [
                    'id' => 3,
                    'name' => 'Sarah Williams',
                    'location' => 'Los Angeles, CA',
                    'avatar' => '/images/avatar-3.jpg',
                    'rating' => 4,
                    'text' => 'I\'ve been a member for over a year and have already redeemed multiple rewards. The points system is straightforward and the rewards are actually useful.',
                    'memberSince' => '2021-06-22',
                    'memberTier' => 'Platinum'
                ],
                [
                    'id' => 4,
                    'name' => 'David Chen',
                    'location' => 'Seattle, WA',
                    'avatar' => '/images/avatar-4.jpg',
                    'rating' => 5,
                    'text' => 'Referring friends to the rewards program has been great. I get points for each referral, and my friends get to enjoy the benefits too. It\'s a win-win!',
                    'memberSince' => '2022-02-05',
                    'memberTier' => 'Bronze'
                ],
                [
                    'id' => 5,
                    'name' => 'Amanda Rodriguez',
                    'location' => 'Miami, FL',
                    'avatar' => '/images/avatar-5.jpg',
                    'rating' => 5,
                    'text' => 'The weekend bonus points promotion is my favorite. I order most of my meals on weekends anyway, so getting double points is an awesome perk!',
                    'memberSince' => '2021-11-30',
                    'memberTier' => 'Gold'
                ]
            ]
        ];
    }

    /**
     * Get stats section data
     */
    private function getStatsSection(): array
    {
        return [
            'title' => 'Our Rewards Program by the Numbers',
            'description' => 'Join thousands of satisfied customers enjoying exclusive rewards and benefits.',
            'stats' => [
                [
                    'icon' => 'Users',
                    'value' => '500K+',
                    'label' => 'Active Members',
                    'color' => 'bg-blue-500'
                ],
                [
                    'icon' => 'Trophy',
                    'value' => '10M+',
                    'label' => 'Points Earned',
                    'color' => 'bg-amber-500'
                ],
                [
                    'icon' => 'Gift',
                    'value' => '250K+',
                    'label' => 'Rewards Redeemed',
                    'color' => 'bg-green-500'
                ],
                [
                    'icon' => 'Utensils',
                    'value' => '750K+',
                    'label' => 'Orders Made',
                    'color' => 'bg-purple-500'
                ]
            ]
        ];
    }

    /**
     * Get detailed information about a specific reward
     */
    public function getRewardDetails(int $id): array
    {
        // In a real app, we would fetch this from the database
        $allRewards = $this->getRewardsList();
        
        // Find the reward by ID
        foreach ($allRewards as $reward) {
            if ($reward['id'] === $id) {
                // Add additional details for the reward
                $reward['termsAndConditions'] = [
                    'Valid for 30 days from redemption date',
                    'Can be used once per order',
                    'Not combinable with other promotions',
                    'Applicable to orders over $15',
                    'Delivery must be within 10 miles of restaurant location'
                ];
                $reward['expiryDays'] = 30;
                $reward['code'] = 'REWARD' . $id . '2023';
                $reward['howToUse'] = 'Enter the code at checkout to apply the reward to your order.';
                $reward['createdAt'] = '2023-10-01T00:00:00';
                
                return $reward;
            }
        }
        
        // Return default reward if not found
        return [
            'id' => $id,
            'title' => 'Reward Not Found',
            'description' => 'The requested reward could not be found.',
            'points' => 0,
            'category' => 'unknown',
            'image' => '/images/rewards/default.jpg',
            'featured' => false,
            'discountType' => 'unknown'
        ];
    }

    /**
     * Get related rewards for a specific reward
     */
    public function getRelatedRewards(int $id, int $limit = 3): array
    {
        // In a real app, we would fetch related rewards from the database
        $allRewards = $this->getRewardsList();
        $currentReward = null;
        $currentCategory = null;
        
        // Find the current reward and its category
        foreach ($allRewards as $reward) {
            if ($reward['id'] === $id) {
                $currentReward = $reward;
                $currentCategory = $reward['category'];
                break;
            }
        }
        
        // If reward not found, return empty array
        if (!$currentReward) {
            return [];
        }
        
        // Find related rewards in the same category
        $relatedRewards = [];
        foreach ($allRewards as $reward) {
            // Skip the current reward
            if ($reward['id'] === $id) {
                continue;
            }
            
            // Prioritize rewards in the same category
            if ($reward['category'] === $currentCategory) {
                $relatedRewards[] = $reward;
            }
            
            // Break if we have enough related rewards
            if (count($relatedRewards) >= $limit) {
                break;
            }
        }
        
        // If we don't have enough related rewards in the same category,
        // add rewards from other categories
        if (count($relatedRewards) < $limit) {
            foreach ($allRewards as $reward) {
                // Skip the current reward and rewards already added
                if ($reward['id'] === $id || in_array($reward, $relatedRewards, true)) {
                    continue;
                }
                
                $relatedRewards[] = $reward;
                
                // Break if we have enough related rewards
                if (count($relatedRewards) >= $limit) {
                    break;
                }
            }
        }
        
        return $relatedRewards;
    }

    /**
     * Get user points
     */
    public function getUserPoints(int $userId): int
    {
        // In a real app, we would fetch this from the database
        // This is just a dummy implementation
        return 1500;
    }

    /**
     * Redeem a reward for a user
     */
    public function redeemReward(int $userId, int $rewardId): array
    {
        // In a real app, we would validate the redemption and update the database
        // This is just a dummy implementation
        $reward = $this->getRewardDetails($rewardId);
        $userPoints = $this->getUserPoints($userId);
        
        // Check if user has enough points
        if ($userPoints < $reward['points']) {
            return [
                'success' => false,
                'message' => 'You do not have enough points to redeem this reward.'
            ];
        }
        
        // In a real app, we would update the user's points balance
        // and create a record of the redemption
        
        return [
            'success' => true,
            'message' => 'Reward redeemed successfully!',
            'reward' => $reward,
            'code' => $reward['code'],
            'expiryDate' => date('Y-m-d', strtotime('+30 days'))
        ];
    }

    /**
     * Get user's rewards history
     */
    public function getUserHistory(int $userId): array
    {
        // In a real app, we would fetch this from the database
        // This is just a dummy implementation
        return $this->getPointsHistory();
    }

    /**
     * Get user's active rewards
     */
    public function getUserActiveRewards(int $userId): array
    {
        // In a real app, we would fetch this from the database
        // This is just a dummy implementation
        return [
            'title' => 'Your Active Rewards',
            'description' => 'These are the rewards you have redeemed that are still active.',
            'rewards' => [
                [
                    'id' => 1,
                    'title' => 'Free Delivery',
                    'description' => 'Get free delivery on your next order',
                    'redeemedOn' => '2023-11-10',
                    'expiresOn' => '2023-12-10',
                    'code' => 'FREEDEL2023',
                    'status' => 'active',
                    'category' => 'delivery',
                    'image' => '/images/rewards/delivery.jpg'
                ],
                [
                    'id' => 2,
                    'title' => '$10 Off Your Order',
                    'description' => '$10 discount on your next order',
                    'redeemedOn' => '2023-11-05',
                    'expiresOn' => '2023-12-05',
                    'code' => 'DISCOUNT10',
                    'status' => 'active',
                    'category' => 'discount',
                    'image' => '/images/rewards/discount.jpg'
                ]
            ]
        ];
    }
} 