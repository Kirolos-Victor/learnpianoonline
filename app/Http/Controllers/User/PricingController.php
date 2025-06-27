<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingController extends Controller
{
    public function index(): \Illuminate\Http\RedirectResponse|\Inertia\Response
    {
        if (Auth()->check()) {
            return redirect()->route('user.subscription');
        }
        return Inertia::render('user/Pricing');
    }
}
