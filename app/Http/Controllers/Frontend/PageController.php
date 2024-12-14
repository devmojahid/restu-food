<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Inertia\Inertia;
use App\Services\Frontend\AboutService;

final class PageController extends Controller
{
    public function __construct(
        private readonly AboutService $aboutService
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

    public function contact(): Response
    {
        return Inertia::render('Frontend/Pages/Contact');
    }
} 