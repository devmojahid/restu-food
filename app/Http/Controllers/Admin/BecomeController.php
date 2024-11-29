<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
class BecomeController extends Controller
{
    public function restaurant(): Response
    {
        return Inertia::render('Admin/Become/Restaurant');
        
    }

    public function kitchen(): Response
    {
        return Inertia::render('Admin/Become/Kitchen');
    }

    public function delivery(): Response
    {
        return Inertia::render('Admin/Become/Delivery');
    }
}
