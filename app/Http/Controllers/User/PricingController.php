<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('user/Pricing');
    }
}
