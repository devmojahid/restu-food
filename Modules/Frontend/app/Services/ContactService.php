<?php

declare(strict_types=1);

namespace Modules\Frontend\Services;  

use App\Services\BaseService;

final class ContactService extends BaseService
{
    public function getContactPageData(): array
    {
        return [
            'hero' => $this->getHeroSection(),
            'contact' => $this->getContactSection(),
            'locations' => $this->getLocationsSection(),
            'faq' => $this->getFaqSection(),
            'social' => $this->getSocialSection(),
            'support' => $this->getSupportSection()
        ];
    }

    private function getHeroSection(): array
    {
        return [
            'title' => 'Get in Touch',
            'subtitle' => 'We\'d Love to Hear From You',
            'description' => 'Have a question about our services? Need help with an order? Our team is here to help.',
            'image' => '/images/contact/hero.jpg',
            'stats' => [
                ['label' => 'Customer Satisfaction', 'value' => '98%'],
                ['label' => 'Support Response Time', 'value' => '< 1hr'],
                ['label' => 'Active Users', 'value' => '100K+'],
                ['label' => 'Cities Served', 'value' => '50+']
            ]
        ];
    }

    private function getContactSection(): array
    {
        return [
            'title' => 'Contact Information',
            'description' => 'Choose the most convenient way to reach us',
            'methods' => [
                [
                    'icon' => 'Phone',
                    'title' => 'Phone Support',
                    'value' => '+1 718-904-4450',
                    'description' => 'Mon-Fri: 8:00 AM - 10:00 PM',
                    'link' => 'tel:+17189044450',
                    'action' => 'Call Now'
                ],
                [
                    'icon' => 'Mail',
                    'title' => 'Email Support',
                    'value' => 'support@poco.com',
                    'description' => '24/7 Response Time',
                    'link' => 'mailto:support@poco.com',
                    'action' => 'Send Email'
                ],
                [
                    'icon' => 'MessageCircle',
                    'title' => 'Live Chat',
                    'value' => 'Available 24/7',
                    'description' => 'Instant Response',
                    'link' => '#',
                    'action' => 'Start Chat'
                ]
            ]
        ];
    }

    private function getLocationsSection(): array
    {
        return [
            'title' => 'Our Locations',
            'description' => 'Find us in your city',
            'locations' => [
                [
                    'city' => 'New York',
                    'address' => '71 Madison Ave, New York, NY 10013',
                    'phone' => '+1 (212) 555-0123',
                    'email' => 'ny@poco.com',
                    'hours' => 'Mon-Sun: 8:00 AM - 10:00 PM',
                    'coordinates' => [40.7128, -74.0060],
                    'image' => '/images/locations/new-york.jpg'
                ],
                [
                    'city' => 'Los Angeles',
                    'address' => '123 Hollywood Blvd, Los Angeles, CA 90028',
                    'phone' => '+1 (323) 555-0123',
                    'email' => 'la@poco.com',
                    'hours' => 'Mon-Sun: 8:00 AM - 10:00 PM',
                    'coordinates' => [34.0522, -118.2437],
                    'image' => '/images/locations/los-angeles.jpg'
                ],
                [
                    'city' => 'Chicago',
                    'address' => '456 Michigan Ave, Chicago, IL 60601',
                    'phone' => '+1 (312) 555-0123',
                    'email' => 'chicago@poco.com',
                    'hours' => 'Mon-Sun: 8:00 AM - 10:00 PM',
                    'coordinates' => [41.8781, -87.6298],
                    'image' => '/images/locations/chicago.jpg'
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
                    'name' => 'General',
                    'questions' => [
                        [
                            'question' => 'How do I place an order?',
                            'answer' => 'You can place an order through our website or mobile app. Simply browse restaurants in your area, select your items, and proceed to checkout.'
                        ],
                        [
                            'question' => 'What payment methods do you accept?',
                            'answer' => 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay.'
                        ]
                    ]
                ],
                [
                    'name' => 'Delivery',
                    'questions' => [
                        [
                            'question' => 'How long does delivery take?',
                            'answer' => 'Delivery times vary depending on your location and the restaurant. Average delivery time is 30-45 minutes.'
                        ],
                        [
                            'question' => 'Do you deliver to my area?',
                            'answer' => 'We deliver to most major cities. Enter your address on our website to check if we deliver to your location.'
                        ]
                    ]
                ]
            ]
        ];
    }

    private function getSocialSection(): array
    {
        return [
            'title' => 'Connect With Us',
            'description' => 'Follow us on social media for updates and special offers',
            'platforms' => [
                [
                    'name' => 'Facebook',
                    'icon' => 'Facebook',
                    'url' => 'https://facebook.com/poco',
                    'followers' => '500K+'
                ],
                [
                    'name' => 'Twitter',
                    'icon' => 'Twitter',
                    'url' => 'https://twitter.com/poco',
                    'followers' => '200K+'
                ],
                [
                    'name' => 'Instagram',
                    'icon' => 'Instagram',
                    'url' => 'https://instagram.com/poco',
                    'followers' => '1M+'
                ],
                [
                    'name' => 'LinkedIn',
                    'icon' => 'Linkedin',
                    'url' => 'https://linkedin.com/company/poco',
                    'followers' => '100K+'
                ]
            ]
        ];
    }

    private function getSupportSection(): array
    {
        return [
            'title' => 'Need Help?',
            'description' => 'Our support team is here to assist you',
            'categories' => [
                [
                    'icon' => 'HelpCircle',
                    'title' => 'Help Center',
                    'description' => 'Find answers to common questions',
                    'link' => '/help'
                ],
                [
                    'icon' => 'FileText',
                    'title' => 'Documentation',
                    'description' => 'API and integration guides',
                    'link' => '/docs'
                ],
                [
                    'icon' => 'Users',
                    'title' => 'Community',
                    'description' => 'Join our community forum',
                    'link' => '/community'
                ]
            ]
        ];
    }
} 