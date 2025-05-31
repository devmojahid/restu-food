<?php

declare(strict_types=1);

namespace App\Services\Frontend;

use App\Services\BaseService;

final class ChefService extends BaseService
{
    public function getChefPageData(): array
    {
        return [
            'hero' => $this->getHeroSection(),
            'featuredChefs' => $this->getFeaturedChefs(),
            'categories' => $this->getChefCategories(),
            'chefs' => $this->getAllChefs(),
            'testimonials' => $this->getChefTestimonials(),
            'stats' => $this->getStats(),
            'joinSection' => $this->getJoinSection(),
            'faqs' => $this->getFaqs(),
        ];
    }

    public function getChefDetailsData(string $slug = null): array
    {
        // Use slug to fetch chef details in real implementation
        // For now, return dummy data
        return [
            'chef' => $this->getChefDetails($slug),
            'specialties' => $this->getChefSpecialties($slug),
            'gallery' => $this->getChefGallery($slug),
            'experience' => $this->getChefExperience($slug),
            'awards' => $this->getChefAwards($slug),
            'testimonials' => $this->getChefTestimonials($slug),
            'relatedChefs' => $this->getRelatedChefs($slug),
            'bookingInfo' => $this->getBookingInfo($slug),
            'recipes' => $this->getChefRecipes($slug),
            'social' => $this->getChefSocial($slug),
        ];
    }

    private function getHeroSection(): array
    {
        return [
            'title' => 'Meet Our Culinary Masters',
            'subtitle' => 'Talented chefs bringing exceptional flavors to your table',
            'description' => 'Discover the passionate culinary artists behind your favorite dishes. Our chefs combine creativity, expertise, and a love for food to craft unforgettable dining experiences.',
            'image' => '/images/chefs/hero.jpg',
            'cta' => [
                'text' => 'Find Your Chef',
                'link' => '#chef-grid'
            ],
            'stats' => [
                ['label' => 'Expert Chefs', 'value' => '150+'],
                ['label' => 'Cuisines', 'value' => '25+'],
                ['label' => 'Satisfaction Rate', 'value' => '98%'],
                ['label' => 'Signature Dishes', 'value' => '500+']
            ]
        ];
    }

    private function getFeaturedChefs(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Marco Rodriguez',
                'slug' => 'marco-rodriguez',
                'title' => 'Executive Chef',
                'image' => '/images/chefs/chef-1.jpg',
                'cuisine' => 'Italian',
                'rating' => 4.9,
                'reviews_count' => 248,
                'experience' => '15+ years',
                'featured' => true,
                'signature_dish' => 'Truffle Risotto',
                'restaurants' => ['La Tavola', 'Pasta Prima'],
                'awards' => ['James Beard Award', 'Michelin Star'],
                'bio' => 'Marco brings 15 years of culinary excellence from Italys finest kitchens to your table. His passion for authentic Italian flavors shines through in every dish.'
            ],
            [
                'id' => 2,
                'name' => 'Aisha Khan',
                'slug' => 'aisha-khan',
                'title' => 'Head Chef',
                'image' => '/images/chefs/chef-2.jpg',
                'cuisine' => 'Indian',
                'rating' => 4.8,
                'reviews_count' => 186,
                'experience' => '12+ years',
                'featured' => true,
                'signature_dish' => 'Butter Chicken Masala',
                'restaurants' => ['Spice Garden', 'Mumbai Delight'],
                'awards' => ['Best Indian Chef 2022', 'Culinary Excellence Award'],
                'bio' => 'Aisha combines traditional Indian cooking techniques with modern presentation, creating explosive flavors that transport you straight to the streets of Mumbai.'
            ],
            [
                'id' => 3,
                'name' => 'David Chen',
                'slug' => 'david-chen',
                'title' => 'Master Chef',
                'image' => '/images/chefs/chef-3.jpg',
                'cuisine' => 'Chinese',
                'rating' => 4.7,
                'reviews_count' => 204,
                'experience' => '18+ years',
                'featured' => true,
                'signature_dish' => 'Peking Duck',
                'restaurants' => ['Golden Dragon', 'Dynasty'],
                'awards' => ['Asian Culinary Master', 'Food Network Champion'],
                'bio' => 'David specializes in authentic Chinese cuisine with a focus on Cantonese and Sichuan flavors. His dim sum creations are legendary throughout the city.'
            ],
            [
                'id' => 4,
                'name' => 'Sofia Mendez',
                'slug' => 'sofia-mendez',
                'title' => 'Pastry Chef',
                'image' => '/images/chefs/chef-4.jpg',
                'cuisine' => 'French Pastry',
                'rating' => 4.9,
                'reviews_count' => 176,
                'experience' => '10+ years',
                'featured' => true,
                'signature_dish' => 'Chocolate Soufflé',
                'restaurants' => ['Sweet Sensations', 'Patisserie Paris'],
                'awards' => ['Dessert Master 2023', 'International Pastry Competition Winner'],
                'bio' => 'Sofia transforms simple ingredients into extraordinary desserts. Trained in Paris, her pastries combine technical perfection with artistic presentation.'
            ]
        ];
    }

    private function getChefCategories(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Italian',
                'slug' => 'italian',
                'image' => '/images/categories/italian.jpg',
                'chef_count' => 12
            ],
            [
                'id' => 2,
                'name' => 'French',
                'slug' => 'french',
                'image' => '/images/categories/french.jpg',
                'chef_count' => 8
            ],
            [
                'id' => 3,
                'name' => 'Asian',
                'slug' => 'asian',
                'image' => '/images/categories/asian.jpg',
                'chef_count' => 15
            ],
            [
                'id' => 4,
                'name' => 'Middle Eastern',
                'slug' => 'middle-eastern',
                'image' => '/images/categories/middle-eastern.jpg',
                'chef_count' => 7
            ],
            [
                'id' => 5,
                'name' => 'Pastry',
                'slug' => 'pastry',
                'image' => '/images/categories/pastry.jpg',
                'chef_count' => 10
            ],
            [
                'id' => 6,
                'name' => 'Vegan',
                'slug' => 'vegan',
                'image' => '/images/categories/vegan.jpg',
                'chef_count' => 6
            ]
        ];
    }

    private function getAllChefs(): array
    {
        $chefs = $this->getFeaturedChefs();
        
        // Add more chefs to the array
        $additionalChefs = [
            [
                'id' => 5,
                'name' => 'James Wilson',
                'slug' => 'james-wilson',
                'title' => 'BBQ Specialist',
                'image' => '/images/chefs/chef-5.jpg',
                'cuisine' => 'American BBQ',
                'rating' => 4.6,
                'reviews_count' => 158,
                'experience' => '14+ years',
                'featured' => false,
                'signature_dish' => 'Smoked Brisket',
                'restaurants' => ['Smoke House', 'Grill Master'],
                'awards' => ['BBQ Champion 2021', 'Pit Master Excellence'],
                'bio' => 'James has mastered the art of smoking and grilling. His slow-cooked meats and homemade sauces have earned him national recognition.'
            ],
            [
                'id' => 6,
                'name' => 'Maria Lopez',
                'slug' => 'maria-lopez',
                'title' => 'Mexican Cuisine Expert',
                'image' => '/images/chefs/chef-6.jpg',
                'cuisine' => 'Mexican',
                'rating' => 4.7,
                'reviews_count' => 142,
                'experience' => '11+ years',
                'featured' => false,
                'signature_dish' => 'Authentic Mole Poblano',
                'restaurants' => ['Casa Mexico', 'Cantina Fresca'],
                'awards' => ['Latin American Cooking Award', 'Best Taco Challenge Winner'],
                'bio' => 'Maria brings authentic flavors from her hometown in Mexico. Her family recipes have been passed down through generations, offering a true taste of Mexican cuisine.'
            ],
            [
                'id' => 7,
                'name' => 'Hiroshi Tanaka',
                'slug' => 'hiroshi-tanaka',
                'title' => 'Sushi Master',
                'image' => '/images/chefs/chef-7.jpg',
                'cuisine' => 'Japanese',
                'rating' => 4.9,
                'reviews_count' => 201,
                'experience' => '20+ years',
                'featured' => false,
                'signature_dish' => 'Omakase Sushi Selection',
                'restaurants' => ['Sakura Sushi', 'Tokyo Express'],
                'awards' => ['Tokyo Sushi Competition Gold', 'Master Craftsman Certification'],
                'bio' => 'Hiroshi trained for 10 years in Tokyo before bringing his precise knife skills and artistic presentation to our restaurants. His omakase experience is not to be missed.'
            ],
            [
                'id' => 8,
                'name' => 'Emma Dubois',
                'slug' => 'emma-dubois',
                'title' => 'French Cuisine Chef',
                'image' => '/images/chefs/chef-8.jpg',
                'cuisine' => 'French',
                'rating' => 4.8,
                'reviews_count' => 189,
                'experience' => '16+ years',
                'featured' => false,
                'signature_dish' => 'Coq au Vin',
                'restaurants' => ['Le Petit Bistro', 'Café Paris'],
                'awards' => ['French Culinary Institute Honor', 'European Excellence Award'],
                'bio' => 'Emma brings the sophisticated flavors of France to your table. Trained in Paris, her classical techniques and attention to detail create unforgettable dining experiences.'
            ]
        ];
        
        return array_merge($chefs, $additionalChefs);
    }

    private function getChefDetails(string $slug = null): array
    {
        // In a real implementation, you would fetch chef details based on the slug
        // For now, return dummy data for any slug
        return [
            'id' => 1,
            'name' => 'Marco Rodriguez',
            'slug' => 'marco-rodriguez',
            'title' => 'Executive Chef',
            'image' => '/images/chefs/chef-1.jpg',
            'banner_image' => '/images/chefs/chef-1-banner.jpg',
            'cuisine' => 'Italian',
            'rating' => 4.9,
            'reviews_count' => 248,
            'experience' => '15+ years',
            'featured' => true,
            'signature_dish' => 'Truffle Risotto',
            'restaurants' => ['La Tavola', 'Pasta Prima'],
            'awards' => ['James Beard Award', 'Michelin Star'],
            'bio' => 'Marco brings 15 years of culinary excellence from Italys finest kitchens to your table. His passion for authentic Italian flavors shines through in every dish.',
            'long_bio' => 'Born in Naples, Italy, Marco Rodriguez discovered his passion for cooking at the young age of eight while helping his grandmother prepare traditional Sunday meals. After completing his formal education at the prestigious Culinary Institute of Florence, Marco honed his skills in Michelin-starred restaurants across Europe before bringing his talents to our establishment. Known for his perfectionism and innovative approach to classic Italian cuisine, Marco has revolutionized our menu with dishes that honor tradition while embracing modern techniques. His commitment to using only the finest seasonal ingredients ensures an authentic and unforgettable dining experience.',
            'skills' => [
                ['name' => 'Italian Cuisine', 'level' => 98],
                ['name' => 'Pasta Making', 'level' => 95],
                ['name' => 'Wine Pairing', 'level' => 90],
                ['name' => 'Menu Development', 'level' => 92],
                ['name' => 'Team Leadership', 'level' => 88]
            ],
            'availability' => 'Available for private events and catering',
            'languages' => ['English', 'Italian', 'Spanish'],
            'location' => 'New York City',
            'contact_email' => 'marco@example.com',
            'booking_fee' => '$250/hr'
        ];
    }
    
    private function getChefSpecialties(string $slug = null): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Truffle Risotto',
                'image' => '/images/dishes/truffle-risotto.jpg',
                'description' => 'Creamy Arborio rice slow-cooked with porcini mushrooms, finished with shaved black truffles and aged Parmesan.',
                'price' => 28,
                'preparation_time' => '25 mins',
                'is_signature' => true
            ],
            [
                'id' => 2,
                'name' => 'Osso Buco',
                'image' => '/images/dishes/osso-buco.jpg',
                'description' => 'Tender veal shanks braised with vegetables, white wine, and broth, served with traditional gremolata.',
                'price' => 34,
                'preparation_time' => '3 hours',
                'is_signature' => false
            ],
            [
                'id' => 3,
                'name' => 'Seafood Linguine',
                'image' => '/images/dishes/seafood-linguine.jpg',
                'description' => 'Fresh pasta tossed with a medley of seafood in a light white wine and cherry tomato sauce.',
                'price' => 32,
                'preparation_time' => '20 mins',
                'is_signature' => false
            ],
            [
                'id' => 4,
                'name' => 'Tiramisu',
                'image' => '/images/dishes/tiramisu.jpg',
                'description' => 'Classic Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cheese.',
                'price' => 12,
                'preparation_time' => '4 hours (including setting time)',
                'is_signature' => true
            ]
        ];
    }
    
    private function getChefGallery(string $slug = null): array
    {
        return [
            [
                'id' => 1,
                'image' => '/images/gallery/chef-1-gallery-1.jpg',
                'caption' => 'Preparing fresh pasta by hand'
            ],
            [
                'id' => 2,
                'image' => '/images/gallery/chef-1-gallery-2.jpg',
                'caption' => 'Plating a signature dish'
            ],
            [
                'id' => 3,
                'image' => '/images/gallery/chef-1-gallery-3.jpg',
                'caption' => 'Teaching a cooking class'
            ],
            [
                'id' => 4,
                'image' => '/images/gallery/chef-1-gallery-4.jpg',
                'caption' => 'At the farmers market selecting ingredients'
            ],
            [
                'id' => 5,
                'image' => '/images/gallery/chef-1-gallery-5.jpg',
                'caption' => 'With the kitchen team'
            ],
            [
                'id' => 6,
                'image' => '/images/gallery/chef-1-gallery-6.jpg',
                'caption' => 'Featured on cooking show'
            ]
        ];
    }
    
    private function getChefExperience(string $slug = null): array
    {
        return [
            [
                'position' => 'Executive Chef',
                'company' => 'La Tavola',
                'location' => 'New York',
                'period' => '2019 - Present',
                'description' => 'Leading a team of 15 chefs, creating seasonal menus, and maintaining the highest standards of culinary excellence.'
            ],
            [
                'position' => 'Head Chef',
                'company' => 'Trattoria Milano',
                'location' => 'Milan, Italy',
                'period' => '2015 - 2019',
                'description' => 'Managed kitchen operations for a Michelin-starred restaurant specializing in Northern Italian cuisine.'
            ],
            [
                'position' => 'Sous Chef',
                'company' => 'Ristorante Savoia',
                'location' => 'Rome, Italy',
                'period' => '2012 - 2015',
                'description' => 'Assisted the executive chef with menu development and daily kitchen operations.'
            ],
            [
                'position' => 'Line Cook',
                'company' => 'Il Giardino',
                'location' => 'Naples, Italy',
                'period' => '2009 - 2012',
                'description' => 'Specialized in pasta and risotto preparation in a traditional Neapolitan restaurant.'
            ]
        ];
    }
    
    private function getChefAwards(string $slug = null): array
    {
        return [
            [
                'title' => 'James Beard Award',
                'category' => 'Best Chef: Northeast',
                'year' => 2022,
                'image' => '/images/awards/james-beard.png'
            ],
            [
                'title' => 'Michelin Star',
                'category' => 'Exceptional Cuisine',
                'year' => 2021,
                'image' => '/images/awards/michelin.png'
            ],
            [
                'title' => 'Food & Wine',
                'category' => 'Best New Chef',
                'year' => 2019,
                'image' => '/images/awards/food-wine.png'
            ],
            [
                'title' => 'International Risotto Competition',
                'category' => 'Gold Medal',
                'year' => 2018,
                'image' => '/images/awards/risotto-competition.png'
            ]
        ];
    }
    
    private function getChefTestimonials(string $slug = null): array
    {
        return [
            [
                'id' => 1,
                'name' => 'Emily Johnson',
                'image' => '/images/testimonials/person-1.jpg',
                'role' => 'Food Critic',
                'rating' => 5,
                'text' => 'Chef Marco\'s attention to detail and flavor combinations are extraordinary. His truffle risotto is the best I\'ve ever tasted, with perfect texture and balanced seasoning.',
                'date' => '2023-05-15'
            ],
            [
                'id' => 2,
                'name' => 'Michael Chen',
                'image' => '/images/testimonials/person-2.jpg',
                'role' => 'Private Event Client',
                'rating' => 5,
                'text' => 'We hired Chef Marco for our anniversary dinner, and he exceeded all expectations. His menu planning was thoughtful, and the execution was flawless. A truly memorable experience!',
                'date' => '2023-07-22'
            ],
            [
                'id' => 3,
                'name' => 'Sophia Rodriguez',
                'image' => '/images/testimonials/person-3.jpg',
                'role' => 'Cooking Class Student',
                'rating' => 4,
                'text' => 'I learned so much in Chef Marco\'s pasta making class. He breaks down complex techniques into manageable steps and shares invaluable tips from his years of experience.',
                'date' => '2023-04-10'
            ]
        ];
    }
    
    private function getRelatedChefs(string $slug = null): array
    {
        // Return a subset of chefs with similar cuisine type
        $allChefs = $this->getAllChefs();
        $filtered = array_filter($allChefs, function($chef) {
            return $chef['cuisine'] === 'Italian' || $chef['cuisine'] === 'French';
        });
        
        return array_slice($filtered, 0, 3);
    }
    
    private function getBookingInfo(string $slug = null): array
    {
        return [
            'availability' => [
                'weekdays' => ['Monday', 'Wednesday', 'Thursday', 'Friday'],
                'weekends' => ['Saturday'],
                'hours' => '9:00 AM - 9:00 PM'
            ],
            'services' => [
                [
                    'name' => 'Private Dining',
                    'description' => 'Personalized menu and service in the comfort of your home',
                    'base_price' => 500,
                    'price_per_person' => 75,
                    'min_guests' => 4,
                    'max_guests' => 12
                ],
                [
                    'name' => 'Cooking Classes',
                    'description' => 'Learn techniques and recipes directly from Chef Marco',
                    'base_price' => 300,
                    'price_per_person' => 50,
                    'min_guests' => 2,
                    'max_guests' => 8
                ],
                [
                    'name' => 'Special Events',
                    'description' => 'Weddings, corporate events, and celebrations',
                    'base_price' => 1000,
                    'price_per_person' => 100,
                    'min_guests' => 20,
                    'max_guests' => 100
                ]
            ],
            'booking_notice' => 'Please book at least 2 weeks in advance',
            'cancellation_policy' => '48-hour notice required for full refund',
            'payment_methods' => ['Credit Card', 'Bank Transfer'],
            'service_area' => 'New York City and surrounding areas (up to 30 miles)'
        ];
    }
    
    private function getChefRecipes(string $slug = null): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Classic Tiramisu',
                'image' => '/images/recipes/tiramisu.jpg',
                'difficulty' => 'Intermediate',
                'prep_time' => 30,
                'cook_time' => 0,
                'servings' => 8,
                'is_premium' => false,
                'short_description' => 'Learn how to make authentic Italian tiramisu with mascarpone, espresso, and ladyfingers.'
            ],
            [
                'id' => 2,
                'title' => 'Perfect Risotto Base',
                'image' => '/images/recipes/risotto.jpg',
                'difficulty' => 'Intermediate',
                'prep_time' => 10,
                'cook_time' => 25,
                'servings' => 4,
                'is_premium' => false,
                'short_description' => 'Master the technique for creamy, perfectly cooked risotto - the foundation for countless variations.'
            ],
            [
                'id' => 3,
                'title' => 'Homemade Pasta Dough',
                'image' => '/images/recipes/pasta-dough.jpg',
                'difficulty' => 'Beginner',
                'prep_time' => 20,
                'cook_time' => 2,
                'servings' => 4,
                'is_premium' => false,
                'short_description' => 'Simple but authentic pasta dough recipe that can be used for various pasta shapes.'
            ],
            [
                'id' => 4,
                'title' => 'Signature Truffle Risotto',
                'image' => '/images/recipes/truffle-risotto.jpg',
                'difficulty' => 'Advanced',
                'prep_time' => 15,
                'cook_time' => 30,
                'servings' => 4,
                'is_premium' => true,
                'short_description' => 'Chef Marco\'s award-winning truffle risotto recipe with detailed instructions and techniques.'
            ]
        ];
    }
    
    private function getChefSocial(string $slug = null): array
    {
        return [
            'instagram' => 'chef_marco',
            'twitter' => 'marcorodriguez',
            'facebook' => 'chefmarcoofficial',
            'youtube' => 'channel/chef_marco_cooking',
            'website' => 'https://chefmarco.example.com',
            'blog' => 'https://chefmarco.example.com/blog'
        ];
    }

    private function getStats(): array
    {
        return [
            [
                'value' => '150+',
                'label' => 'Expert Chefs',
                'icon' => 'Award'
            ],
            [
                'value' => '25+',
                'label' => 'Cuisine Types',
                'icon' => 'Utensils'
            ],
            [
                'value' => '10K+',
                'label' => 'Happy Customers',
                'icon' => 'Users'
            ],
            [
                'value' => '500+',
                'label' => 'Signature Dishes',
                'icon' => 'Award'
            ]
        ];
    }

    private function getJoinSection(): array
    {
        return [
            'title' => 'Join Our Culinary Team',
            'subtitle' => 'Are you a talented chef looking to showcase your skills?',
            'description' => 'We\'re always looking for passionate culinary artists to join our platform. Share your unique style with thousands of food enthusiasts.',
            'benefits' => [
                'Flexible schedule',
                'Competitive compensation',
                'Build your personal brand',
                'Access to premium ingredients',
                'Professional development opportunities'
            ],
            'image' => '/images/chefs/join-team.jpg',
            'cta' => [
                'text' => 'Apply Now',
                'link' => '/chef-application'
            ]
        ];
    }

    private function getFaqs(): array
    {
        return [
            [
                'question' => 'How do I book a chef for a private event?',
                'answer' => 'You can book a chef by visiting their profile and clicking the "Book Now" button. Follow the steps to select your date, menu preferences, and complete the booking process.'
            ],
            [
                'question' => 'What qualifications do your chefs have?',
                'answer' => 'All our chefs go through a rigorous vetting process. They must have professional culinary training, at least 5 years of experience, and pass our quality standards assessment.'
            ],
            [
                'question' => 'Can I request a custom menu?',
                'answer' => 'Absolutely! Most of our chefs offer customized menus based on your preferences, dietary restrictions, and special occasions. Simply discuss your requirements during the booking process.'
            ],
            [
                'question' => 'What is the cancellation policy?',
                'answer' => 'Cancellation policies vary by chef, but generally require 48-72 hours notice for a full refund. Check the specific chef\'s terms on their profile page.'
            ],
            [
                'question' => 'Do chefs bring their own equipment?',
                'answer' => 'Yes, our chefs bring their own knives and specialized tools. They will use your kitchen equipment for cooking but will clean everything after the service.'
            ],
            [
                'question' => 'How far in advance should I book a chef?',
                'answer' => 'We recommend booking at least 2 weeks in advance, especially for popular chefs or special occasions. For larger events, 1-3 months notice is advised.'
            ]
        ];
    }
} 