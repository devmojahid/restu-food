<?php

declare(strict_types=1);

namespace App\Services\Frontend;

final class PartnerService extends BaseService
{
    public function getRestaurantPartnerData(): array
    {
        return [
            'hero' => $this->getHeroSection('restaurant'),
            'benefits' => $this->getRestaurantBenefits(),
            'howItWorks' => $this->getHowItWorks('restaurant'),
            'requirements' => $this->getRestaurantRequirements(),
            'testimonials' => $this->getPartnerTestimonials('restaurant'),
            'stats' => $this->getPartnerStats('restaurant'),
            'faq' => $this->getPartnerFaq('restaurant'),
            'cta' => $this->getCtaSection('restaurant')
        ];
    }

    public function getKitchenStaffData(): array
    {
        return [
            'hero' => $this->getHeroSection('kitchen'),
            'benefits' => $this->getKitchenStaffBenefits(),
            'howItWorks' => $this->getHowItWorks('kitchen'),
            'positions' => $this->getKitchenPositions(),
            'testimonials' => $this->getPartnerTestimonials('kitchen'),
            'stats' => $this->getPartnerStats('kitchen'),
            'faq' => $this->getPartnerFaq('kitchen'),
            'cta' => $this->getCtaSection('kitchen')
        ];
    }

    public function getDeliveryStaffData(): array
    {
        return [
            'hero' => $this->getHeroSection('delivery'),
            'benefits' => $this->getDeliveryStaffBenefits(),
            'howItWorks' => $this->getHowItWorks('delivery'),
            'requirements' => $this->getDeliveryRequirements(),
            'testimonials' => $this->getPartnerTestimonials('delivery'),
            'stats' => $this->getPartnerStats('delivery'),
            'faq' => $this->getPartnerFaq('delivery'),
            'cta' => $this->getCtaSection('delivery')
        ];
    }

    public function getVendorData(): array
    {
        return [
            'hero' => $this->getHeroSection('vendor'),
            'benefits' => $this->getVendorBenefits(),
            'howItWorks' => $this->getHowItWorks('vendor'),
            'categories' => $this->getVendorCategories(),
            'testimonials' => $this->getPartnerTestimonials('vendor'),
            'stats' => $this->getPartnerStats('vendor'),
            'faq' => $this->getPartnerFaq('vendor'),
            'cta' => $this->getCtaSection('vendor')
        ];
    }

    private function getHeroSection(string $type): array
    {
        $data = [
            'restaurant' => [
                'title' => 'Grow Your Restaurant Business With Us',
                'subtitle' => 'Restaurant Partnership',
                'description' => 'Join our platform to reach more customers, increase your revenue, and grow your restaurant business with our cutting-edge technology and marketing support.',
                'image' => '/images/partners/restaurant-hero.jpg',
                'cta' => [
                    'text' => 'Apply Now',
                    'link' => '/become-restaurant#apply'
                ],
                'stats' => [
                    ['value' => '10K+', 'label' => 'Restaurant Partners'],
                    ['value' => '35%', 'label' => 'Average Growth'],
                    ['value' => '2M+', 'label' => 'Monthly Orders'],
                    ['value' => '24/7', 'label' => 'Support']
                ]
            ],
            'kitchen' => [
                'title' => 'Join Our Culinary Team',
                'subtitle' => 'Kitchen Staff Opportunities',
                'description' => 'Discover exciting career opportunities in our partner restaurants. We offer competitive pay, flexible schedules, and growth opportunities for passionate culinary professionals.',
                'image' => '/images/partners/kitchen-hero.jpg',
                'cta' => [
                    'text' => 'Apply Now',
                    'link' => '/kitchen-staff#apply'
                ],
                'stats' => [
                    ['value' => '5K+', 'label' => 'Kitchen Staff'],
                    ['value' => '250+', 'label' => 'Partner Kitchens'],
                    ['value' => '$18/hr', 'label' => 'Avg. Hourly Rate'],
                    ['value' => '92%', 'label' => 'Staff Satisfaction']
                ]
            ],
            'delivery' => [
                'title' => 'Deliver With Us & Earn',
                'subtitle' => 'Delivery Partner Opportunities',
                'description' => 'Become a delivery partner and enjoy flexible hours, competitive pay, and the freedom to be your own boss while delivering delicious food to hungry customers.',
                'image' => '/images/partners/delivery-hero.jpg',
                'cta' => [
                    'text' => 'Apply Now',
                    'link' => '/delivery-staff#apply'
                ],
                'stats' => [
                    ['value' => '8K+', 'label' => 'Delivery Partners'],
                    ['value' => '$25/hr', 'label' => 'Avg. Earnings'],
                    ['value' => '500K+', 'label' => 'Weekly Deliveries'],
                    ['value' => 'Flexible', 'label' => 'Work Hours']
                ]
            ],
            'vendor' => [
                'title' => 'Supply Our Network & Grow',
                'subtitle' => 'Vendor Partnership',
                'description' => 'Become a vendor partner and supply our extensive restaurant network with quality ingredients, equipment, and services while growing your business.',
                'image' => '/images/partners/vendor-hero.jpg',
                'cta' => [
                    'text' => 'Apply Now',
                    'link' => '/become-vendor#apply'
                ],
                'stats' => [
                    ['value' => '2K+', 'label' => 'Vendor Partners'],
                    ['value' => '40%', 'label' => 'Revenue Growth'],
                    ['value' => '10K+', 'label' => 'Products Supplied'],
                    ['value' => 'Global', 'label' => 'Network']
                ]
            ]
        ];

        return $data[$type] ?? $data['restaurant'];
    }

    private function getRestaurantBenefits(): array
    {
        return [
            'title' => 'Benefits of Partnering With Us',
            'subtitle' => 'Why Restaurants Choose Us',
            'description' => 'Our platform offers restaurants everything they need to succeed in the digital food delivery world.',
            'benefits' => [
                [
                    'title' => 'Expanded Customer Reach',
                    'description' => 'Access our large customer base and significantly expand your restaurant\'s reach without additional marketing costs.',
                    'icon' => 'Users'
                ],
                [
                    'title' => 'Seamless Technology',
                    'description' => 'Our easy-to-use platform integrates with your existing systems for smooth order management and processing.',
                    'icon' => 'Laptop'
                ],
                [
                    'title' => 'Increased Revenue',
                    'description' => 'Boost your sales with incremental orders, higher average order values, and repeat customers.',
                    'icon' => 'TrendingUp'
                ],
                [
                    'title' => 'Marketing Support',
                    'description' => 'Benefit from our targeted marketing campaigns that drive traffic to your restaurant listing.',
                    'icon' => 'Megaphone'
                ],
                [
                    'title' => 'Data Insights',
                    'description' => 'Access detailed analytics about customer preferences, popular dishes, and peak ordering times.',
                    'icon' => 'BarChart'
                ],
                [
                    'title' => 'Dedicated Support',
                    'description' => '24/7 partner support to help you resolve issues and optimize your performance on our platform.',
                    'icon' => 'HeadphonesIcon'
                ]
            ]
        ];
    }

    private function getKitchenStaffBenefits(): array
    {
        return [
            'title' => 'Benefits of Working With Us',
            'subtitle' => 'Why Culinary Professionals Choose Us',
            'description' => 'Join our network of restaurant partners and enjoy these exclusive benefits.',
            'benefits' => [
                [
                    'title' => 'Competitive Pay',
                    'description' => 'Earn competitive wages with opportunities for bonuses and performance-based incentives.',
                    'icon' => 'DollarSign'
                ],
                [
                    'title' => 'Flexible Schedules',
                    'description' => 'Work hours that fit your lifestyle with full-time, part-time, and shift-based options.',
                    'icon' => 'Clock'
                ],
                [
                    'title' => 'Career Growth',
                    'description' => 'Access training programs and advancement opportunities across our restaurant network.',
                    'icon' => 'GraduationCap'
                ],
                [
                    'title' => 'Skills Development',
                    'description' => 'Learn from experienced chefs and expand your culinary expertise in diverse kitchen environments.',
                    'icon' => 'Award'
                ],
                [
                    'title' => 'Team Environment',
                    'description' => 'Join a supportive team of culinary professionals passionate about food and service.',
                    'icon' => 'Users'
                ],
                [
                    'title' => 'Employee Benefits',
                    'description' => 'Eligible positions receive health insurance, meal allowances, and other valuable benefits.',
                    'icon' => 'Heart'
                ]
            ]
        ];
    }

    private function getDeliveryStaffBenefits(): array
    {
        return [
            'title' => 'Benefits of Delivering With Us',
            'subtitle' => 'Why Delivery Partners Choose Us',
            'description' => 'Join our team of delivery partners and enjoy flexibility, competitive earnings, and more.',
            'benefits' => [
                [
                    'title' => 'Flexible Hours',
                    'description' => 'Set your own schedule and work when it suits you best - full-time, part-time, or weekends only.',
                    'icon' => 'Clock'
                ],
                [
                    'title' => 'Competitive Earnings',
                    'description' => 'Earn competitive base rates plus tips, bonuses, and incentives during peak hours.',
                    'icon' => 'DollarSign'
                ],
                [
                    'title' => 'Quick Payments',
                    'description' => 'Get paid weekly with options for instant cashouts when you need funds sooner.',
                    'icon' => 'CreditCard'
                ],
                [
                    'title' => 'App Technology',
                    'description' => 'Our user-friendly app helps optimize routes, manage deliveries, and track earnings efficiently.',
                    'icon' => 'Smartphone'
                ],
                [
                    'title' => 'Growth Opportunities',
                    'description' => 'Top performers can access additional earning opportunities and leadership roles.',
                    'icon' => 'TrendingUp'
                ],
                [
                    'title' => 'Dedicated Support',
                    'description' => 'Access 24/7 support for any issues or questions that arise during your deliveries.',
                    'icon' => 'HeadphonesIcon'
                ]
            ]
        ];
    }

    private function getVendorBenefits(): array
    {
        return [
            'title' => 'Benefits of Being a Vendor Partner',
            'subtitle' => 'Why Suppliers Choose Us',
            'description' => 'Join our supplier network and connect with thousands of restaurants while growing your business.',
            'benefits' => [
                [
                    'title' => 'Expanded Market',
                    'description' => 'Access our extensive network of 10,000+ restaurant partners across multiple locations.',
                    'icon' => 'Globe'
                ],
                [
                    'title' => 'Streamlined Ordering',
                    'description' => 'Our platform simplifies the ordering process, reducing administrative overhead and errors.',
                    'icon' => 'CheckSquare'
                ],
                [
                    'title' => 'Consistent Demand',
                    'description' => 'Benefit from regular, predictable orders from our restaurant partners throughout the year.',
                    'icon' => 'LineChart'
                ],
                [
                    'title' => 'Marketing Exposure',
                    'description' => 'Get featured as a preferred supplier and increase your brand visibility in the industry.',
                    'icon' => 'Star'
                ],
                [
                    'title' => 'Payment Security',
                    'description' => 'Enjoy secure, timely payments and improved cash flow for your business.',
                    'icon' => 'Shield'
                ],
                [
                    'title' => 'Business Insights',
                    'description' => 'Access data analytics to understand demand patterns and optimize your inventory.',
                    'icon' => 'PieChart'
                ]
            ]
        ];
    }

    private function getHowItWorks(string $type): array
    {
        $data = [
            'restaurant' => [
                'title' => 'How to Become a Restaurant Partner',
                'subtitle' => 'Simple 4-Step Process',
                'description' => 'Getting your restaurant on our platform is quick and easy. Follow these simple steps to start receiving orders.',
                'steps' => [
                    [
                        'title' => 'Apply Online',
                        'description' => 'Fill out our simple online application form with details about your restaurant.',
                        'icon' => 'ClipboardList'
                    ],
                    [
                        'title' => 'Verification',
                        'description' => 'Our team will verify your information and assess your restaurant\'s suitability.',
                        'icon' => 'CheckCircle'
                    ],
                    [
                        'title' => 'Onboarding',
                        'description' => 'Once approved, we\'ll help you set up your menu, pricing, and operational details.',
                        'icon' => 'Settings'
                    ],
                    [
                        'title' => 'Go Live',
                        'description' => 'Your restaurant goes live on our platform, and you start receiving orders immediately.',
                        'icon' => 'Zap'
                    ]
                ]
            ],
            'kitchen' => [
                'title' => 'How to Join Our Culinary Team',
                'subtitle' => 'Simple 4-Step Process',
                'description' => 'Becoming part of our kitchen staff network is straightforward. Follow these steps to start your culinary journey with us.',
                'steps' => [
                    [
                        'title' => 'Apply Online',
                        'description' => 'Submit your application with your experience, skills, and preferred positions.',
                        'icon' => 'ClipboardList'
                    ],
                    [
                        'title' => 'Interview',
                        'description' => 'Selected candidates will be invited for an interview and possibly a cooking demonstration.',
                        'icon' => 'Users'
                    ],
                    [
                        'title' => 'Placement',
                        'description' => 'Upon selection, we\'ll match you with restaurant partners based on your skills and preferences.',
                        'icon' => 'MapPin'
                    ],
                    [
                        'title' => 'Start Working',
                        'description' => 'Begin your role with initial training and ongoing support from our team.',
                        'icon' => 'CheckCircle'
                    ]
                ]
            ],
            'delivery' => [
                'title' => 'How to Become a Delivery Partner',
                'subtitle' => 'Simple 4-Step Process',
                'description' => 'Getting started as a delivery partner is quick and easy. Follow these steps to begin earning.',
                'steps' => [
                    [
                        'title' => 'Sign Up',
                        'description' => 'Complete our online application with your personal details and delivery preferences.',
                        'icon' => 'UserPlus'
                    ],
                    [
                        'title' => 'Documentation',
                        'description' => 'Submit required documents including ID, vehicle information, and background check consent.',
                        'icon' => 'FileText'
                    ],
                    [
                        'title' => 'Activation',
                        'description' => 'Once approved, download our app and complete the quick onboarding tutorial.',
                        'icon' => 'Smartphone'
                    ],
                    [
                        'title' => 'Start Delivering',
                        'description' => 'Go online in the app whenever you\'re ready to accept delivery requests and earn.',
                        'icon' => 'Navigation'
                    ]
                ]
            ],
            'vendor' => [
                'title' => 'How to Become a Vendor Partner',
                'subtitle' => 'Simple 4-Step Process',
                'description' => 'Joining our supplier network is straightforward. Follow these steps to connect with our restaurant partners.',
                'steps' => [
                    [
                        'title' => 'Apply',
                        'description' => 'Submit your company information, product catalog, and pricing structure.',
                        'icon' => 'ClipboardList'
                    ],
                    [
                        'title' => 'Verification',
                        'description' => 'Our team will review your application, products, and conduct necessary quality checks.',
                        'icon' => 'Search'
                    ],
                    [
                        'title' => 'Onboarding',
                        'description' => 'Once approved, we\'ll set up your vendor profile and integrate your catalog into our system.',
                        'icon' => 'Database'
                    ],
                    [
                        'title' => 'Start Supplying',
                        'description' => 'Begin receiving purchase orders from our restaurant partners through our platform.',
                        'icon' => 'TruckIcon'
                    ]
                ]
            ]
        ];

        return $data[$type] ?? $data['restaurant'];
    }

    private function getRestaurantRequirements(): array
    {
        return [
            'title' => 'Restaurant Requirements',
            'subtitle' => 'What You Need to Join',
            'description' => 'To ensure quality service for our customers, we have some basic requirements for restaurant partners.',
            'requirements' => [
                [
                    'title' => 'Valid Business License',
                    'description' => 'An active business license or permit to operate a food establishment.'
                ],
                [
                    'title' => 'Food Safety Certification',
                    'description' => 'Up-to-date food safety certification for your establishment.'
                ],
                [
                    'title' => 'Commercial Kitchen',
                    'description' => 'A dedicated commercial kitchen space that meets local health regulations.'
                ],
                [
                    'title' => 'Internet Connection',
                    'description' => 'Reliable internet access to receive and process orders.'
                ],
                [
                    'title' => 'Quality Standards',
                    'description' => 'Commitment to maintaining high food quality and packaging standards.'
                ],
                [
                    'title' => 'Delivery Capability',
                    'description' => 'Ability to prepare orders for pickup by our delivery partners or your own delivery staff.'
                ]
            ]
        ];
    }

    private function getDeliveryRequirements(): array
    {
        return [
            'title' => 'Delivery Partner Requirements',
            'subtitle' => 'What You Need to Join',
            'description' => 'To become a delivery partner, you\'ll need to meet these basic requirements.',
            'requirements' => [
                [
                    'title' => 'Age Requirement',
                    'description' => 'You must be at least 18 years old to deliver with us.'
                ],
                [
                    'title' => 'Valid ID',
                    'description' => 'Government-issued photo identification.'
                ],
                [
                    'title' => 'Transportation',
                    'description' => 'A reliable vehicle (car, bike, scooter) or ability to make deliveries on foot in dense urban areas.'
                ],
                [
                    'title' => 'Smartphone',
                    'description' => 'A smartphone compatible with our delivery app (iOS 13+ or Android 7+).'
                ],
                [
                    'title' => 'Background Check',
                    'description' => 'Willingness to undergo a background check for safety and security.'
                ],
                [
                    'title' => 'Bank Account',
                    'description' => 'Active bank account for receiving payments.'
                ]
            ]
        ];
    }

    private function getKitchenPositions(): array
    {
        return [
            'title' => 'Available Kitchen Positions',
            'subtitle' => 'Join Our Culinary Team',
            'description' => 'We offer a variety of kitchen positions across our restaurant network. Find the role that matches your skills and career goals.',
            'positions' => [
                [
                    'title' => 'Head Chef',
                    'description' => 'Lead the kitchen team, develop menus, and maintain quality standards.',
                    'requirements' => '5+ years experience, culinary degree preferred',
                    'salary' => '$60,000 - $80,000/year',
                    'icon' => 'ChefHat'
                ],
                [
                    'title' => 'Sous Chef',
                    'description' => 'Assist the head chef in daily operations and supervise kitchen staff.',
                    'requirements' => '3+ years experience, strong leadership skills',
                    'salary' => '$45,000 - $60,000/year',
                    'icon' => 'Utensils'
                ],
                [
                    'title' => 'Line Cook',
                    'description' => 'Prepare food according to recipes and ensure timely service.',
                    'requirements' => '1+ years experience, basic culinary skills',
                    'salary' => '$30,000 - $40,000/year',
                    'icon' => 'Flame'
                ],
                [
                    'title' => 'Prep Cook',
                    'description' => 'Prepare ingredients and assist with basic cooking tasks.',
                    'requirements' => 'Entry-level position, food handling knowledge',
                    'salary' => '$25,000 - $32,000/year',
                    'icon' => 'Scissors'
                ],
                [
                    'title' => 'Pastry Chef',
                    'description' => 'Create desserts, pastries, and baked goods for the menu.',
                    'requirements' => '2+ years experience, pastry specialization',
                    'salary' => '$35,000 - $50,000/year',
                    'icon' => 'Cookie'
                ],
                [
                    'title' => 'Kitchen Manager',
                    'description' => 'Oversee kitchen operations, inventory, and staff scheduling.',
                    'requirements' => '4+ years experience, management skills',
                    'salary' => '$50,000 - $65,000/year',
                    'icon' => 'ClipboardList'
                ]
            ]
        ];
    }

    private function getVendorCategories(): array
    {
        return [
            'title' => 'Vendor Categories',
            'subtitle' => 'Supply Opportunities',
            'description' => 'We partner with vendors across multiple categories to support our restaurant network.',
            'categories' => [
                [
                    'title' => 'Food Ingredients',
                    'description' => 'Fresh produce, meats, seafood, dairy, and specialty ingredients.',
                    'icon' => 'ShoppingCart'
                ],
                [
                    'title' => 'Packaging Solutions',
                    'description' => 'Eco-friendly containers, bags, utensils, and branded packaging.',
                    'icon' => 'Package'
                ],
                [
                    'title' => 'Kitchen Equipment',
                    'description' => 'Cooking appliances, refrigeration, food prep tools, and smallwares.',
                    'icon' => 'Tool'
                ],
                [
                    'title' => 'Cleaning Supplies',
                    'description' => 'Restaurant-grade cleaning products, sanitizers, and maintenance supplies.',
                    'icon' => 'Droplet'
                ],
                [
                    'title' => 'Technology Services',
                    'description' => 'POS systems, kitchen display solutions, and restaurant management software.',
                    'icon' => 'Monitor'
                ],
                [
                    'title' => 'Beverage Suppliers',
                    'description' => 'Soft drinks, alcoholic beverages, coffee, tea, and specialty drinks.',
                    'icon' => 'Coffee'
                ]
            ]
        ];
    }

    private function getPartnerTestimonials(string $type): array
    {
        $data = [
            'restaurant' => [
                'title' => 'What Our Restaurant Partners Say',
                'subtitle' => 'Success Stories',
                'description' => 'Hear from restaurant owners who have grown their business with our platform.',
                'testimonials' => [
                    [
                        'name' => 'Michael Chen',
                        'role' => 'Owner, Golden Dragon',
                        'image' => '/images/partners/testimonials/restaurant1.jpg',
                        'text' => 'Since joining the platform, our order volume has increased by 40%. The technology is seamless, and the support team has been incredibly helpful throughout our journey.',
                        'rating' => 5,
                        'date' => '2023-04-15'
                    ],
                    [
                        'name' => 'Sophia Rossi',
                        'role' => 'Manager, Bella Italia',
                        'image' => '/images/partners/testimonials/restaurant2.jpg',
                        'text' => 'The platform has helped us reach customers we never could before. The analytics tools have been invaluable for optimizing our menu and pricing strategy.',
                        'rating' => 5,
                        'date' => '2023-05-22'
                    ],
                    [
                        'name' => 'David Kim',
                        'role' => 'Chef-Owner, Seoul Kitchen',
                        'image' => '/images/partners/testimonials/restaurant3.jpg',
                        'text' => 'As a new restaurant, joining this platform gave us instant visibility. The onboarding process was smooth, and we started getting orders within hours of going live.',
                        'rating' => 4,
                        'date' => '2023-06-10'
                    ]
                ]
            ],
            'kitchen' => [
                'title' => 'What Our Kitchen Staff Say',
                'subtitle' => 'Team Testimonials',
                'description' => 'Hear from culinary professionals who have advanced their careers with us.',
                'testimonials' => [
                    [
                        'name' => 'James Rodriguez',
                        'role' => 'Head Chef, previously Line Cook',
                        'image' => '/images/partners/testimonials/kitchen1.jpg',
                        'text' => 'I started as a line cook three years ago and have worked my way up to head chef. The training opportunities and exposure to different cuisines have been incredible for my career development.',
                        'rating' => 5,
                        'date' => '2023-03-18'
                    ],
                    [
                        'name' => 'Aisha Johnson',
                        'role' => 'Pastry Chef',
                        'image' => '/images/partners/testimonials/kitchen2.jpg',
                        'text' => 'The flexible scheduling has allowed me to pursue my culinary degree while gaining practical experience. I\'ve learned techniques from some amazing chefs in the network.',
                        'rating' => 5,
                        'date' => '2023-05-04'
                    ],
                    [
                        'name' => 'Carlos Mendez',
                        'role' => 'Sous Chef',
                        'image' => '/images/partners/testimonials/kitchen3.jpg',
                        'text' => 'Working across multiple restaurant kitchens has expanded my skill set tremendously. The pay is competitive, and there\'s always an opportunity to pick up extra shifts when I want to.',
                        'rating' => 4,
                        'date' => '2023-06-30'
                    ]
                ]
            ],
            'delivery' => [
                'title' => 'What Our Delivery Partners Say',
                'subtitle' => 'Delivery Partner Stories',
                'description' => 'Hear from people who deliver with us and enjoy the flexibility and earnings.',
                'testimonials' => [
                    [
                        'name' => 'Marcus Johnson',
                        'role' => 'Delivery Partner, 2 years',
                        'image' => '/images/partners/testimonials/delivery1.jpg',
                        'text' => 'The flexibility is what I love most. I can work around my college schedule and still earn enough to cover my expenses. The app makes it easy to track earnings and optimize my routes.',
                        'rating' => 5,
                        'date' => '2023-02-15'
                    ],
                    [
                        'name' => 'Sarah Chen',
                        'role' => 'Delivery Partner, 1 year',
                        'image' => '/images/partners/testimonials/delivery2.jpg',
                        'text' => 'I started delivering on weekends for extra income, but the earnings were so good that I now do it full-time. The instant cashout feature has been a lifesaver when unexpected expenses come up.',
                        'rating' => 4,
                        'date' => '2023-04-08'
                    ],
                    [
                        'name' => 'Alex Patel',
                        'role' => 'Delivery Partner, 3 years',
                        'image' => '/images/partners/testimonials/delivery3.jpg',
                        'text' => 'After trying several delivery platforms, this one offers the best combination of base pay, customer tips, and bonuses. The support team is responsive when issues arise during deliveries.',
                        'rating' => 5,
                        'date' => '2023-07-14'
                    ]
                ]
            ],
            'vendor' => [
                'title' => 'What Our Vendor Partners Say',
                'subtitle' => 'Supplier Success Stories',
                'description' => 'Hear from suppliers who have grown their business by partnering with our restaurant network.',
                'testimonials' => [
                    [
                        'name' => 'Robert Fisher',
                        'role' => 'CEO, Fresh Fields Produce',
                        'image' => '/images/partners/testimonials/vendor1.jpg',
                        'text' => 'Partnering with this platform has given us steady, predictable demand for our fresh produce. The digital ordering system has reduced errors and streamlined our delivery schedule.',
                        'rating' => 5,
                        'date' => '2023-01-20'
                    ],
                    [
                        'name' => 'Lisa Wong',
                        'role' => 'Owner, Eco-Pack Solutions',
                        'image' => '/images/partners/testimonials/vendor2.jpg',
                        'text' => 'As a sustainable packaging supplier, this partnership has helped us reach restaurants committed to eco-friendly practices. Our business has grown 60% since becoming a preferred vendor.',
                        'rating' => 5,
                        'date' => '2023-03-15'
                    ],
                    [
                        'name' => 'Daniel Martinez',
                        'role' => 'Sales Director, Chef\'s Equipment',
                        'image' => '/images/partners/testimonials/vendor3.jpg',
                        'text' => 'The platform\'s expansion into new markets has helped us scale our kitchen equipment business nationally. The transparent payment system ensures we get paid on time, every time.',
                        'rating' => 4,
                        'date' => '2023-05-28'
                    ]
                ]
            ]
        ];

        return $data[$type] ?? $data['restaurant'];
    }

    private function getPartnerStats(string $type): array
    {
        $data = [
            'restaurant' => [
                'title' => 'Restaurant Partner Statistics',
                'subtitle' => 'The Numbers Speak',
                'stats' => [
                    ['value' => '30%', 'label' => 'Average Revenue Increase', 'icon' => 'TrendingUp'],
                    ['value' => '10K+', 'label' => 'Partner Restaurants', 'icon' => 'Store'],
                    ['value' => '2M+', 'label' => 'Orders Monthly', 'icon' => 'ShoppingBag'],
                    ['value' => '15M+', 'label' => 'Customers Reached', 'icon' => 'Users']
                ]
            ],
            'kitchen' => [
                'title' => 'Kitchen Staff Statistics',
                'subtitle' => 'Career Growth By The Numbers',
                'stats' => [
                    ['value' => '5K+', 'label' => 'Active Staff', 'icon' => 'Users'],
                    ['value' => '30%', 'label' => 'Promotion Rate', 'icon' => 'TrendingUp'],
                    ['value' => '$18/hr', 'label' => 'Average Wage', 'icon' => 'DollarSign'],
                    ['value' => '92%', 'label' => 'Satisfaction Rate', 'icon' => 'ThumbsUp']
                ]
            ],
            'delivery' => [
                'title' => 'Delivery Partner Statistics',
                'subtitle' => 'Earnings & Opportunities',
                'stats' => [
                    ['value' => '8K+', 'label' => 'Active Couriers', 'icon' => 'Users'],
                    ['value' => '$25/hr', 'label' => 'Peak Hour Earnings', 'icon' => 'DollarSign'],
                    ['value' => '500K+', 'label' => 'Weekly Deliveries', 'icon' => 'Package'],
                    ['value' => '96%', 'label' => 'On-time Rate', 'icon' => 'Clock']
                ]
            ],
            'vendor' => [
                'title' => 'Vendor Partner Statistics',
                'subtitle' => 'Supply Chain Success',
                'stats' => [
                    ['value' => '2K+', 'label' => 'Active Vendors', 'icon' => 'Briefcase'],
                    ['value' => '$5M+', 'label' => 'Monthly Orders', 'icon' => 'DollarSign'],
                    ['value' => '40%', 'label' => 'Average Growth', 'icon' => 'TrendingUp'],
                    ['value' => '95%', 'label' => 'Retention Rate', 'icon' => 'Lock']
                ]
            ]
        ];

        return $data[$type] ?? $data['restaurant'];
    }

    private function getPartnerFaq(string $type): array
    {
        $data = [
            'restaurant' => [
                'title' => 'Frequently Asked Questions',
                'subtitle' => 'Common Questions from Restaurant Partners',
                'faqs' => [
                    [
                        'question' => 'How much does it cost to join as a restaurant partner?',
                        'answer' => 'We charge a commission on orders placed through our platform. The exact rate depends on your location, restaurant type, and the services you require. Contact our sales team for a customized quote.'
                    ],
                    [
                        'question' => 'How long does the application process take?',
                        'answer' => 'Typically, the verification and onboarding process takes 1-2 weeks from submission of your application to going live on the platform.'
                    ],
                    [
                        'question' => 'Can I offer only delivery, only pickup, or both?',
                        'answer' => 'You have the flexibility to offer delivery, pickup, or both options based on your restaurant\'s capabilities and preferences.'
                    ],
                    [
                        'question' => 'Do I need to provide my own delivery drivers?',
                        'answer' => 'No, our platform provides delivery partners. However, you can also use your own delivery staff if you prefer.'
                    ],
                    [
                        'question' => 'How will I receive orders from the platform?',
                        'answer' => 'You can receive orders through our dedicated tablet, your existing POS system (if compatible), or via email and phone notifications.'
                    ],
                    [
                        'question' => 'When and how do I get paid for orders?',
                        'answer' => 'We process payments weekly, with direct deposits to your registered bank account. You can track all transactions in real-time through our partner dashboard.'
                    ]
                ]
            ],
            'kitchen' => [
                'title' => 'Frequently Asked Questions',
                'subtitle' => 'Common Questions from Kitchen Staff Applicants',
                'faqs' => [
                    [
                        'question' => 'What types of kitchen positions are available?',
                        'answer' => 'We offer positions ranging from prep cooks and line cooks to sous chefs, head chefs, pastry chefs, and kitchen managers, depending on your skills and experience.'
                    ],
                    [
                        'question' => 'Is prior experience required?',
                        'answer' => 'Some positions require previous experience, while others are suitable for entry-level candidates with a passion for food. Each job listing specifies the requirements.'
                    ],
                    [
                        'question' => 'Can I work part-time or flexible hours?',
                        'answer' => 'Yes, we offer full-time, part-time, and flexible shift options to accommodate different schedules and availability.'
                    ],
                    [
                        'question' => 'What benefits do kitchen staff receive?',
                        'answer' => 'Benefits vary by position and restaurant partner but may include health insurance, paid time off, meal allowances, and training opportunities.'
                    ],
                    [
                        'question' => 'How long does the hiring process take?',
                        'answer' => 'Typically, the process takes 1-2 weeks from application to placement, depending on position availability and your qualifications.'
                    ],
                    [
                        'question' => 'Is formal culinary education required?',
                        'answer' => 'While culinary education is beneficial, many positions value practical experience and skills over formal education. Requirements vary by role and restaurant.'
                    ]
                ]
            ],
            'delivery' => [
                'title' => 'Frequently Asked Questions',
                'subtitle' => 'Common Questions from Delivery Partners',
                'faqs' => [
                    [
                        'question' => 'How much can I earn as a delivery partner?',
                        'answer' => 'Earnings vary based on your location, hours worked, and delivery efficiency. On average, partners earn $15-25 per hour including tips, with higher rates during peak hours.'
                    ],
                    [
                        'question' => 'Do I need my own vehicle?',
                        'answer' => 'Yes, you\'ll need your own reliable transportation (car, bike, scooter) or the ability to deliver on foot in certain dense urban areas.'
                    ],
                    [
                        'question' => 'How does the payment system work?',
                        'answer' => 'You\'ll receive a base payment for each delivery plus 100% of customer tips. Payments are processed weekly, with options for instant cashouts for a small fee.'
                    ],
                    [
                        'question' => 'Can I choose when I work?',
                        'answer' => 'Yes, you have complete flexibility to set your own hours. Simply log into the app when you\'re ready to accept deliveries.'
                    ],
                    [
                        'question' => 'What expenses am I responsible for?',
                        'answer' => 'As an independent contractor, you\'re responsible for your vehicle maintenance, fuel, insurance, and taxes. We provide commercial liability insurance while you\'re actively delivering.'
                    ],
                    [
                        'question' => 'How long does the application process take?',
                        'answer' => 'Most delivery partners are approved within 3-5 business days, pending completion of your background check and document verification.'
                    ]
                ]
            ],
            'vendor' => [
                'title' => 'Frequently Asked Questions',
                'subtitle' => 'Common Questions from Vendor Applicants',
                'faqs' => [
                    [
                        'question' => 'What types of vendors do you partner with?',
                        'answer' => 'We partner with food suppliers, packaging providers, kitchen equipment vendors, cleaning supply companies, technology service providers, and beverage suppliers.'
                    ],
                    [
                        'question' => 'How does the ordering process work?',
                        'answer' => 'Restaurant partners place orders through our platform, which are then sent directly to you for fulfillment according to your specified delivery schedule.'
                    ],
                    [
                        'question' => 'What are the fees for vendors?',
                        'answer' => 'We charge a small platform fee on transactions to cover payment processing and system maintenance. Exact rates depend on your product category and volume.'
                    ],
                    [
                        'question' => 'How quickly will I receive payment for orders?',
                        'answer' => 'Standard payment terms are net-30, but we offer options for faster payment processing for a small fee.'
                    ],
                    [
                        'question' => 'Can I set minimum order quantities?',
                        'answer' => 'Yes, you can specify minimum order quantities, lead times, and delivery schedules in your vendor profile.'
                    ],
                    [
                        'question' => 'How do I handle returns or order issues?',
                        'answer' => 'Our platform includes a standardized process for managing returns, replacements, and dispute resolution to ensure fair treatment for all parties.'
                    ]
                ]
            ]
        ];

        return $data[$type] ?? $data['restaurant'];
    }

    private function getCtaSection(string $type): array
    {
        $data = [
            'restaurant' => [
                'title' => 'Ready to Grow Your Restaurant Business?',
                'description' => 'Join thousands of successful restaurants on our platform and start reaching more customers today.',
                'primary_button' => [
                    'text' => 'Apply Now',
                    'link' => '/become-restaurant#apply-form'
                ],
                'secondary_button' => [
                    'text' => 'Contact Sales',
                    'link' => '/contact?department=restaurant_sales'
                ],
                'image' => '/images/partners/restaurant-cta.jpg'
            ],
            'kitchen' => [
                'title' => 'Ready to Advance Your Culinary Career?',
                'description' => 'Join our network of restaurant partners and take the next step in your kitchen career.',
                'primary_button' => [
                    'text' => 'Apply Now',
                    'link' => '/kitchen-staff#apply-form'
                ],
                'secondary_button' => [
                    'text' => 'Browse Positions',
                    'link' => '/kitchen-staff#positions'
                ],
                'image' => '/images/partners/kitchen-cta.jpg'
            ],
            'delivery' => [
                'title' => 'Ready to Start Earning as a Delivery Partner?',
                'description' => 'Join our team of delivery partners and enjoy flexible hours and competitive pay.',
                'primary_button' => [
                    'text' => 'Apply Now',
                    'link' => '/delivery-staff#apply-form'
                ],
                'secondary_button' => [
                    'text' => 'Learn More',
                    'link' => '/delivery-staff#how-it-works'
                ],
                'image' => '/images/partners/delivery-cta.jpg'
            ],
            'vendor' => [
                'title' => 'Ready to Supply Our Restaurant Network?',
                'description' => 'Join our vendor network and grow your business by supplying quality products to our restaurant partners.',
                'primary_button' => [
                    'text' => 'Apply Now',
                    'link' => '/become-vendor#apply-form'
                ],
                'secondary_button' => [
                    'text' => 'Contact Sales',
                    'link' => '/contact?department=vendor_relations'
                ],
                'image' => '/images/partners/vendor-cta.jpg'
            ]
        ];

        return $data[$type] ?? $data['restaurant'];
    }

    // More methods will follow in the next chunks...
} 