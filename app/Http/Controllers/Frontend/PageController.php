<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Inertia\Inertia;
use App\Services\Frontend\AboutService;
use App\Services\Frontend\ContactService;
use App\Services\Frontend\RestaurantService;
use App\Services\Frontend\Restaurant2Service;
use App\Services\Frontend\RestaurantDetailService;
use App\Services\Frontend\RestaurantDetail2Service;
use App\Services\Frontend\BlogService;
use App\Services\Frontend\ChefService;
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
        private readonly ChefService $chefService
    ) {}

    public function about(): Response
    {
        $data = $this->aboutService->getAboutPageData();
        
        return Inertia::render('Frontend/About/Index', [
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
        
        return Inertia::render('Frontend/Restaurants/Index', [
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
        
        return Inertia::render('Frontend/Restaurants2/Index', [
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
        
        return Inertia::render('Frontend/Contact/Index', [
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
            
            return Inertia::render('Frontend/Chef/Index', [
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
            
            return Inertia::render('Frontend/Chef/Index', [
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
            
            return Inertia::render('Frontend/Chef/Show', [
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
            
            return Inertia::render('Frontend/Chef/Show', [
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
        
        return Inertia::render('Frontend/Blog/Index', [
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

        return Inertia::render('Frontend/Blog/Show', $data);
    }

    public function restaurantDetail(string $slug = null): Response
    {
        $data = $this->restaurantDetailService->getRestaurantDetailData($slug);
        
        return Inertia::render('Frontend/RestaurantDetail/Index', [
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
        
        return Inertia::render('Frontend/RestaurantDetail2/Index', [
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
} 