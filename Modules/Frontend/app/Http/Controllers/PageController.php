<?php

declare(strict_types=1);

namespace Modules\Frontend\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Inertia\Inertia;
use Modules\Frontend\Services\{
    AboutService,
    ContactService,
    RestaurantService,
    Restaurant2Service,
    RestaurantDetailService,
    RestaurantDetail2Service,
    BlogService,
    ChefService,
    PartnerService
};
use Illuminate\Http\Request;
use App\Http\Requests\ContactFormRequest;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

final class PageController extends Controller
{
    public function __construct(
        private readonly AboutService $aboutService,
        private readonly ContactService $contactService,
        private readonly RestaurantService $restaurantService,
        private readonly Restaurant2Service $restaurant2Service,
        private readonly RestaurantDetailService $restaurantDetailService,
        private readonly RestaurantDetail2Service $restaurantDetail2Service,
        private readonly BlogService $blogService,
        private readonly PartnerService $partnerService,
        private readonly ChefService $chefService
    ) {}

    public function about(): Response
    {
        $data = $this->aboutService->getAboutPageData();
        
        return Inertia::module('Frontend::About/Index', [
            'hero' => $data['hero'],
            'mission' => $data['mission'],
            'story' => $data['story'],
            'team' => $data['team'],
            'values' => $data['values'],
            'stats' => $data['stats'],
            'awards' => $data['awards'],
            'locations' => $data['locations'],
            'partners' => $data['partners'],
            'testimonials' => $data['testimonials'],
            'careers' => $data['careers']
        ]);
    }

    public function restaurants(): Response
    {
        $data = $this->restaurantService->getRestaurantPageData();
        
        return Inertia::module('Frontend::Restaurants/Index', [
            'restaurants' => $data['restaurants'],
            'featuredRestaurants' => $data['featuredRestaurants'],
            'popularCuisines' => $data['popularCuisines'],
            'filters' => $data['filters'],
            'stats' => $data['stats']
        ]);
    }

    /**
     * Enhanced version of the restaurants page
     */
    public function restaurants2(): Response
    {
        $data = $this->restaurant2Service->getRestaurant2PageData();
        
        return Inertia::module('Frontend::Restaurants2/Index', [
            'hero' => $data['hero'] ?? null,
            'restaurants' => $data['restaurants'] ?? [],
            'featuredRestaurants' => $data['featuredRestaurants'] ?? [],
            'popularCuisines' => $data['popularCuisines'] ?? [],
            'topRatedRestaurants' => $data['topRatedRestaurants'] ?? [],
            'nearbyRestaurants' => $data['nearbyRestaurants'] ?? [],
            'trendingRestaurants' => $data['trendingRestaurants'] ?? [],
            'filters' => $data['filters'] ?? [],
            'stats' => $data['stats'] ?? [],
            'categories' => $data['categories'] ?? [],
        ]);
    }

    public function contact(): Response
    {
        $data = $this->contactService->getContactPageData();
        
        return Inertia::module('Frontend::Contact/Index', [
            'hero' => $data['hero'],
            'contact' => $data['contact'],
            'locations' => $data['locations'],
            'faq' => $data['faq'],
            'social' => $data['social'],
            'support' => $data['support']
        ]);
    }

    /**
     * Chef listing page
     */
    public function chef(): Response
    {
        try {
            $data = $this->chefService->getChefPageData();
            
            return Inertia::module('Frontend::Chef/Index', [
                'hero' => $data['hero'] ?? null,
                'featuredChefs' => $data['featuredChefs'] ?? [],
                'categories' => $data['categories'] ?? [],
                'chefs' => $data['chefs'] ?? [],
                'testimonials' => $data['testimonials'] ?? [],
                'stats' => $data['stats'] ?? [],
                'joinSection' => $data['joinSection'] ?? [],
                'faqs' => $data['faqs'] ?? [],
                'error' => null
            ]);
        } catch (\Throwable $e) {
            // Log the error
            \Log::error('Error loading chef page: ' . $e->getMessage(), ['exception' => $e]);
            
            return Inertia::module('Frontend::Chef/Index', [
                'hero' => null,
                'featuredChefs' => [],
                'categories' => [],
                'chefs' => [],
                'testimonials' => [],
                'stats' => [],
                'joinSection' => [],
                'faqs' => [],
                'error' => 'There was a problem loading the chef page. Please try again later.'
            ]);
        }
    }
    
    /**
     * Chef detail page
     */
    public function chefDetail(string $slug = null): Response
    {
        try {
            $data = $this->chefService->getChefDetailsData($slug);
            
            return Inertia::module('Frontend::Chef/Show', [
                'chef' => $data['chef'] ?? null,
                'specialties' => $data['specialties'] ?? [],
                'gallery' => $data['gallery'] ?? [],
                'experience' => $data['experience'] ?? [],
                'awards' => $data['awards'] ?? [],
                'testimonials' => $data['testimonials'] ?? [],
                'relatedChefs' => $data['relatedChefs'] ?? [],
                'bookingInfo' => $data['bookingInfo'] ?? [],
                'recipes' => $data['recipes'] ?? [],
                'social' => $data['social'] ?? [],
                'error' => null
            ]);
        } catch (\Throwable $e) {
            // Log the error
            \Log::error('Error loading chef detail page: ' . $e->getMessage(), ['exception' => $e, 'slug' => $slug]);
            
            return Inertia::module('Frontend::Chef/Show', [
                'chef' => null,
                'specialties' => [],
                'gallery' => [],
                'experience' => [],
                'awards' => [],
                'testimonials' => [],
                'relatedChefs' => [],
                'bookingInfo' => [],
                'recipes' => [],
                'social' => [],
                'error' => 'There was a problem loading the chef details. Please try again later.'
            ]);
        }
    }

    public function submitContact(ContactFormRequest $request)
    {
        try {
            // Send email
            Mail::to(config('mail.admin_email', 'admin@example.com'))
                ->send(new ContactFormMail($request->validated()));

            return back()->with('success', 'Thank you for your message. We will get back to you soon!');
        } catch (\Exception $e) {
            return back()->with('error', 'Sorry, there was an error sending your message. Please try again later.');
        }
    }

    public function blogs(Request $request): Response
    {
        $filters = [
            'category' => $request->query('category')
        ];

        $data = $this->blogService->getBlogPageData($filters);
        
        return Inertia::module('Frontend::Blog/Index', [
            'posts' => $data['posts'],
            'featured' => $data['featured'],
            'categories' => $data['categories'],
            'stats' => $data['stats'],
            'popularPosts' => $data['popularPosts'],
            'recentPosts' => $data['recentPosts'],
            'filters' => $filters
        ]);
    }

    public function blogSingle(string $slug)
    {
        $data = $this->blogService->getBlogPostData($slug);

        return Inertia::module('Frontend::Blog/Show', $data);
    }

    public function restaurantDetail(string $slug = null): Response
    {
        $data = $this->restaurantDetailService->getRestaurantDetailData($slug);
        
        return Inertia::module('Frontend::RestaurantDetail/Index', [
            'hero' => $data['hero'],
            'restaurant' => $data['restaurant'],
            'menu' => $data['menu'],
            'gallery' => $data['gallery'],
            'reviews' => $data['reviews'],
            'about' => $data['about'],
            'location' => $data['location'],
            'bookingInfo' => $data['bookingInfo'],
            'schedule' => $data['schedule'],
            'chefs' => $data['chefs'],
            'offers' => $data['offers'],
            'faqs' => $data['faqs'],
            'similarRestaurants' => $data['similarRestaurants'],
            'insights' => $data['insights'],
        ]);
    }

    /**
     * Enhanced version of restaurant detail page
     */
    public function restaurantDetail2(string $slug = null): Response
    {
        $data = $this->restaurantDetail2Service->getRestaurantDetail2Data($slug);
        
        return Inertia::module('Frontend::RestaurantDetail2/Index', [
            'hero' => $data['hero'] ?? null,
            'restaurant' => $data['restaurant'] ?? null,
            'highlights' => $data['highlights'] ?? null,
            'menu' => $data['menu'] ?? null,
            'gallery' => $data['gallery'] ?? null,
            'reviews' => $data['reviews'] ?? null,
            'about' => $data['about'] ?? null,
            'location' => $data['location'] ?? null,
            'bookingInfo' => $data['bookingInfo'] ?? null,
            'schedule' => $data['schedule'] ?? null,
            'chefs' => $data['chefs'] ?? null,
            'offers' => $data['offers'] ?? null,
            'faqs' => $data['faqs'] ?? null,
            'similarRestaurants' => $data['similarRestaurants'] ?? null,
            'insights' => $data['insights'] ?? null,
            'testimonials' => $data['testimonials'] ?? null,
            'awards' => $data['awards'] ?? null,
            'events' => $data['events'] ?? null,
        ]);
    }

    public function becomeRestaurant(): Response
    {
        try {
            return Inertia::module('Frontend::Partners/BecomeRestaurant', [
                'data' => $this->partnerService->getRestaurantPartnerData(),
            ]);
        } catch (\Throwable $e) {
            return Inertia::module('Frontend::Partners/BecomeRestaurant', [
                'data' => [],
                'error' => 'Failed to load restaurant partner data. Please try again later.'
            ]);
        }
    }

    public function kitchenStaff(): Response
    {
        try {
            return Inertia::module('Frontend::Partners/KitchenStaff', [
                'data' => $this->partnerService->getKitchenStaffData(),
            ]);
        } catch (\Throwable $e) {
            return Inertia::module('Frontend::Partners/KitchenStaff', [
                'data' => [],
                'error' => 'Failed to load kitchen staff data. Please try again later.'
            ]);
        }
    }

    public function deliveryStaff(): Response
    {
        try {
            return Inertia::module('Frontend::Partners/DeliveryStaff', [
                'data' => $this->partnerService->getDeliveryStaffData(),
            ]);
        } catch (\Throwable $e) {
            return Inertia::module('Frontend::Partners/DeliveryStaff', [
                'data' => [],
                'error' => 'Failed to load delivery staff data. Please try again later.'
            ]);
        }
    }

    public function becomeVendor(): Response
    {
        try {
            return Inertia::module('Frontend::Partners/BecomeVendor', [
                'data' => $this->partnerService->getVendorData(),
            ]);
        } catch (\Throwable $e) {
            return Inertia::module('Frontend::Partners/BecomeVendor', [  
                'data' => [],
                'error' => 'Failed to load vendor data. Please try again later.'
            ]);
        }
    }
} 