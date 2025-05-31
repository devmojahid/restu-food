<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\FoodMenu2Service;
use Inertia\Response;
use Inertia\Inertia;

final class FoodMenu2Controller extends Controller
{
    public function __construct(
        private readonly FoodMenu2Service $foodMenu2Service
    ) {}

    public function index(): Response
    {
        try {
            $data = $this->foodMenu2Service->getFoodMenu2PageData();
            
            return Inertia::render('Frontend/FoodMenu2/Index', $data);
        } catch (\Throwable $e) {
            logger()->error('Error in FoodMenu2Controller::index: ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            
            return Inertia::render('Frontend/FoodMenu2/Index', [
                'hero' => [],
                'categories' => [],
                'menuItems' => [],
                'featuredItems' => [],
                'popularCombos' => [],
                'nutritionalGuide' => [],
                'filters' => [],
                'stats' => [],
                'error' => 'Something went wrong. Please try again later.'
            ]);
        }
    }

    public function show(string $slug): Response
    {
        try {
            $data = $this->foodMenu2Service->getMenuItemDetails($slug);
            
            if (empty($data['item'])) {
                return $this->renderNotFound($slug);
            }
            
            return Inertia::render('Frontend/FoodMenu2/Show', $data);
        } catch (\Throwable $e) {
            logger()->error('Error in FoodMenu2Controller::show: ' . $e->getMessage(), [
                'exception' => $e,
                'slug' => $slug
            ]);
            
            return $this->renderNotFound($slug);
        }
    }

    public function category(string $slug): Response
    {
        try {
            $data = $this->foodMenu2Service->getCategoryDetails($slug);
            
            if (empty($data['category'])) {
                return $this->renderCategoryNotFound($slug);
            }
            
            return Inertia::render('Frontend/FoodMenu2/Category', $data);
        } catch (\Throwable $e) {
            logger()->error('Error in FoodMenu2Controller::category: ' . $e->getMessage(), [
                'exception' => $e,
                'slug' => $slug
            ]);
            
            return $this->renderCategoryNotFound($slug);
        }
    }

    /**
     * Show the enhanced details page for a specific menu item.
     *
     * @param string $slug
     * @return \Inertia\Response
     */
    public function showDetails2(string $slug): Response
    {
        try {
            $itemDetails = $this->foodMenu2Service->getMenuItemDetails2($slug);
            
            return Inertia::render('Frontend/FoodMenu2/Details2', [
                'item' => $itemDetails['item'] ?? null,
                'relatedItems' => $itemDetails['related_items'] ?? [],
                'reviews' => $itemDetails['reviews'] ?? [],
            ]);
        } catch (\Exception $e) {
            return $this->renderNotFound($slug);
        }
    }

    /**
     * Render a not found page for menu items
     */
    private function renderNotFound(string $slug): Response
    {
        return Inertia::render('Frontend/FoodMenu2/NotFound', [
            'message' => "Menu item '{$slug}' not found",
            'type' => 'item'
        ]);
    }

    /**
     * Render a not found page for categories
     */
    private function renderCategoryNotFound(string $slug): Response
    {
        return Inertia::render('Frontend/FoodMenu2/NotFound', [
            'message' => "Category '{$slug}' not found",
            'type' => 'category'
        ]);
    }
} 