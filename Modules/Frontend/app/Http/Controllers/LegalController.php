<?php

declare(strict_types=1);

namespace Modules\Frontend\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Frontend\Services\LegalService;  
use Inertia\Response;
use Inertia\Inertia;

final class LegalController extends Controller
{
    public function __construct(
        private readonly LegalService $legalService
    ) {}

    /**
     * Show the terms of service page
     */
    public function terms(): Response
    {
        $data = $this->legalService->getLegalPageData('terms');
        
        return $this->renderLegalPage('Terms', $data);
    }

    /**
     * Show the privacy policy page
     */
    public function privacy(): Response
    {
        $data = $this->legalService->getLegalPageData('privacy');
        
        return $this->renderLegalPage('Privacy', $data);
    }

    /**
     * Show the refund policy page
     */
    public function refund(): Response
    {
        $data = $this->legalService->getLegalPageData('refund');
        
        return $this->renderLegalPage('Refund', $data);
    }

    /**
     * Show the cookie policy page
     */
    public function cookie(): Response
    {
        $data = $this->legalService->getLegalPageData('cookie');
        
        return $this->renderLegalPage('Cookie', $data);
    }

    /**
     * Show the cancellation policy page
     */
    public function cancellation(): Response
    {
        $data = $this->legalService->getLegalPageData('cancellation');
        
        return $this->renderLegalPage('Cancellation', $data);
    }

    /**
     * Helper method to render legal pages with consistent structure
     */
    private function renderLegalPage(string $title, array $data): Response
    {
        return Inertia::module('Frontend::Legal/Index', [
            'pageTitle' => $title,
            'hero' => $data['hero'],
            'content' => $data['content'],
            'faq' => $data['faq'],
            'related' => $data['related'],
            'stats' => $data['stats'],
            'contact' => $data['contact']
        ]);
    }
} 