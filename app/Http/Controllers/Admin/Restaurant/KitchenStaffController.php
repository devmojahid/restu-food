<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Restaurant;

use App\Http\Controllers\Controller;
use App\Models\KitchenStaffInquiry;
use App\Models\Restaurant;
use App\Services\Admin\KitchenStaffInquiryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

final class KitchenStaffController extends Controller
{
    public function __construct(
        private readonly KitchenStaffInquiryService $inquiryService
    ) {}

    public function index(Request $request): Response
    {
        try {
            // Get the restaurant ID of the logged-in restaurant owner
            $restaurantId = Auth::user()->restaurant_id;

            $filters = [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
                'restaurant_id' => $restaurantId, // Force filter by restaurant
                'experience_level' => $request->input('experience_level'),
                'position' => $request->input('position'),
                'per_page' => $request->input('per_page', 10),
            ];

            // Get statistics for this restaurant
            $statistics = [
                'total_applications' => KitchenStaffInquiry::where('restaurant_id', $restaurantId)->count(),
                'pending_applications' => KitchenStaffInquiry::where('restaurant_id', $restaurantId)
                    ->where('status', 'pending')->count(),
                'approved_applications' => KitchenStaffInquiry::where('restaurant_id', $restaurantId)
                    ->where('status', 'approved')->count(),
                'under_review' => KitchenStaffInquiry::where('restaurant_id', $restaurantId)
                    ->where('status', 'under_review')->count(),
            ];

            return Inertia::render('Admin/Restaurant/Kitchen/Applications/Index', [
                'applications' => $this->inquiryService->getPaginatedForRestaurant($restaurantId, $filters),
                'filters' => $filters,
                'statistics' => $statistics,
                'positions' => KitchenStaffInquiry::AVAILABLE_POSITIONS,
                'experienceLevels' => KitchenStaffInquiry::EXPERIENCE_LEVELS,
            ]);
        } catch (\Exception $e) {
            return back()->with('error', 'Error loading applications: ' . $e->getMessage());
        }
    }

    public function show(KitchenStaffInquiry $inquiry): Response
    {
        // Ensure the inquiry belongs to the restaurant
        if ($inquiry->restaurant_id !== Auth::user()->restaurant_id) {
            abort(403);
        }

        return Inertia::render('Admin/Restaurant/Kitchen/Applications/Show', [
            'application' => $inquiry->load([
                'user',
                'statusHistory.user',
                'files',
            ]),
        ]);
    }

    public function updateStatus(KitchenStaffInquiry $inquiry, Request $request): RedirectResponse
    {
        // Ensure the inquiry belongs to the restaurant
        if ($inquiry->restaurant_id !== Auth::user()->restaurant_id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:under_review,approved,rejected'],
            'comment' => ['required', 'string', 'max:500'],
        ]);

        try {
            $this->inquiryService->updateStatus($inquiry, $validated['status'], $validated['comment']);
            return back()->with('success', 'Application status updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Error updating status: ' . $e->getMessage());
        }
    }

    public function scheduleInterview(KitchenStaffInquiry $inquiry, Request $request): RedirectResponse
    {
        // Ensure the inquiry belongs to the restaurant
        if ($inquiry->restaurant_id !== Auth::user()->restaurant_id) {
            abort(403);
        }

        $validated = $request->validate([
            'interview_date' => ['required', 'date', 'after:today'],
            'interview_time' => ['required', 'date_format:H:i'],
            'interview_type' => ['required', 'in:in-person,video,phone'],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        try {
            $this->inquiryService->scheduleInterview($inquiry, $validated);
            return back()->with('success', 'Interview scheduled successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Error scheduling interview: ' . $e->getMessage());
        }
    }
} 