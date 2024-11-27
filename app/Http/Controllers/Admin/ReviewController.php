<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReviewRequest;
use App\Models\Review;
use App\Services\Admin\ReviewService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class ReviewController extends Controller
{
    public function __construct(
        private readonly ReviewService $reviewService
    ) {}

    private function getReviewStats(): array
    {
        $totalCount = Review::count();
        $approvedCount = Review::where('is_approved', true)->count();
        $pendingCount = Review::where('is_approved', false)->count();
        $averageRating = Review::where('is_approved', true)->avg('rating') ?? 0;

        // Calculate trends (comparing to last month)
        $lastMonth = now()->subMonth();
        $lastMonthTotal = Review::where('created_at', '<', $lastMonth)->count();
        $lastMonthApproved = Review::where('is_approved', true)
            ->where('created_at', '<', $lastMonth)
            ->count();
        $lastMonthRating = Review::where('is_approved', true)
            ->where('created_at', '<', $lastMonth)
            ->avg('rating') ?? 0;

        return [
            'totalCount' => $totalCount,
            'approvedCount' => $approvedCount,
            'pendingCount' => $pendingCount,
            'averageRating' => $averageRating,
            'totalTrend' => $lastMonthTotal ? (($totalCount - $lastMonthTotal) / $lastMonthTotal) * 100 : 0,
            'approvedTrend' => $lastMonthApproved ? (($approvedCount - $lastMonthApproved) / $lastMonthApproved) * 100 : 0,
            'ratingTrend' => $lastMonthRating ? (($averageRating - $lastMonthRating) / $lastMonthRating) * 100 : 0,
        ];
    }

    public function index(): Response
    {
        $reviews = Review::with(['user', 'reviewable', 'approvedBy'])
            ->withCount(['replies', 'reports'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
            'stats' => $this->getReviewStats(),
        ]);
    }

    public function show(Review $review): Response
    {
        $review->load([
            'user',
            'reviewable',
            'approvedBy',
            'replies.user',
            'reports.user'
        ]);

        return Inertia::render('Admin/Reviews/Show', [
            'review' => $review
        ]);
    }

    public function approve(Review $review): RedirectResponse
    {
        $this->reviewService->approve($review);

        return back()->with('success', 'Review approved successfully.');
    }

    public function reject(Review $review): RedirectResponse
    {
        $this->reviewService->reject($review);

        return back()->with('success', 'Review rejected successfully.');
    }

    public function destroy(Review $review): RedirectResponse
    {
        $this->reviewService->delete($review);

        return redirect()
            ->route('app.reviews.index')
            ->with('success', 'Review deleted successfully.');
    }

    public function bulkApprove(ReviewBulkRequest $request): RedirectResponse
    {
        foreach ($request->validated('ids') as $id) {
            if ($review = Review::find($id)) {
                $this->reviewService->approve($review);
            }
        }

        return back()->with('success', 'Selected reviews approved successfully.');
    }

    public function bulkReject(ReviewBulkRequest $request): RedirectResponse
    {
        foreach ($request->validated('ids') as $id) {
            if ($review = Review::find($id)) {
                $this->reviewService->reject($review);
            }
        }

        return back()->with('success', 'Selected reviews rejected successfully.');
    }

    public function bulkDelete(ReviewBulkRequest $request): RedirectResponse
    {
        foreach ($request->validated('ids') as $id) {
            if ($review = Review::find($id)) {
                $this->reviewService->delete($review);
            }
        }

        return back()->with('success', 'Selected reviews deleted successfully.');
    }

    public function store(ReviewRequest $request): RedirectResponse
    {
        $this->reviewService->create($request->validated(), $request->reviewable_type, $request->reviewable_id);

        return back()->with('success', 'Review submitted successfully.');
    }

    public function update(ReviewRequest $request, Review $review): RedirectResponse
    {
        $this->reviewService->update($review, $request->validated());

        return back()->with('success', 'Review updated successfully.');
    }

    public function reply(ReviewRequest $request, Review $review): RedirectResponse
    {
        $this->reviewService->createReply($review, $request->validated());

        return back()->with('success', 'Reply added successfully.');
    }
} 