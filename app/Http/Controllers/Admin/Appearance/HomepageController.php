<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Appearance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Appearance\UpdateHomepageRequest;
use App\Services\Admin\HomepageEditorService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Response;
use Inertia\Inertia;

final class HomepageController extends Controller
{
    public function __construct(
        private readonly HomepageEditorService $homepageEditor
    ) {}

    public function index(): Response
    {
        try {
            $settings = $this->homepageEditor->getSettings();
            $dynamicData = $this->homepageEditor->getDynamicData();
            $defaults = $this->homepageEditor->getDefaultSettings();

            return Inertia::render('Admin/Appearance/Homepage/Index', [
                'homepageOptions' => $settings,
                'defaults' => $defaults,
                'dynamicData' => $dynamicData,
                'can' => [
                    'update' => Auth::check() && Auth::user()->can('update', 'appearance'),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load homepage settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Admin/Appearance/Homepage/Index', [
                'homepageOptions' => [],
                'defaults' => $this->homepageEditor->getDefaultSettings(),
                'error' => 'Failed to load homepage settings: ' . $e->getMessage()
            ]);
        }
    }

    public function update(UpdateHomepageRequest $request)
    {
        try {
            // Process form data
            $data = $request->validated();
            
            // In Laravel 11's streamlined approach, we'll let the HomepageEditorService
            // handle the file processing directly via the request
            $this->homepageEditor->updateSettingsFromRequest($request);
            
            return redirect()->back()->with('success', 'Homepage settings updated successfully');
        } catch (\Exception $e) {
            Log::error('Failed to update homepage settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->with('error', 'Failed to save homepage settings: ' . $e->getMessage());
        }
    }
}
