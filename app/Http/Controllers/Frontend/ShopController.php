<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Inertia\Inertia;
use App\Services\Frontend\ShopService;
use Illuminate\Http\Request;

final class ShopController extends Controller
{
    public function __construct(
        private readonly ShopService $shopService
    ) {}

    public function index(Request $request): Response
    {
        try {
            $data = $this->shopService->getShopPageData([
                'category' => $request->query('category'),
                'brand' => $request->query('brand'),
                'price' => $request->query('price'),
                'sort' => $request->query('sort', 'popular'),
            ]);
            
            return Inertia::render('Frontend/Shop/Index', [
                'hero' => $data['hero'] ?? null,
                'featuredProducts' => $data['featuredProducts'] ?? [],
                'products' => $data['products'] ?? [],
                'categories' => $data['categories'] ?? [],
                'brands' => $data['brands'] ?? [],
                'filters' => $data['filters'] ?? [],
                'popularProducts' => $data['popularProducts'] ?? [],
                'newArrivals' => $data['newArrivals'] ?? [],
                'dealOfTheDay' => $data['dealOfTheDay'] ?? null,
                'testimonials' => $data['testimonials'] ?? [],
                'banner' => $data['banner'] ?? null,
            ]);
        } catch (\Throwable $e) {
            return $this->renderFallbackPage($this->getSafeErrorMessage($e));
        }
    }

    public function show(string $slug): Response
    {
        try {
            $data = $this->shopService->getProductDetailData($slug);
            
            return Inertia::render('Frontend/Shop/Show', [
                'product' => $data['product'] ?? null,
                'relatedProducts' => $data['relatedProducts'] ?? [],
                'reviews' => $data['reviews'] ?? [],
                'faqs' => $data['faqs'] ?? [],
            ]);
        } catch (\Throwable $e) {
            return $this->renderFallbackPage($this->getSafeErrorMessage($e));
        }
    }
    
    private function getSafeErrorMessage(\Throwable $e): string
    {
        // In production, don't expose error details
        if (app()->environment('production')) {
            return 'Something went wrong while loading the shop page. Please try again later.';
        }
        
        return $e->getMessage();
    }
    
    private function renderFallbackPage(string $errorMessage = null): Response
    {
        return Inertia::render('Frontend/Shop/Index', [
            'error' => $errorMessage,
            'hero' => [
                'title' => 'Our Shop',
                'subtitle' => 'Browse our products',
                'description' => 'Discover our carefully selected food products and ingredients.',
                'image' => '/images/shop/hero-fallback.jpg',
            ],
            'products' => [],
            'categories' => [],
            'brands' => [],
            'filters' => [],
        ]);
    }
} 