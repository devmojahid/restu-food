<?php

declare(strict_types=1);

namespace Modules\Frontend\Services;  

use App\Services\BaseService;

final class SupportService extends BaseService
{
    public function getSupportPageData(): array
    {
        return [
            'hero' => $this->getHeroSection(),
            'supportCategories' => $this->getSupportCategoriesSection(),
            'faq' => $this->getFaqSection(),
            'ticketSubmission' => $this->getTicketSubmissionSection(),
            'liveChat' => $this->getLiveChatSection(),
            'contactMethods' => $this->getContactMethodsSection(),
            'resources' => $this->getResourcesSection(),
            'communitySupport' => $this->getCommunitySupportSection(),
            'statusUpdates' => $this->getStatusUpdatesSection()
        ];
    }

    private function getHeroSection(): array
    {
        return [
            'title' => 'Help Center',
            'subtitle' => 'Get the Support You Need',
            'description' => 'Find answers to your questions, contact our support team, or browse our knowledge base.',
            'image' => '/images/support/hero.jpg',
            'stats' => [
                ['label' => 'Support Response Time', 'value' => '< 30min'],
                ['label' => 'Customer Satisfaction', 'value' => '97%'],
                ['label' => 'Resolution Rate', 'value' => '94%'],
                ['label' => 'Knowledge Articles', 'value' => '500+']
            ]
        ];
    }

    private function getSupportCategoriesSection(): array
    {
        return [
            'title' => 'How Can We Help?',
            'description' => 'Select a category to find the help you need',
            'categories' => [
                [
                    'id' => 'account',
                    'title' => 'Account & Profile',
                    'description' => 'Manage your account, update profile, change password',
                    'icon' => 'User',
                    'link' => '#account',
                    'popularTopics' => [
                        ['title' => 'Reset Password', 'link' => '#reset-password'],
                        ['title' => 'Update Profile Information', 'link' => '#update-profile'],
                        ['title' => 'Change Email Address', 'link' => '#change-email']
                    ]
                ],
                [
                    'id' => 'orders',
                    'title' => 'Orders & Delivery',
                    'description' => 'Track orders, delivery issues, order modifications',
                    'icon' => 'ShoppingBag',
                    'link' => '#orders',
                    'popularTopics' => [
                        ['title' => 'Track My Order', 'link' => '#track-order'],
                        ['title' => 'Modify My Order', 'link' => '#modify-order'],
                        ['title' => 'Delivery Delays', 'link' => '#delivery-delays']
                    ]
                ],
                [
                    'id' => 'payment',
                    'title' => 'Payment & Billing',
                    'description' => 'Payment methods, refunds, gift cards',
                    'icon' => 'CreditCard',
                    'link' => '#payment',
                    'popularTopics' => [
                        ['title' => 'Refund Policy', 'link' => '#refund-policy'],
                        ['title' => 'Add Payment Method', 'link' => '#add-payment'],
                        ['title' => 'Gift Card Issues', 'link' => '#gift-cards']
                    ]
                ],
                [
                    'id' => 'technical',
                    'title' => 'Technical Support',
                    'description' => 'App and website issues, bugs, login problems',
                    'icon' => 'Laptop',
                    'link' => '#technical',
                    'popularTopics' => [
                        ['title' => 'App Crashes', 'link' => '#app-crashes'],
                        ['title' => 'Login Issues', 'link' => '#login-issues'],
                        ['title' => 'Browser Compatibility', 'link' => '#browser-compatibility']
                    ]
                ],
                [
                    'id' => 'restaurants',
                    'title' => 'Restaurant Partners',
                    'description' => 'Restaurant-specific questions, menu issues',
                    'icon' => 'Utensils',
                    'link' => '#restaurants',
                    'popularTopics' => [
                        ['title' => 'Menu Discrepancies', 'link' => '#menu-issues'],
                        ['title' => 'Restaurant Hours', 'link' => '#restaurant-hours'],
                        ['title' => 'Special Requests', 'link' => '#special-requests']
                    ]
                ],
                [
                    'id' => 'other',
                    'title' => 'Other Topics',
                    'description' => 'Promotions, accessibility, general inquiries',
                    'icon' => 'HelpCircle',
                    'link' => '#other',
                    'popularTopics' => [
                        ['title' => 'Promo Codes', 'link' => '#promo-codes'],
                        ['title' => 'Accessibility Features', 'link' => '#accessibility'],
                        ['title' => 'Partnership Inquiries', 'link' => '#partnerships']
                    ]
                ]
            ]
        ];
    }

    private function getFaqSection(): array
    {
        return [
            'title' => 'Frequently Asked Questions',
            'description' => 'Find quick answers to common questions',
            'categories' => [
                [
                    'name' => 'Account',
                    'icon' => 'User',
                    'questions' => [
                        [
                            'question' => 'How do I create an account?',
                            'answer' => 'You can create an account by clicking the "Sign Up" button in the top right corner of our website or app. You\'ll need to provide your email address, create a password, and fill in some basic information to get started.'
                        ],
                        [
                            'question' => 'How do I reset my password?',
                            'answer' => 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address, and we\'ll send you a link to reset your password. Follow the instructions in the email to create a new password.'
                        ],
                        [
                            'question' => 'Can I use the same account on multiple devices?',
                            'answer' => 'Yes, you can use your account on multiple devices. Simply log in with your email and password on any device to access your account information, order history, and saved preferences.'
                        ]
                    ]
                ],
                [
                    'name' => 'Orders',
                    'icon' => 'ShoppingBag',
                    'questions' => [
                        [
                            'question' => 'How do I track my order?',
                            'answer' => 'You can track your order by logging into your account and navigating to "Order History". Select the order you want to track, and you\'ll see real-time updates on the status of your delivery. You can also use the tracking link sent to your email and phone number.'
                        ],
                        [
                            'question' => 'Can I modify my order after placing it?',
                            'answer' => 'You can modify your order within 5 minutes of placing it by calling our customer service or using the "Modify Order" option in your order details. Once the restaurant has started preparing your food, modifications may not be possible.'
                        ],
                        [
                            'question' => 'What if my order is late?',
                            'answer' => 'If your order is taking longer than the estimated delivery time, you can check the status in the tracking page. If there\'s a significant delay, our system will automatically notify you with an updated delivery time. You can also contact our support team for assistance.'
                        ]
                    ]
                ],
                [
                    'name' => 'Payment',
                    'icon' => 'CreditCard',
                    'questions' => [
                        [
                            'question' => 'What payment methods do you accept?',
                            'answer' => 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, Apple Pay, Google Pay, and in select locations, cash on delivery. Payment options may vary depending on your location.'
                        ],
                        [
                            'question' => 'How do I request a refund?',
                            'answer' => 'To request a refund, go to your order history, select the order in question, and click "Request Refund". Explain the issue you experienced, and our team will review your request. Refunds are typically processed within 3-5 business days.'
                        ],
                        [
                            'question' => 'How do I apply a promo code?',
                            'answer' => 'You can apply a promo code during checkout. On the payment page, you\'ll see a field labeled "Promo Code" or "Discount Code". Enter your code and click "Apply" to see the discount reflected in your total.'
                        ]
                    ]
                ],
                [
                    'name' => 'Delivery',
                    'icon' => 'Truck',
                    'questions' => [
                        [
                            'question' => 'What areas do you deliver to?',
                            'answer' => 'We deliver to most major cities and their surrounding areas. To check if we deliver to your location, enter your address on our homepage or in the app. The system will let you know if delivery is available in your area.'
                        ],
                        [
                            'question' => 'How is the delivery fee calculated?',
                            'answer' => 'Delivery fees are calculated based on your distance from the restaurant, current demand, and weather conditions. The exact fee will be shown before you confirm your order. Some restaurants also offer free delivery on orders above a certain amount.'
                        ],
                        [
                            'question' => 'Can I schedule a delivery for later?',
                            'answer' => 'Yes, you can schedule orders for later. During checkout, select "Schedule for Later" instead of "Order Now", and choose your preferred date and time. We\'ll deliver your order as close to the selected time as possible.'
                        ]
                    ]
                ]
            ],
            'popular' => [
                'How do I track my order?',
                'Can I modify my order after placing it?',
                'What payment methods do you accept?',
                'How do I request a refund?'
            ]
        ];
    }

    private function getTicketSubmissionSection(): array
    {
        return [
            'title' => 'Submit a Support Ticket',
            'description' => 'Can\'t find what you\'re looking for? Submit a ticket and our support team will get back to you shortly.',
            'categories' => [
                ['id' => 'account', 'name' => 'Account Issues'],
                ['id' => 'order', 'name' => 'Order Problems'],
                ['id' => 'payment', 'name' => 'Payment & Billing'],
                ['id' => 'technical', 'name' => 'Technical Support'],
                ['id' => 'feedback', 'name' => 'Feedback & Suggestions'],
                ['id' => 'other', 'name' => 'Other']
            ],
            'priorities' => [
                ['id' => 'low', 'name' => 'Low'],
                ['id' => 'medium', 'name' => 'Medium'],
                ['id' => 'high', 'name' => 'High'],
                ['id' => 'urgent', 'name' => 'Urgent']
            ],
            'responseTime' => '24 hours',
            'supportHours' => 'Monday to Sunday, 8:00 AM - 10:00 PM'
        ];
    }

    private function getLiveChatSection(): array
    {
        return [
            'title' => 'Live Chat Support',
            'description' => 'Get real-time assistance from our support team',
            'available' => true,
            'availableHours' => '9:00 AM - 8:00 PM',
            'waitTime' => '< 2 minutes',
            'botName' => 'RestuBot',
            'introMessage' => 'Hello! How can I help you today?',
            'offlineMessage' => 'Our live chat is currently offline. Please leave a message or submit a support ticket.',
            'categories' => [
                'Order Status',
                'Account Help',
                'Technical Support',
                'Billing Questions'
            ],
            'quickReplies' => [
                'Track my order',
                'I need help with my account',
                'I have a billing question',
                'My order is wrong'
            ]
        ];
    }

    private function getContactMethodsSection(): array
    {
        return [
            'title' => 'Contact Methods',
            'description' => 'Choose the most convenient way to reach us',
            'methods' => [
                [
                    'icon' => 'Phone',
                    'title' => 'Phone Support',
                    'value' => '+1 718-904-4450',
                    'description' => 'Mon-Sun: 8:00 AM - 10:00 PM',
                    'link' => 'tel:+17189044450',
                    'action' => 'Call Now'
                ],
                [
                    'icon' => 'Mail',
                    'title' => 'Email Support',
                    'value' => 'support@poco.com',
                    'description' => 'Response within 24 hours',
                    'link' => 'mailto:support@poco.com',
                    'action' => 'Send Email'
                ],
                [
                    'icon' => 'MessageCircle',
                    'title' => 'Live Chat',
                    'value' => 'Available 24/7',
                    'description' => 'Instant Response',
                    'link' => '#live-chat',
                    'action' => 'Start Chat'
                ],
                [
                    'icon' => 'Twitter',
                    'title' => 'Twitter Support',
                    'value' => '@poco_support',
                    'description' => 'Public & DM Support',
                    'link' => 'https://twitter.com/poco_support',
                    'action' => 'Tweet Us'
                ]
            ]
        ];
    }

    private function getResourcesSection(): array
    {
        return [
            'title' => 'Support Resources',
            'description' => 'Helpful guides and documentation',
            'resources' => [
                [
                    'title' => 'Getting Started Guide',
                    'description' => 'New to our platform? Learn the basics to get started quickly.',
                    'icon' => 'BookOpen',
                    'link' => '#getting-started',
                    'tags' => ['Beginners', 'Tutorial']
                ],
                [
                    'title' => 'Video Tutorials',
                    'description' => 'Visual guides for common tasks and features.',
                    'icon' => 'Video',
                    'link' => '#video-tutorials',
                    'tags' => ['Visual', 'How-to']
                ],
                [
                    'title' => 'User Manual',
                    'description' => 'Comprehensive documentation for all features.',
                    'icon' => 'FileText',
                    'link' => '#user-manual',
                    'tags' => ['Documentation', 'Detailed']
                ],
                [
                    'title' => 'FAQ Database',
                    'description' => 'Browse our extensive database of frequently asked questions.',
                    'icon' => 'HelpCircle',
                    'link' => '#faq-database',
                    'tags' => ['Questions', 'Answers']
                ]
            ]
        ];
    }

    private function getCommunitySupportSection(): array
    {
        return [
            'title' => 'Community Support',
            'description' => 'Connect with other users and find solutions',
            'platforms' => [
                [
                    'name' => 'Community Forums',
                    'description' => 'Ask questions and share experiences with other users',
                    'icon' => 'Users',
                    'link' => '#forums',
                    'stats' => '50K+ members'
                ],
                [
                    'name' => 'Facebook Group',
                    'description' => 'Join our Facebook community for tips and discussions',
                    'icon' => 'Facebook',
                    'link' => '#facebook-group',
                    'stats' => '25K+ members'
                ],
                [
                    'name' => 'Reddit',
                    'description' => 'Participate in our subreddit for community support',
                    'icon' => 'MessageSquare',
                    'link' => '#reddit',
                    'stats' => '15K+ members'
                ],
                [
                    'name' => 'Discord Server',
                    'description' => 'Real-time chat with community members and moderators',
                    'icon' => 'MessageCircle',
                    'link' => '#discord',
                    'stats' => '10K+ members'
                ]
            ]
        ];
    }

    private function getStatusUpdatesSection(): array
    {
        return [
            'title' => 'System Status',
            'description' => 'Check the current status of our services',
            'status' => 'operational', // operational, partial_outage, major_outage, maintenance
            'lastUpdated' => date('Y-m-d H:i:s'),
            'services' => [
                [
                    'name' => 'Website',
                    'status' => 'operational',
                    'lastIncident' => '2023-05-15 14:30:00'
                ],
                [
                    'name' => 'Mobile App',
                    'status' => 'operational',
                    'lastIncident' => '2023-06-20 09:15:00'
                ],
                [
                    'name' => 'Payment Processing',
                    'status' => 'operational',
                    'lastIncident' => '2023-04-10 22:45:00'
                ],
                [
                    'name' => 'Delivery Tracking',
                    'status' => 'operational',
                    'lastIncident' => '2023-07-05 16:20:00'
                ]
            ],
            'plannedMaintenance' => [
                [
                    'date' => date('Y-m-d', strtotime('+3 days')),
                    'time' => '02:00 - 04:00 UTC',
                    'description' => 'Scheduled maintenance for system upgrades'
                ]
            ]
        ];
    }
} 