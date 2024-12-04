<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\KitchenStaffApplicationRequest;
use App\Models\KitchenStaffInquiry;
use App\Models\Restaurant;
use App\Models\RestaurantInquiry;
use App\Services\Admin\KitchenStaffInquiryService;
use App\Http\Resources\KitchenStaffApplicationResource;
use App\Http\Resources\RestaurantApplicationResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

final class KitchenStaffApplicationController extends Controller
{
    public function __construct(
        private readonly KitchenStaffInquiryService $inquiryService
    ) {}

    public function index(Request $request): Response
    {
        try {
            $filters = [
                'search' => $request->input('search'),
                'status' => $request->input('status'),
                'restaurant_id' => Auth::user()->restaurant_id,
                'experience_level' => $request->input('experience_level'),
                'position' => $request->input('position'),
                'availability' => $request->input('availability'),
                'certification' => $request->input('certification'),
                'per_page' => $request->input('per_page', 10),
                'sort' => $request->input('sort', 'created_at'),
                'direction' => $request->input('direction', 'desc'),
            ];

            // Get active restaurants with their applications
            $restaurants = Restaurant::query()
                ->with(['kitchenStaffInquiries' => function($query) {
                    $query->select('id', 'restaurant_id', 'status', 'status_history');
                }])
                ->where('status', 'active')
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            // Get recent activities
            $recentActivities = KitchenStaffInquiry::with(['restaurant', 'user'])
                ->select('id', 'restaurant_id', 'user_id', 'full_name', 'status', 'status_history', 'created_at')
                ->latest()
                ->take(5)
                ->get();

            return Inertia::render('Admin/Kitchen/Applications/Index', [
                'applications' => $this->inquiryService->getPaginated($filters),
                'filters' => $filters,
                'restaurants' => $restaurants,
                'statistics' => [
                    'total_applications' => KitchenStaffInquiry::count(),
                    'pending_applications' => KitchenStaffInquiry::where('status', 'pending')->count(),
                    'approved_applications' => KitchenStaffInquiry::where('status', 'approved')->count(),
                    'rejected_applications' => KitchenStaffInquiry::where('status', 'rejected')->count(),
                    'under_review' => KitchenStaffInquiry::where('status', 'under_review')->count(),
                    'restaurants_with_openings' => Restaurant::has('kitchenStaffInquiries')->count(),
                ],
                'recentActivities' => $recentActivities,
                'positions' => KitchenStaffInquiry::AVAILABLE_POSITIONS,
                'experienceLevels' => KitchenStaffInquiry::EXPERIENCE_LEVELS,
            ]);
        } catch (\Exception $e) {
            dd($e);
            Log::error('Error loading kitchen staff applications', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Admin/Kitchen/Applications/Index', [
                'applications' => [],
                'filters' => $filters ?? [],
                'restaurants' => [],
                'statistics' => [],
                'recentActivities' => [],
            ])->with('error', 'Error loading applications');
        }
    }

    public function show(KitchenStaffInquiry $inquiry): Response|RedirectResponse
    {
        try {
            // Load the kitchen staff application with related data
            $application = [
                'id' => $inquiry->id,
                'full_name' => $inquiry->full_name,
                'email' => $inquiry->email,
                'phone' => $inquiry->phone,
                'date_of_birth' => $inquiry->date_of_birth?->format('Y-m-d'),
                'gender' => $inquiry->gender,
                'status' => $inquiry->status,
                'created_at' => $inquiry->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $inquiry->updated_at?->format('Y-m-d H:i:s'),
                
                // Address Information
                'address' => $inquiry->address,
                'city' => $inquiry->city,
                'state' => $inquiry->state,
                'postal_code' => $inquiry->postal_code,
                'country' => $inquiry->country,
                
                // Professional Information
                'position_applied' => $inquiry->position_applied,
                'years_of_experience' => $inquiry->years_of_experience,
                'specializations' => $inquiry->specializations,
                'previous_experience' => $inquiry->previous_experience,
                'highest_education' => $inquiry->highest_education,
                'culinary_certificates' => $inquiry->culinary_certificates,
                
                // Availability
                'availability_hours' => $inquiry->availability_hours,
                'full_time' => $inquiry->full_time,
                'part_time' => $inquiry->part_time,
                'expected_salary' => $inquiry->expected_salary,
                'available_from' => $inquiry->available_from?->format('Y-m-d'),
                
                // Emergency Contact
                'emergency_contact_name' => $inquiry->emergency_contact_name,
                'emergency_contact_phone' => $inquiry->emergency_contact_phone,
                'emergency_contact_relationship' => $inquiry->emergency_contact_relationship,
                
                // Certifications
                'has_food_safety_certification' => $inquiry->has_food_safety_certification,
                'food_safety_certification_expiry' => $inquiry->food_safety_certification_expiry?->format('Y-m-d'),
                'has_health_certification' => $inquiry->has_health_certification,
                'health_certification_expiry' => $inquiry->health_certification_expiry?->format('Y-m-d'),
                
                // Additional Information
                'additional_notes' => $inquiry->additional_notes,
                'terms_accepted' => $inquiry->terms_accepted,
                'background_check_consent' => $inquiry->background_check_consent,
                
                // Restaurant Information
                'restaurant' => $inquiry->restaurant ? [
                    'id' => $inquiry->restaurant->id,
                    'name' => $inquiry->restaurant->name,
                    'address' => $inquiry->restaurant->address,
                ] : null,
                
                // Files
                // 'files' => [
                //     'resume' => $inquiry->getFirstMedia('resume')?->toArray(),
                //     'id_proof' => $inquiry->getFirstMedia('id_proof')?->toArray(),
                //     'certificates' => $inquiry->getMedia('certificates')->map->toArray(),
                //     'photo' => $inquiry->getFirstMedia('photo')?->toArray(),
                // ],
                
                // Status History
                // 'statusHistory' => $inquiry->statusHistory()->latest()->get()->map(function ($history) {
                //     return [
                //         'status' => $history->status,
                //         'comment' => $history->comment,
                //         'created_at' => $history->created_at?->format('Y-m-d H:i:s'),
                //         'user' => [
                //             'name' => $history->user->name,
                //         ],
                //     ];
                // }),
                
                // Verification Status
                'verificationStatus' => [
                    'identity' => $inquiry->verified_identity,
                    'qualifications' => $inquiry->verified_qualifications,
                    'references' => $inquiry->verified_references,
                    'documents' => $inquiry->verified_documents,
                ],
            ];

            return Inertia::render('Admin/Kitchen/Applications/Show', [
                'application' => $application,
                'relatedApplications' => KitchenStaffInquiry::where('restaurant_id', $inquiry->restaurant_id)
                    ->where('id', '!=', $inquiry->id)
                    ->with(['user'])
                    ->select('id', 'user_id', 'full_name', 'status', 'created_at')
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(function ($app) {
                        return [
                            'id' => $app->id,
                            'full_name' => $app->full_name,
                            'status' => $app->status,
                            'created_at' => $app->created_at?->format('Y-m-d H:i:s'),
                            'user' => [
                                'name' => $app->user->name,
                            ],
                        ];
                    }),
                'availabilitySchedule' => $inquiry->availability_hours,
            ]);
        } catch (\Exception $e) {
            dd($e);
            Log::error('Error showing kitchen staff application', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()
                ->back()
                ->with('error', 'Error loading application details');
        }
    }

    public function create(): Response
    {
        try {
            $restaurants = Restaurant::query()
                ->where('status', 'active')
                ->select('id', 'name', 'address', 'city', 'state')
                ->orderBy('name')
                ->get();

            return Inertia::render('Admin/Become/Kitchen', [
                'restaurants' => $restaurants,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading kitchen staff application form', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Admin/Become/Kitchen', [
                'restaurants' => [],
            ])->with('error', 'Error loading application form');
        }
    }

    public function store(KitchenStaffApplicationRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->id();
            
            // Handle file uploads
            $data['files'] = [
                KitchenStaffInquiry::COLLECTION_RESUME => $request->file('resume'),
                KitchenStaffInquiry::COLLECTION_ID_PROOF => $request->file('id_proof'),
                KitchenStaffInquiry::COLLECTION_CERTIFICATES => $request->file('certificates', []),
                KitchenStaffInquiry::COLLECTION_PHOTO => $request->file('photo'),
            ];

            $this->inquiryService->store($data);

            return redirect()
                ->route('dashboard')
                ->with('success', 'Your application has been submitted successfully.');
        } catch (\Exception $e) {
            Log::error('Kitchen staff application submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Error submitting application: ' . $e->getMessage());
        }
    }

    public function approve(KitchenStaffInquiry $inquiry): RedirectResponse
    {
        try {
            $this->inquiryService->approve($inquiry);

            return redirect()
                ->back()
                ->with('success', 'Application approved successfully');
        } catch (\Exception $e) {
            Log::error('Error approving kitchen staff application', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()
                ->back()
                ->with('error', 'Error approving application: ' . $e->getMessage());
        }
    }

    public function reject(KitchenStaffInquiry $inquiry, Request $request): RedirectResponse
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
            Log::error('Error rejecting kitchen staff application', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()
                ->back()
                ->with('error', 'Error rejecting application: ' . $e->getMessage());
        }
    }

    public function review(KitchenStaffInquiry $inquiry): RedirectResponse
    {
        try {
            $this->inquiryService->markAsUnderReview($inquiry);

            return redirect()
                ->back()
                ->with('success', 'Application marked as under review');
        } catch (\Exception $e) {
            Log::error('Kitchen staff application review status update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with('error', 'Error updating application status: ' . $e->getMessage());
        }
    }

    public function bulkApprove(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => ['required', 'array', 'min:1'],
                'ids.*' => ['required', 'exists:kitchen_staff_inquiries,id']
            ]);

            $this->inquiryService->bulkApprove($validated['ids']);

            return redirect()
                ->back()
                ->with('success', 'Selected applications approved successfully');
        } catch (\Exception $e) {
            Log::error('Bulk kitchen staff application approval failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with('error', 'Error approving selected applications: ' . $e->getMessage());
        }
    }

    public function bulkReject(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'ids' => ['required', 'array', 'min:1'],
                'ids.*' => ['required', 'exists:kitchen_staff_inquiries,id'],
                'reason' => ['required', 'string', 'min:10', 'max:1000']
            ]);

            $this->inquiryService->bulkReject($validated['ids'], $validated['reason']);

            return redirect()
                ->back()
                ->with('success', 'Selected applications rejected successfully');
        } catch (\Exception $e) {
            Log::error('Bulk kitchen staff application rejection failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with('error', 'Error rejecting selected applications: ' . $e->getMessage());
        }
    }

    public function destroy(KitchenStaffInquiry $inquiry): RedirectResponse
    {
        try {
            $this->inquiryService->delete($inquiry);

            return redirect()
                ->route('app.kitchen-staff.applications.index')
                ->with('success', 'Application deleted successfully');
        } catch (\Exception $e) {
            Log::error('Kitchen staff application deletion failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with('error', 'Error deleting application: ' . $e->getMessage());
        }
    }

    /**
     * Handle bulk operations with proper error handling
     */
    private function handleBulkOperation(array $ids, string $operation, ?string $reason = null): RedirectResponse
    {
        try {
            switch ($operation) {
                case 'approve':
                    $this->inquiryService->bulkApprove($ids);
                    $message = 'Selected applications approved successfully';
                    break;
                case 'reject':
                    $this->inquiryService->bulkReject($ids, $reason);
                    $message = 'Selected applications rejected successfully';
                    break;
                case 'delete':
                    $this->inquiryService->bulkDelete($ids);
                    $message = 'Selected applications deleted successfully';
                    break;
                default:
                    throw new \InvalidArgumentException('Invalid bulk operation');
            }

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            Log::error("Bulk {$operation} operation failed", [
                'ids' => $ids,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with('error', "Error performing bulk {$operation}: " . $e->getMessage());
        }
    }

    /**
     * Update verification status of the application
     */
    public function updateVerification(KitchenStaffInquiry $inquiry, Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'verification_type' => ['required', 'string', 'in:identity,qualifications,references,documents'],
                'status' => ['required', 'boolean'],
                'comment' => ['nullable', 'string', 'max:500'],
            ]);

            $this->inquiryService->updateVerification($inquiry, $validated);

            return redirect()
                ->back()
                ->with('success', 'Verification status updated successfully');
        } catch (\Exception $e) {
            Log::error('Error updating verification status', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with('error', 'Error updating verification status');
        }
    }

    /**
     * Schedule an interview for the applicant
     */
    public function scheduleInterview(KitchenStaffInquiry $inquiry, Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'interview_date' => ['required', 'date', 'after:today'],
                'interview_time' => ['required', 'date_format:H:i'],
                'interview_type' => ['required', 'string', 'in:in-person,video,phone'],
                'notes' => ['nullable', 'string', 'max:500'],
            ]);

            $this->inquiryService->scheduleInterview($inquiry, $validated);

            return redirect()
                ->back()
                ->with('success', 'Interview scheduled successfully');
        } catch (\Exception $e) {
            Log::error('Error scheduling interview', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()
                ->back()
                ->with('error', 'Error scheduling interview');
        }
    }
} 