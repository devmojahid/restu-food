<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DeliveryStaffApplicationRequest;
use App\Models\DeliveryStaffInquiry;
use App\Services\Admin\DeliveryStaffInquiryService;
use App\Http\Resources\DeliveryStaffApplicationResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

final class DeliveryStaffApplicationController extends Controller
{
    public function __construct(
        private readonly DeliveryStaffInquiryService $inquiryService
    ) {}

    public function index(Request $request): Response
    {
        try {
            $filters = [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
                'vehicle_type' => $request->input('vehicle_type'),
                'per_page' => $request->input('per_page', 10),
                'sort' => $request->input('sort', 'created_at'),
                'direction' => $request->input('direction', 'desc'),
            ];

            // Get recent activities
            $recentActivities = DeliveryStaffInquiry::with(['user'])
                ->select('id', 'user_id', 'full_name', 'status', 'status_history', 'created_at')
                ->latest()
                ->take(5)
                ->get();

            return Inertia::render('Admin/DeliveryStaff/Applications/Index', [
                'applications' => $this->inquiryService->getPaginated($filters),
                'filters' => $filters,
                'statistics' => [
                    'total_applications' => DeliveryStaffInquiry::count(),
                    'pending_applications' => DeliveryStaffInquiry::where('status', 'pending')->count(),
                    'approved_applications' => DeliveryStaffInquiry::where('status', 'approved')->count(),
                    'rejected_applications' => DeliveryStaffInquiry::where('status', 'rejected')->count(),
                    'under_review' => DeliveryStaffInquiry::where('status', 'under_review')->count(),
                ],
                'recentActivities' => $recentActivities,
                'vehicleTypes' => DeliveryStaffInquiry::VEHICLE_TYPES,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading delivery staff applications', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Admin/DeliveryStaff/Applications/Index', [
                'applications' => [],
                'filters' => $filters ?? [],
                'statistics' => [],
                'recentActivities' => [],
            ])->with('error', 'Error loading applications');
        }
    }

    public function show(DeliveryStaffInquiry $inquiry): Response
    {
        try {
            return Inertia::render('Admin/DeliveryStaff/Applications/Show', [
                'application' => new DeliveryStaffApplicationResource($inquiry),
                'relatedApplications' => DeliveryStaffInquiry::where('id', '!=', $inquiry->id)
                    ->where(function($query) use ($inquiry) {
                        $query->where('city', $inquiry->city)
                            ->orWhere('vehicle_type', $inquiry->vehicle_type);
                    })
                    ->with(['user'])
                    ->select('id', 'user_id', 'full_name', 'status', 'created_at')
                    ->latest()
                    ->take(5)
                    ->get(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing delivery staff application', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()
                ->back()
                ->with('error', 'Error loading application details');
        }
    }

    public function store(DeliveryStaffApplicationRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = Auth::id();
            
            // Handle file uploads
            $data['files'] = [
                DeliveryStaffInquiry::COLLECTION_PROFILE_PHOTO => $request->file('profile_photo'),
                DeliveryStaffInquiry::COLLECTION_ID_PROOF => $request->file('id_proof'),
                DeliveryStaffInquiry::COLLECTION_DRIVING_LICENSE => $request->file('driving_license'),
                DeliveryStaffInquiry::COLLECTION_VEHICLE_INSURANCE => $request->file('vehicle_insurance'),
                DeliveryStaffInquiry::COLLECTION_VEHICLE_PHOTOS => $request->file('vehicle_photos', []),
            ];

            $this->inquiryService->store($data);

            return redirect()
                ->route('dashboard')
                ->with('success', 'Your application has been submitted successfully.');
        } catch (\Exception $e) {
            Log::error('Delivery staff application submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Error submitting application: ' . $e->getMessage());
        }
    }

    public function approve(DeliveryStaffInquiry $inquiry): RedirectResponse
    {
        try {
            $this->inquiryService->approve($inquiry);

            return redirect()
                ->back()
                ->with('success', 'Application approved successfully');
        } catch (\Exception $e) {
            Log::error('Error approving delivery staff application', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()
                ->back()
                ->with('error', 'Error approving application: ' . $e->getMessage());
        }
    }

    public function reject(DeliveryStaffInquiry $inquiry, Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'reason' => ['required', 'string', 'min:10', 'max:1000']
            ]);

            $this->inquiryService->reject($inquiry, $validated['reason']);

            return redirect()
                ->back()
                ->with('success', 'Application rejected successfully');
        } catch (\Exception $e) {
            Log::error('Error rejecting delivery staff application', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()
                ->back()
                ->with('error', 'Error rejecting application: ' . $e->getMessage());
        }
    }

    public function bulkApprove(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => ['required', 'array', 'min:1'],
                'ids.*' => ['required', 'exists:delivery_staff_inquiries,id']
            ]);

            $this->inquiryService->bulkApprove($validated['ids']);

            return redirect()
                ->back()
                ->with('success', 'Selected applications approved successfully');
        } catch (\Exception $e) {
            Log::error('Bulk delivery staff application approval failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with('error', 'Error approving selected applications: ' . $e->getMessage());
        }
    }
} 