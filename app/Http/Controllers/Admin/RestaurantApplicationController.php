<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RestaurantApplicationRequest;
use App\Models\RestaurantInquiry;
use App\Services\Admin\RestaurantInquiryService;
use App\Http\Resources\RestaurantApplicationResource;
use App\Models\RestaurantApplication;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

final class RestaurantApplicationController extends Controller
{
    public function __construct(
        private readonly RestaurantInquiryService $inquiryService
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'per_page' => $request->input('per_page', 10),
            'sort' => $request->input('sort', 'created_at'),
            'direction' => $request->input('direction', 'desc'),
        ];

        return Inertia::render('Admin/Restaurants/Applications/Index', [
            'applications' => $this->inquiryService->getPaginated($filters),
            'filters' => $filters
        ]);
    }

    public function store(RestaurantApplicationRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->id();
            
            // Handle file uploads
            $data['files'] = [
                RestaurantInquiry::COLLECTION_BUSINESS_LICENSE => $request->input('business_license'),
                RestaurantInquiry::COLLECTION_OWNER_ID => $request->input('owner_id'),
                RestaurantInquiry::COLLECTION_RESTAURANT_PHOTOS => $request->input('restaurant_photos', []),
            ];

            $this->inquiryService->store($data);

            return redirect()
                ->route('dashboard')
                ->with('success', 'Your application has been submitted successfully.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Error submitting application: ' . $e->getMessage());
        }
    }

    public function approve(RestaurantInquiry $inquiry): RedirectResponse
    {
        try {
            // if (!auth()->user()->can('approve', $inquiry)) {
            //     throw new \Exception('You do not have permission to approve this application.');
            // }

            $this->inquiryService->approve($inquiry->id);

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Restaurant application approved successfully.'
                ]);
        } catch (\Exception $e) {
            Log::error('Restaurant application approval failed', [
                'id' => $inquiry->id,
                'error' => $e->getMessage(),
                'user_id' => auth()->user()->id
            ]);
            
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error approving application: ' . $e->getMessage()
                ]);
        }
    }

    public function reject(Request $request, RestaurantInquiry $inquiry): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'reason' => 'required|string|max:500'
            ]);

            $this->inquiryService->reject($inquiry->id, $validated['reason']);

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Restaurant application rejected successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error rejecting application: ' . $e->getMessage()
                ]);
        }
    }

    public function bulkApprove(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => 'required|array',
                'ids.*' => 'exists:restaurant_inquiries,id'
            ]);

            $this->inquiryService->bulkApprove($validated['ids']);

            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Selected applications approved successfully.'
                ]);
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Error approving applications: ' . $e->getMessage()
                ]);
        }
    }

    public function show(RestaurantInquiry $inquiry)
    {
        try {
            $application = $inquiry->load(['files']);

            return inertia('Admin/Restaurants/Applications/Show', [
                'application' => $application,
                'can' => [
                    'approve' => auth()->user()->can('approve', $inquiry),
                    'reject' => auth()->user()->can('reject', $inquiry),
                    'delete' => auth()->user()->can('delete', $inquiry),
                ]
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('app.restaurants.applications.index')
                ->with('error', 'Restaurant application not found.');
        } catch (\Exception $e) {
            Log::error('Error loading restaurant application', [
                'id' => $inquiry->id,
                'error' => $e->getMessage()
            ]);
            return redirect()->route('app.restaurants.applications.index')
                ->with('error', 'An error occurred while retrieving the application.');
        }
    }
} 