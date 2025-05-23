<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Inertia\Inertia;

final class OfferController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Frontend/Offers/Index');
    }
} 