<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\MenuService;
use Inertia\Response;
use Inertia\Inertia;

final class MenuController extends Controller
{
    public function __construct(
        private readonly MenuService $menuService
    ) {}

    public function index(): Response
    {
        $data = $this->menuService->getMenuPageData();
        
        return Inertia::render('Frontend/Menu/Index', [
            'categories' => $data['categories'],
            'menuItems' => $data['menuItems'],
            'filters' => $data['filters'],
            'stats' => $data['stats']
        ]);
    }

    public function show(string $slug): Response
    {
        $data = $this->menuService->getMenuItemDetails($slug);
        
        return Inertia::render('Frontend/Menu/Show', [
            'item' => $data['item'],
            'relatedItems' => $data['relatedItems'],
            'reviews' => $data['reviews']
        ]);
    }

    public function category(string $slug): Response
    {
        $data = $this->menuService->getCategoryDetails($slug);
        
        return Inertia::render('Frontend/Menu/Category', [
            'category' => $data['category'],
            'items' => $data['items'],
            'filters' => $data['filters']
        ]);
    }
} 