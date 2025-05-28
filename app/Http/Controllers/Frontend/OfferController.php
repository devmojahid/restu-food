<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Services\Frontend\OfferService;
use Illuminate\Http\Request;
use Inertia\Response;

final class OfferController extends Controller
{
    public function __construct(
        private readonly OfferService $offerService
    ) {}

    public function index(): Response
    {
        try {
            $data = $this->offerService->getOffersPageData();
            
            return inertia('Frontend/Offers/Index', $data);
        } catch (\Throwable $e) {
            logger()->error('Error in offers index page: ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            
            return inertia('Frontend/Offers/Index', [
                'hero' => $this->offerService->getOffersPageData()['hero'] ?? [],
                'error' => 'Failed to load offers data. Please try again later.'
            ]);
        }
    }

    public function show(Request $request, int $id): Response
    {
        try {
            $offer = $this->offerService->getOfferDetails($id);
            
            if (!$offer) {
                return inertia('Frontend/Offers/Show', [
                    'error' => 'Offer not found',
                ]);
            }
            
            return inertia('Frontend/Offers/Show', [
                'offer' => $offer,
            ]);
        } catch (\Throwable $e) {
            logger()->error('Error in offer detail page: ' . $e->getMessage(), [
                'exception' => $e,
                'offer_id' => $id
            ]);
            
            return inertia('Frontend/Offers/Show', [
                'error' => 'Failed to load offer details. Please try again later.'
            ]);
        }
    }

    public function claim(Request $request, int $id)
    {
        try {
            // In a real app, this would validate the request, save the claim to the database, etc.
            // For now, we'll just return a success response
            
            return redirect()->back()->with('success', 'Offer claimed successfully! The code has been sent to your email.');
        } catch (\Throwable $e) {
            logger()->error('Error claiming offer: ' . $e->getMessage(), [
                'exception' => $e,
                'offer_id' => $id
            ]);
            
            return redirect()->back()->with('error', 'Failed to claim offer. Please try again later.');
        }
    }
} 