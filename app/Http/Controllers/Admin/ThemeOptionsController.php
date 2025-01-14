<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\OptionsService;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

final class ThemeOptionsController extends Controller
{
    public function __construct(
        private readonly OptionsService $optionsService
    ) {}

    public function general(): Response
    {
        try {
            // Clear cache to ensure fresh data
            $this->optionsService->flushCache();
            
            // Get theme-specific options
            $themeOptions = $this->optionsService->getGroupKeyValues('theme');
            
            // Default settings
            $defaults = [
                'site_logo' => '',
                'site_favicon' => '',
                'site_title' => config('app.name'),
                'site_tagline' => '',
                'header_style' => 'default',
                'sticky_header' => true,
                'show_search' => true,
                'show_cart' => true,
                'footer_style' => 'default',
                'footer_logo' => '',
                'footer_text' => '',
                'copyright_text' => '© ' . date('Y') . ' ' . config('app.name') . '. All rights reserved.',
                'contact_phone' => '',
                'contact_email' => '',
                'contact_address' => '',
                'business_hours' => '',
                'social_facebook' => '',
                'social_twitter' => '',
                'social_instagram' => '',
                'social_linkedin' => '',
                'social_youtube' => '',
                'primary_color' => '#3b82f6',
                'secondary_color' => '#10b981',
                'heading_font' => 'Inter',
                'body_font' => 'Inter',
            ];

            // Merge defaults with saved options, preferring saved values when they exist
            $mergedOptions = array_merge(
                $defaults,
                array_filter($themeOptions, fn($value) => !empty($value))
            );

            return Inertia::render('Admin/Appearance/ThemeOptions/General', [
                'themeOptions' => $mergedOptions,
                'defaults' => $defaults
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load theme options', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Inertia::render('Admin/Appearance/ThemeOptions/General', [
                'themeOptions' => $defaults,
                'defaults' => $defaults,
                'error' => 'Failed to load theme options'
            ]);
        }
    }
}
