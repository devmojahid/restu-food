<?php

declare(strict_types=1);

namespace Modules\Frontend\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Inertia\Inertia;
use Modules\Frontend\Services\SupportService;  
use Illuminate\Http\Request;
use App\Http\Requests\SupportTicketRequest;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

final class SupportController extends Controller
{
    public function __construct(
        private readonly SupportService $supportService
    ) {}

    public function index(): Response
    {
        $data = $this->supportService->getSupportPageData();
        
        return Inertia::module('Frontend::Support/Index', [
            'hero' => $data['hero'],
            'supportCategories' => $data['supportCategories'],
            'faq' => $data['faq'],
            'ticketSubmission' => $data['ticketSubmission'],
            'liveChat' => $data['liveChat'],
            'contactMethods' => $data['contactMethods'],
            'resources' => $data['resources'],
            'communitySupport' => $data['communitySupport'],
            'statusUpdates' => $data['statusUpdates']
        ]);
    }

    public function submitTicket(SupportTicketRequest $request)
    {
        try {
            // Log the support ticket
            Log::info('Support ticket submitted', $request->validated());
            
            // In a real application, you'd process and store the ticket here
            // For example:
            // $ticket = SupportTicket::create($request->validated());
            
            // Here we're just returning a success response
            return back()->with('success', 'Support ticket submitted successfully. We\'ll get back to you shortly.');
        } catch (\Exception $e) {
            Log::error('Error submitting support ticket: ' . $e->getMessage());
            return back()->with('error', 'Sorry, there was a problem submitting your ticket. Please try again later.');
        }
    }

    public function startChat(Request $request)
    {
        // In a real application, this would initiate a chat session
        // For this example, we'll just return a JSON response
        return response()->json([
            'success' => true,
            'message' => 'Chat session initiated',
            'sessionId' => uniqid('chat_'),
            'timestamp' => now()->toIso8601String()
        ]);
    }
} 