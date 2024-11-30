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

final class KitchenStaffApplicationController extends Controller
{
    public function __construct(
        private readonly KitchenStaffInquiryService $inquiryService
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'restaurant_id' => $request->input('restaurant_id'),
            'per_page' => $request->input('per_page', 10),
            'sort' => $request->input('sort', 'created_at'),
            'direction' => $request->input('direction', 'desc'),
        ];

        // Get active restaurants for the dropdown
        $restaurants = Restaurant::where('status', 'active')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Kitchen/Applications/Index', [
            'applications' => $this->inquiryService->getPaginated($filters),
            'filters' => $filters,
            'restaurants' => $restaurants,
        ]);
    }

    public function create(): Response
    {
        // Get active restaurants for the dropdown
        $restaurants = Restaurant::where('status', 'active')
            ->select('id', 'name', 'address', 'city', 'state')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Become/Kitchen', [
            'restaurants' => $restaurants,
        ]);
    }

    public function store(KitchenStaffApplicationRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->id();
            
            // Handle file uploads
            $data['files'] = [
                KitchenStaffInquiry::COLLECTION_RESUME => $request->input('resume'),
                KitchenStaffInquiry::COLLECTION_ID_PROOF => $request->input('id_proof'),
                KitchenStaffInquiry::COLLECTION_CERTIFICATES => $request->input('certificates', []),
                KitchenStaffInquiry::COLLECTION_PHOTO => $request->input('photo'),
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

    // ... [Continue with other controller methods]
} 