<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Restaurant;
class BecomeController extends Controller
{
    public function restaurant(): Response
    {
        return Inertia::render('Admin/Become/Restaurant');
        
    }

    public function kitchen(): Response
    {
        $restaurants = Restaurant::where('status', 'active')
            ->select('id', 'name')
            ->orderBy('name')
            ->get();
        return Inertia::render('Admin/Become/Kitchen', [
            'restaurants' => $restaurants,
        ]);
    }

    public function delivery(): Response
    {
        return Inertia::render('Admin/Become/Delivery');
    }
}
