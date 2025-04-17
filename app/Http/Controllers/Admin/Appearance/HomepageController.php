<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Appearance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Appearance\UpdateHomepageRequest;
use App\Services\Admin\HomepageEditorService;
use Illuminate\Http\Request;
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
                    'update' => auth()->user()->can('update', 'appearance'),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load homepage settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Admin/Appearance/Homepage/Index', [
                'homepageOptions' => [],
                'defaults' => [],
                'error' => 'Failed to load homepage settings'
            ]);
        }
    }

    public function update(UpdateHomepageRequest $request)
    {
        try {
            $options = collect($request->validated('options'))->mapWithKeys(function ($item) {
                return [$item['key'] => $item['value']];
            })->toArray();

            dd($options, $request->allFiles());

            $this->homepageEditor->updateSettings($options, $request->allFiles());

            return back()->with('success', 'Homepage settings saved successfully');
        } catch (\Exception $e) {
            Log::error('Failed to save homepage settings', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to save homepage settings');
        }
    }
}
