<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Inertia\Inertia;
use App\Services\Frontend\AboutService;
use App\Services\Frontend\ContactService;
use App\Services\Frontend\RestaurantService;
use Illuminate\Http\Request;
use App\Http\Requests\ContactFormRequest;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

final class PageController extends Controller
{
    public function __construct(
        private readonly AboutService $aboutService,
        private readonly ContactService $contactService,
        private readonly RestaurantService $restaurantService
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
} 