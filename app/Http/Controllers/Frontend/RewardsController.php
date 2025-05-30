<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\RewardsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

final class RewardsController extends Controller
{
    public function __construct(
        private readonly RewardsService $rewardsService
    ) {}

    /**
     * Display the rewards/loyalty program page
     */
    public function index(): Response
    {
        $data = $this->rewardsService->getRewardsPageData();
        
        // Add user authentication status
        $data['userAuthenticated'] = auth()->check();
        
        return Inertia::render('Frontend/Rewards/Index', $data);
    }

    /**
     * Display detailed information about a specific reward
     */
    public function showReward(int $id): Response
    {
        // Get reward details
        $reward = $this->rewardsService->getRewardDetails($id);
        
        // Get related rewards
        $relatedRewards = $this->rewardsService->getRelatedRewards($id);
        
        // Get user points if authenticated
        $userPoints = auth()->check() 
            ? $this->rewardsService->getUserPoints(auth()->id()) 
            : 0;
        
        return Inertia::render('Frontend/Rewards/Show', [
            'reward' => $reward,
            'relatedRewards' => $relatedRewards,
            'userPoints' => $userPoints
        ]);
    }

    /**
     * Handle reward redemption
     */
    public function redeemReward(Request $request, int $id): RedirectResponse
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return redirect()->route('login')
                ->with('error', 'You must be logged in to redeem rewards.');
        }
        
        // Validate the request
        $request->validate([
            'rewardId' => 'required|integer'
        ]);
        
        // Process the redemption
        $result = $this->rewardsService->redeemReward(auth()->id(), $id);
        
        if ($result['success']) {
            return redirect()->back()
                ->with('success', $result['message']);
        } else {
            return redirect()->back()
                ->with('error', $result['message']);
        }
    }

    /**
     * Display user's rewards history
     */
    public function history(): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return Inertia::render('Frontend/Rewards/Index', [
                'error' => 'You must be logged in to view your rewards history.'
            ]);
        }
        
        $history = $this->rewardsService->getUserHistory(auth()->id());
        
        return Inertia::render('Frontend/Rewards/History', [
            'history' => $history
        ]);
    }

    /**
     * Display user's active rewards
     */
    public function myRewards(): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return Inertia::render('Frontend/Rewards/Index', [
                'error' => 'You must be logged in to view your rewards.'
            ]);
        }
        
        $activeRewards = $this->rewardsService->getUserActiveRewards(auth()->id());
        
        return Inertia::render('Frontend/Rewards/MyRewards', [
            'activeRewards' => $activeRewards
        ]);
    }
} 