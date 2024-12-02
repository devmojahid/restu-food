<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\KitchenStaffApplicationRequest;
use App\Models\KitchenStaffInquiry;
use App\Models\Restaurant;
use App\Services\Admin\KitchenStaffInquiryService;
use App\Http\Resources\KitchenStaffApplicationResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

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
                'restaurant_id' => $request->input('restaurant_id'),
                'per_page' => $request->input('per_page', 10),
                'sort' => $request->input('sort', 'created_at'),
                'direction' => $request->input('direction', 'desc'),
            ];

            // Get active restaurants for the dropdown
            $restaurants = Restaurant::query()
                ->where('status', 'active')
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            return Inertia::render('Admin/Kitchen/Applications/Index', [
                'applications' => $this->inquiryService->getPaginated($filters),
                'filters' => $filters,
                'restaurants' => $restaurants,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading kitchen staff applications', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return Inertia response with error flash message
            return Inertia::render('Admin/Kitchen/Applications/Index', [
                'applications' => [],
                'filters' => [],
                'restaurants' => [],
            ])->with('error', 'Error loading applications');
        }
    }

    /**
     * Show the application details
     *
     * @param KitchenStaffInquiry $inquiry
     * @return Response|RedirectResponse
     */
    public function show(KitchenStaffInquiry $inquiry): Response|RedirectResponse
    {
        try {
            $application = new KitchenStaffApplicationResource(
                $inquiry->load([
                    'restaurant',
                    'user',
                    'files',
                    'statusHistory' => fn($query) => $query->latest()
                ])
            );

            return Inertia::render('Admin/Kitchen/Applications/Show', [
                'application' => $application,
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error('Kitchen staff application not found', [
                'id' => $inquiry->id,
                'error' => $e->getMessage()
            ]);

            // Return Inertia response with error flash message
            return Inertia::render('Admin/Kitchen/Applications/Index', [
                'applications' => [],
                'filters' => [],
                'restaurants' => [],
            ])->with('error', 'Application not found');
        } catch (\Exception $e) {
            Log::error('Error showing kitchen staff application', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Return Inertia response with error flash message
            return Inertia::render('Admin/Kitchen/Applications/Index', [
                'applications' => [],
                'filters' => [],
                'restaurants' => [],
            ])->with('error', 'Error loading application details');
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
            Log::error('Kitchen staff application approval failed', [
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
            Log::error('Kitchen staff application rejection failed', [
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
} 