<?php

declare(strict_types=1);

namespace Modules\Frontend\Services;    

use App\Services\BaseService;

final class AboutService extends BaseService
{
    public function getAboutPageData(): array
    {
        return [
            'hero' => $this->getHeroSection(),
            'mission' => $this->getMissionSection(),
            'story' => $this->getStorySection(),
            'team' => $this->getTeamSection(),
            'values' => $this->getValuesSection(),
            'stats' => $this->getStatsSection(),
            'awards' => $this->getAwardsSection(),
            'locations' => $this->getLocationsSection(),
            'partners' => $this->getPartnersSection(),
            'testimonials' => $this->getTestimonialsSection(),
            'careers' => $this->getCareersSection()
        ];
    }

    private function getHeroSection(): array
    {
        return [
            'title' => 'Delivering Happiness, One Meal at a Time',
            'subtitle' => 'Our journey to revolutionize food delivery',
            'description' => 'We are more than just a food delivery service. We are a community of food lovers, tech innovators, and customer service enthusiasts working together to transform how people experience food delivery.',
            'image' => '/images/about/hero.jpg',
            'stats' => [
                ['label' => 'Happy Customers', 'value' => '1M+'],
                ['label' => 'Restaurant Partners', 'value' => '5000+'],
                ['label' => 'Cities Served', 'value' => '50+'],
                ['label' => 'Delivery Partners', 'value' => '10K+']
            ]
        ];
    }

    private function getMissionSection(): array
    {
        return [
            'title' => 'Our Mission & Vision',
            'mission' => [
                'title' => 'Mission',
                'description' => 'To make quality food accessible to everyone while empowering local restaurants and creating sustainable employment opportunities.',
                'image' => '/images/about/mission.jpg'
            ],
            'vision' => [
                'title' => 'Vision',
                'description' => 'To be the worlds most loved and trusted food delivery platform, connecting people with the best of their local food scene.',
                'image' => '/images/about/vision.jpg'
            ]
        ];
    }

    private function getStorySection(): array
    {
        return [
            'title' => 'Our Story',
            'subtitle' => 'From a Simple Idea to a Food Revolution',
            'timeline' => [
                [
                    'year' => '2018',
                    'title' => 'The Beginning',
                    'description' => 'Started with a simple idea to connect hungry customers with local restaurants.',
                    'image' => '/images/about/story-1.jpg'
                ],
                [
                    'year' => '2020',
                    'title' => 'Rapid Growth',
                    'description' => 'Expanded to 20+ cities and partnered with over 1000 restaurants.',
                    'image' => '/images/about/story-2.jpg'
                ],
                [
                    'year' => '2022',
                    'title' => 'Innovation',
                    'description' => 'Launched real-time tracking and AI-powered delivery optimization.',
                    'image' => '/images/about/story-3.jpg'
                ],
                [
                    'year' => '2024',
                    'title' => 'Today',
                    'description' => 'Serving millions of customers across 50+ cities with 5000+ restaurant partners.',
                    'image' => '/images/about/story-4.jpg'
                ]
            ]
        ];
    }

    private function getTeamSection(): array
    {
        return [
            'title' => 'Meet Our Team',
            'subtitle' => 'The People Behind Our Success',
            'description' => 'Our diverse team of passionate individuals works tirelessly to bring you the best food delivery experience.',
            'members' => [
                [
                    'name' => 'John Smith',
                    'role' => 'CEO & Founder',
                    'image' => '/images/team/john-smith.jpg',
                    'bio' => 'Former tech executive with a passion for food and innovation.',
                    'social' => [
                        'linkedin' => 'https://linkedin.com/in/johnsmith',
                        'twitter' => 'https://twitter.com/johnsmith'
                    ]
                ],
                // Add more team members...
            ]
        ];
    }

    private function getValuesSection(): array
    {
        return [
            'title' => 'Our Core Values',
            'subtitle' => 'What Drives Us Every Day',
            'values' => [
                [
                    'icon' => 'Quality',
                    'title' => 'Excellence in Service',
                    'description' => 'We strive for perfection in every delivery.'
                ],
                [
                    'icon' => 'Innovation',
                    'title' => 'Continuous Innovation',
                    'description' => 'Always pushing boundaries to improve our service.'
                ],
                [
                    'icon' => 'Community',
                    'title' => 'Community First',
                    'description' => 'Supporting local businesses and communities.'
                ],
                [
                    'icon' => 'Sustainability',
                    'title' => 'Sustainable Practices',
                    'description' => 'Committed to environmental responsibility.'
                ]
            ]
        ];
    }

    private function getStatsSection(): array
    {
        return [
            'title' => 'Our Impact in Numbers',
            'stats' => [
                [
                    'value' => '1M+',
                    'label' => 'Happy Customers',
                    'description' => 'Satisfied customers who love our service'
                ],
                [
                    'value' => '5000+',
                    'label' => 'Restaurant Partners',
                    'description' => 'Local restaurants growing with us'
                ],
                [
                    'value' => '50+',
                    'label' => 'Cities',
                    'description' => 'Cities where we deliver happiness'
                ],
                [
                    'value' => '10K+',
                    'label' => 'Delivery Partners',
                    'description' => 'Dedicated delivery professionals'
                ]
            ]
        ];
    }

    private function getAwardsSection(): array
    {
        return [
            'title' => 'Awards & Recognition',
            'subtitle' => 'Celebrating Our Achievements',
            'awards' => [
                [
                    'year' => '2023',
                    'title' => 'Best Food Delivery App',
                    'organization' => 'Tech Innovation Awards',
                    'image' => '/images/awards/tech-innovation.png'
                ],
                // Add more awards...
            ]
        ];
    }

    private function getLocationsSection(): array
    {
        return [
            'title' => 'Where We Operate',
            'subtitle' => 'Find Us in Your City',
            'description' => 'Were rapidly expanding to bring delicious food to more cities across the country.',
            'locations' => [
                [
                    'city' => 'New York',
                    'address' => '123 Broadway St, NY 10013',
                    'phone' => '+1 (212) 555-0123',
                    'email' => 'ny@example.com',
                    'coordinates' => [40.7128, -74.0060],
                    'image' => '/images/locations/new-york.jpg',
                    'type' => 'Headquarters'
                ],
                // Add more locations...
            ]
        ];
    }

    private function getPartnersSection(): array
    {
        return [
            'title' => 'Our Partners',
            'subtitle' => 'Growing Together',
            'description' => 'We work with the best restaurants and brands to deliver quality food and experiences.',
            'partners' => [
                [
                    'name' => 'Restaurant Chain A',
                    'logo' => '/images/partners/partner1.png',
                    'description' => 'Premium dining partner since 2020'
                ],
                // Add more partners...
            ]
        ];
    }

    private function getTestimonialsSection(): array
    {
        return [
            'title' => 'What People Say',
            'subtitle' => 'Customer Stories',
            'testimonials' => [
                [
                    'name' => 'Sarah Johnson',
                    'role' => 'Regular Customer',
                    'image' => '/images/testimonials/sarah.jpg',
                    'text' => 'The best food delivery service Ive ever used. Always on time and great customer service!',
                    'rating' => 5
                ],
                // Add more testimonials...
            ]
        ];
    }

    private function getCareersSection(): array
    {
        return [
            'title' => 'Join Our Team',
            'subtitle' => 'Career Opportunities',
            'description' => 'Were always looking for talented individuals to join our growing team.',
            'benefits' => [
                'Competitive salary',
                'Health insurance',
                'Flexible working hours',
                'Professional development'
            ],
            'openings' => [
                [
                    'title' => 'Senior Software Engineer',
                    'department' => 'Engineering',
                    'location' => 'New York',
                    'type' => 'Full-time'
                ],
                // Add more job openings...
            ]
        ];
    }
} 