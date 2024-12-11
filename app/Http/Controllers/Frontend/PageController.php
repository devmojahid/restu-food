<?php

declare(strict_types=1);

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Response;
use Inertia\Inertia;

final class PageController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('Frontend/Pages/About');
    }

    public function contact(): Response
    {
        return Inertia::render('Frontend/Pages/Contact');
    }
} 